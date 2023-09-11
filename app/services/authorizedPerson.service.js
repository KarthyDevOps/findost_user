const {
  convert_JSON_to_file,
  getauthorizedPersonDetailsByEmail_or_MobileNumber,
  getauthorizedPersonDetailsById,
  getauthorizedPersonList,
  pageMetaService,
  sendOTP_to_mobileNumber,

  authorizedPersonbyId,
} = require("../helpers");
const { authorizedPersons } = require("../models/authorizedPersons");
const { messages } = require("../response/customMessages");
const { statusCodes } = require("../response/httpStatusCodes");
const bcrypt = require("bcryptjs");
const { statusMessage } = require("../response/httpStatusMessages");
//const { authorizedPersonsAddress } = require("../models/authorizedPerson-address");
const moment = require("moment-timezone");
const jwt = require("jsonwebtoken");
const { InternalServices } = require("../apiServices");
//authorizedPerson profile related api's

const authorizedPersonLoginService = async (params) => {
  //get authorizedPerson details by given email or mobileNumber
  const data = await authorizedPersons.findOne({
    $or: [
      { email: params?.email },
      { mobileNumber: params?.mobileNumber },
      { authorizedPersonId: params?.authorizedPersonId },
      // { _id: mongoose.Types.ObjectId(params?.authorizedPersonId) },
    ],
  });  
  if (data) {
    const authorizedPerson = data;
    //send OTP to given mobile number for verification
    const otp = await sendOTP_to_mobileNumber(authorizedPerson);
    console.log(otp.toString());
    //hash the generated otp by bcypt
    authorizedPerson.otp = await bcrypt.hash(otp.toString(), 4);

    //store authorizedPerson details into authorizedPersons table
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
  const data = await authorizedPersons.findOne({
    $or: [
      { email: params?.email },
      { mobileNumber: params?.mobileNumber },
      { authorizedPersonId: params?.authorizedPersonId },
      // { _id: mongoose.Types.ObjectId(params?.authorizedPersonId) },
    ],
  });
  console.log("result", data);
  if (data) {
    //   console.log('result-->', result)
    if (!data.isActive) {
      console.log("result 11-->", result);
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
     const authorizedPerson = data;
    //compare given password and stored password by user
    const isMatch = await bcrypt.compare(
      params?.password,
      authorizedPerson.password
    );
    if (!isMatch) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: statusMessage.invalidAPpwd,
        data: [],
      };
    }
    //generate token with user details
    // const token = await authorizedPerson.generateAuthToken(data);

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
      message: messages?.loginSuccessful,
      data: authorizedPerson,
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
  });

  if (data) {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.authorizedPersonExists,
      data: [],
    };
  }
  const password = params?.password;
  //encrypt given original password by bcrypt
  params.password = await bcrypt.hash(password.toString(), 10);

  console.log('first', params.business?.segmentSelection)

  if(params.business?.segmentSelection.length > 0){

    let data = params.business?.segmentSelection.reduce((a,b)=>{
         return a + parseInt(b.segmentCharge);
    },0)
    params.paymentDetails = {}
    params.paymentDetails.segmentTotalCharge = data

  }
  //migrating authorizedPerson to authorizedPersons and store authorizedPerson details into authorizedPersons table
  const authorizedPerson = await new authorizedPersons(params);
  const details = await authorizedPerson.save();
  let passData = {
    type:"AP_CREATED_NOTIFICATION",
    userId : details.authorizedPersonId,
    authorizedPersonId : details.authorizedPersonId,
    extra : {
      authorizedPersonId:details.authorizedPersonId
    }
  }
  await InternalServices.postAPCreationNotification(passData)
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.authorizedPersonAdded,
    data: { _id: details._id },
  };
};

const getauthorizedPersonProfileService = async (params) => {
  console.log("params1");
  //get authorizedPerson details by authorizedPerson id

  let data = await authorizedPersons.findOne({
    $or: [{ _id: params?.id }, { _id: params?.authorizedPersonId }],
    isDeleted: false,
  });

  data = JSON.parse(JSON.stringify(data))

  const currentTime = moment();

  const morningStart = moment("06:00:00", "HH:mm:ss");
  
  const afternoonStart = moment("12:00:00", "HH:mm:ss");

 
 
  if (currentTime.isBefore(morningStart)) {

    data.showtime = "Good Evening"
 
  } else if (currentTime.isBefore(afternoonStart)) {

    data.showtime = "Good Morning"

  } else {
    data.showtime = "Good Afternoon"
  }
  
console.log('showtime-->', data.showtime)
  

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
