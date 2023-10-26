const {  pageMetaService, sendOTP_to_mobileNumber } = require("../helpers");

const { authorizedPersons } = require("../models/authorizedPersons");
const {BOUSERS} = require("../models/BOUsers");

const { messages } = require("../response/customMessages");
const { statusCodes } = require("../response/httpStatusCodes");
const bcrypt = require("bcryptjs");
const { statusMessage } = require("../response/httpStatusMessages");

const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const { InternalServices } = require("../apiServices");


const generateRandomPassword = require("../helpers/generatePassword");



const authorizedPersonLoginService = async (params) => {
  //get authorizedPerson details by given email or mobileNumber
  const data = await authorizedPersons.findOne({
    $or: [
      { email: params?.email },
      { mobileNumber: params?.mobileNumber },
      { authorizedPersonId: params?.authorizedPersonId }
    ],
  });  
  if (data) {
    const authorizedPerson = data;
   
    const otp = await sendOTP_to_mobileNumber(authorizedPerson);
    console.log(otp.toString());
    authorizedPerson.otp = await bcrypt.hash(otp.toString(), 4);

 
    await authorizedPersons.findByIdAndUpdate({
      _id:data._id
    },{otp:authorizedPerson.otp});
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: messages?.otpSendSuccessful,
      data: {
        mobileNumber : authorizedPerson.mobileNumber
      },
    };
  } else {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.userNotExist,
      data: [],
    };
  }
};

const authorizedPersonVerifyOTPService = async (params) => {
  //get authorizedPerson details by given email or mobileNumber
  const data = await authorizedPersons.findOne({
    $or: [
      { email: params?.email },
      { mobileNumber: params?.mobileNumber },
      { authorizedPersonId: params?.authorizedPersonId },
      // { _id: mongoose.Types.ObjectId(params?.authorizedPersonId) },
    ],
  });
  var authorizedPerson = data;
  if (data) {
    const isMatch = await bcrypt.compare(params.otp, authorizedPerson.otp);
    if (!isMatch) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: messages?.invalidOTP,
        data: [],
      };
    }
    //generate token with authorizedPerson details
    const token = jwt.sign(
      {
        _id: authorizedPerson._id ? authorizedPerson._id.toString() : "",
        name: authorizedPerson.name ? authorizedPerson.name.toString() : "",
        email: authorizedPerson.email ? authorizedPerson.email.toString() : "",
        mobileNumber: authorizedPerson.mobileNumber
          ? authorizedPerson.mobileNumber.toString()
          : "",
        profileURL: authorizedPerson.profileURL
          ? authorizedPerson.profileURL.toString()
          : "",
      },
      process.env.JWT_authorizedPerson_SECRET,

      { expiresIn: process.env.TOKEN_EXPIRATION }
    );
    // authorizedPerson.token = token;
    await authorizedPersons.findByIdAndUpdate({
      _id: authorizedPerson._id
    }, {
      token: token
    });
    authorizedPerson.token = token;
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: messages?.otpVerifySuccessful,
      data: { _id: authorizedPerson._id, token: authorizedPerson.token },
    };
  } else {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.userNotExist,
      data: [],
    };
  }
};


const authorizedPersonSendLoginIdService = async (params) => {
  // get admin details by email
  let resp = await InternalServices.korpAuthentication(params);
  if(resp && resp.access_token)
  {
    console.log('11')
    params.token = resp.access_token
   // let profileData = await InternalServices.korpClientProfile(params);
    let isExist = await BOUSERS.findOne({
      BOUserId : params.authorizedPersonId
    })
    if(isExist)
    {
      console.log('1')
      await BOUSERS.updateOne({
        BOUserId : params.authorizedPersonId
      }, {
        token: params.token
      });
    }
    else
    {
      console.log('2')
      await BOUSERS.create({
        BOUserId : params.authorizedPersonId,
        password : params.password,
        token : params.token
      })
    }
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: messages?.loginSuccessful,
      data: {
        token : resp.access_token,
        details : resp 
      },
    };

  }
  else
  {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.userNotExist,
      data: [],
    };
  }
};


const authorizedPersonSendMailIdService = async (params) => {
  // get admin details by email
  const data = await authorizedPersons.findOne({
    email: params?.email
  });
  if (data) {
    console.log("data -->",data)
    if (!data.isActive) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: statusMessage.notActive,
      };
    }
    if (data.isDeleted) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: "User not found",
      };
    }
    let sendMail = await InternalServices.sendEmail({
      to: params.email,
      subject: "Login Credentials",
      template: "forgot_password",
      url:data?.authorizedPersonId,
    });
    if (sendMail.status) {
      return {
        status: true,
        statusCode: statusCodes?.HTTP_OK,
        message: messages?.mailSent,
        data: [],
      };
    } else {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_INTERNAL_SERVER_ERROR,
        message: messages?.serverError,
        data: [],
      };
    }
  } else {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.userNotExist,
      data: [],
    };
  }
};


const addauthorizedPersonService = async (req, params) => {
  //verify the given person already exist or not
  const data = await authorizedPersons.findOne({
    $or: [
      { email: params?.email },
      { mobileNumber: params?.mobileNumber },
    ],
    isDeleted:false
  });

  if (data) {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.authorizedPersonExists,
      data: [],
    };
  }

  let genratePassword = await generateRandomPassword(8)

  
  console.log('genratePassword-->', genratePassword)


  //encrypt given original password by bcrypt

  params.password = await bcrypt.hash(genratePassword.toString(), 10);

  console.log('first', params.business?.segmentSelection)

  if(params.business?.segmentSelection.length > 0){

    let data = params.business?.segmentSelection.reduce((a,b)=>{
         return a + parseInt(b.segmentCharge);
    },0)
    
    if(!params.paymentDetails)
    {
      params.paymentDetails = {
      }
    }
    params.paymentDetails.segmentTotalCharge = data + ((data * 18) /100)

  }

 if (!params.settings) {
   params.settings = {
     isDarkTheme: false,
     isEnableBioMetricLogin: false,
     isMyNotificationSettings: false,
     isInsurenceNotification: false,
     isMutualFundsNotification: false,
     isEquityNotification: false,
     isSIPNotification: false,
     isIPONotification: false,
     isLoanNotification: false,
   };
 }

  //migrating authorizedPerson to authorizedPersons and store authorizedPerson details into authorizedPersons table

  const authorizedPerson = await new authorizedPersons(params);

  let details = await authorizedPerson.save();

  genratePassword = JSON.parse(JSON.stringify(genratePassword))

  genratePassword.authorizedPersonId = details.authorizedPersonId


  //  InternalServices.sendEmail({
  //    to: params?.email,
  //    subject: "FINDOC || YOUR PASSWORD",
  //    url: `Your Password is ${String(genratePassword)}`,
  //  });

  let passData = {
    type:"AP_CREATED_NOTIFICATION",
    userId : details.authorizedPersonId,
    authorizedPersonId : details.authorizedPersonId,
    extra : {
      authorizedPersonId:details.authorizedPersonId
    }
  }

   InternalServices.postAPCreationNotification(passData)

  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.authorizedPersonAdded,
    data:details,
  };
};

const getauthorizedPersonProfileService = async (params) => {
  console.log("params1");
  //get authorizedPerson details by authorizedPerson id

  let data = await authorizedPersons.findOne({
    $or: [{ _id: params?.id }, { _id: params?.authorizedPersonId }],
    isDeleted: false,
  });
  if(!data.profileURL)
  {
    data.profileURL = null
  }
  if (data) {
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: statusMessage.success,
      data: data,
    };
  } else {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.userNotExist,
      data: [],
    };
  }
};

const updateauthorizedPersonProfileService = async (params) => {
  const authorizedPersonId = params?.authorizedPersonId;
  delete params["authorizedPersonId"];
  var query = { $set: params };

  //update authorizedPerson details into authorizedPersons table
  const result = await authorizedPersons.updateOne(
    { _id: authorizedPersonId },
    query
  );
  console.log("result -->", result);
  if (!result.modifiedCount) {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.userNotExist,
      data: [],
    };
  }
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.updated,
    data: [],
  };
};

const deleteauthorizedPersonService = async (params) => {
  const authorizedPersonId = params?.authorizedPersonId;
  delete params["authorizedPersonId"];
  var query = {
    $set: {
      isDeleted: true,
      updatedBy: params?.updatedBy,
      lastUpdatedBy: params?.lastUpdatedBy,
    },
  };

  //update authorizedPerson details into authorizedPersons table
  const result = await authorizedPersons.updateOne(
    { _id: authorizedPersonId },
    query
  );
  if (!result.modifiedCount) {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.userNotExist,
      data: [],
    };
  }
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.deleted,
    data: [],
  };
};

const authorizedPersonListService = async (params) => {
  try {
    
    let cond = {};  
    cond.isDeleted = false 
    let page = params?.page || 1;
    page = Number(page);
    let limit = params?.limit || 10;
    limit = Number(limit);

    if (params?.all) {
      let data = await authorizedPersons.find({
        isDeleted: false
      });

      if (data.length > 0) {
        return {
          status: true,
          statusCode: statusCodes?.HTTP_OK,
          data: data,
        };

      }
      else {
        return {
          status: false,
          statusCode: statusCodes?.HTTP_OK,
          data: [],
        };

      }
    }

    if (params.search) {
      cond.$or = [
        { authorizedPersonId: { $regex: `${params?.search}`, $options: "i" } },
        { name: { $regex: `${params?.search}`, $options: "i" } },
        { email: { $regex: `${params?.search}`, $options: "i" } },
      ];
    }
    if(params.role){
      cond.role = params?.role  
    }
    if(params.isActive){
      cond.isActive = params?.isActive  
    }
    let totalCount = await authorizedPersons.find(cond).countDocuments();
    let data = await authorizedPersons.find(cond).sort({ createdAt: -1}).skip(limit * (page - 1)).limit(limit);
    const pageMeta = await pageMetaService(params,totalCount);
    if (data.length > 0) {
      return {
        status: true,
        statusCode: statusCodes?.HTTP_OK,
        data: { list: data, pageMeta },
      };

    }
    else {
      return {
        status:false,
        statusCode: statusCodes?.HTTP_OK,
        data: { list: data, pageMeta },
      };

    }
}
catch (error) {
  console.log("error", error);
  throw new Error(error);
}
};



const authorizedPersonResetPasswordService = async (params) => {
  try {

    if (params?.password !== params?.confirmPassword) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: statusMessage.passwordMismatch,
        data: [],
      };
    }

    if(params.currentPassword) {
      console.log('params-->', params)
      const authorizedPerson = await authorizedPersons.findOne({
        email: params.email,
      });
      const isMatch = await bcrypt.compare(params?.currentPassword, authorizedPerson.password);
      if (!isMatch) {
        return {
          status: false,
          statusCode: statusCodes?.HTTP_BAD_REQUEST,
          message: statusMessage.invalidPwd,
          data: [],
        };
      }
    }
   
    let password = await bcrypt.hash(params.password.toString(), 10);
    var query = { $set: {password : password} };
    //update authorizedPerson details into authorizedPersons table
    const result = await authorizedPersons.updateOne(
      { _id: params.authorizedPersonId },
      query
    );
    console.log("result -->", result);
    if (!result.modifiedCount) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: messages?.userNotExist,
        data: [],
      };
    }
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: messages?.updated,
      data: [],
    };
  }
  catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};


const validateCouponService = async (params) => {
  try {
    if(params.couponCode.toString() == process.env.AP_REGISTER_DISCOUNT_COUPON.toString())
    {
      return {
        status: true,
        statusCode: statusCodes?.HTTP_OK,
        message: messages?.success,
        data: {
          couponCode :params.couponCode, 
          couponPercentage :process.env.AP_REGISTER_DISCOUNT_COUPON_PERCENTAGE
        },
      };
    }
    else
    {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: 'Invaid Coupon',
        data: [],
      };
    }
  }
  catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
};




module.exports = {
  authorizedPersonLoginService,
  authorizedPersonVerifyOTPService,
  addauthorizedPersonService,
  getauthorizedPersonProfileService,
  updateauthorizedPersonProfileService,
  deleteauthorizedPersonService,
  authorizedPersonListService,
  authorizedPersonSendLoginIdService,
  authorizedPersonSendMailIdService,
  authorizedPersonResetPasswordService,
  validateCouponService
};
