const { statusCodes } = require("../response/httpStatusCodes");
const { statusMessage } = require("../response/httpStatusMessages");
const { messages } = require("../response/customMessages");
const { Admin } = require("../models/admin");
const {Sequence} = require('../models/sequence')
const bcrypt = require("bcryptjs");
const {
  pageMetaService,
  sendOTP_to_email,
} = require("../helpers");
const { InternalServices } = require("../apiServices");
const { session } = require("../models/session");
const { generateAccessToken } = require("../utils");
const { getSignedURL } = require("../utils/s3Utils");
const { mongoose } = require("mongoose");
const s3 = require("../handler/s3Handler")
const jwt = require("jsonwebtoken");
const util = require("util");
const fs = require('fs');

  const bucketName = process.env.AWS_BUCKET || 'findoc-development';
// admin related api's

const adminLoginService = async (params) => {
  // get admin details by email
  let result = await Admin.findOne({
    email: params?.email,
    isDeleted :false
  });
  console.log("result-->", result)
  if (result) {
    if (!result.isActive) {
      console.log('result-->', result)
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: statusMessage.notActive,
      };
    }
    if (result.isDeleted) {
      console.log('result 11-->', result)
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: "User not found",
      };
    }
    const admin = result;
    console.log("admin -->", admin)
    //compare given password and stored password by user
    const isMatch = await bcrypt.compare(params?.password, admin.password);
    if (!isMatch) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: statusMessage.invalidPwd,
        data: [],
      };
    }

    const token = jwt.sign(
      {
        _id: admin._id ? admin._id.toString() : "",
        name: admin.name ? admin.name.toString() : "",
        mobileNumber: admin.mobileNumber ? admin.mobileNumber.toString() : "",
        profileURL: admin.profileURL ? admin.profileURL.toString() : "",
      },
      process.env.JWT_ADMIN_SECRET,
      //  { expiresIn: process.env.TOKEN_EXPIRATION }
    );

    //generate token with admin details
    await Admin.findByIdAndUpdate({
      _id: admin._id
    }, {
      token: token
    });
    admin.token = token;
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: messages?.loginSuccessful,
      data: admin,
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

const sendOTPService = async (params) => {
  //get admin details by email
  const adminDetails = await Admin.findOne({
    email: params?.email,
  });
  if (!adminDetails) {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.userNotExist,
      data: [],
    };
  }
  //send otp to given email of user
  const otpResult = await sendOTP_to_email(params);
  const otp = otpResult.otp;
  //encryt the otp for security reason
  params.otp = await bcrypt.hash(otp.toString(), 4);

  //update new opt in table for relavent user
   const email = params?.email;
  delete params["email"];
  const query = {
    $set: params,
  };
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.otpSendSuccessful,
    data: [],
  };
};

const verifyOTPService = async (params) => {
  //get admin details by email
  const adminDetails = await Admin.findOne({
    email: params?.email,
  });;
  if (!adminDetails) {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.userNotExist,
      data: [],
    };
  }
  let admin = adminDetails;
  
  if (admin) {
    //compare given otp by user and store otp
    const isMatch = await bcrypt.compare(params.otp, admin.otp);
    if (!isMatch) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: messages?.invalidOTP,
        data: [],
      };
    }
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: messages?.otpVerifySuccessful,
      data: [],
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

const forgotPasswordService = async (params) => {

  try {
     //get admin details by email
  const adminDetails = await Admin.findOne({
    email: params?.email,
  });
  if (!adminDetails) {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.userNotExist,
      data: [],
    };
  }
  let token = await createToken(adminDetails, '3h');
  console.log('token-->', token)
  let url = await process.env.FE_URL +  token;

  InternalServices.sendEmail({
    to: params.email,
    subject: "Reset Password",
    template: "forgot_password",
    url: url
})
return {
  status: true,
  statusCode: statusCodes?.HTTP_OK,
  message: messages?.resetPassword,
  data: [],
};
  } catch (error) {
    console.log('error-->', error)
  }
 
 
};

const resetPasswordService = async (params) => {

  try {
    console.log('params-->', params)
    params.password = await bcrypt.hash(params?.password.toString(), 10);
    let password = {
      password : params.password
    } 
    let id = params.id
    const result = await Admin.findByIdAndUpdate(id,password);
    console.log('result--->', result)
    if (!result) {
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

  } catch (error) {
    console.log('error-->', error)
  }
 
 
};



const createToken = async (user, expiry) =>{
  
    try {
      console.log("user -->",user)
      const sessionData = await session.create({
        userId: user._id,
        userType:"Super Admin",
        status: "ACTIVE",
        loggedInAt: new Date(),
        createdBy:"Super Admin",
        updatedBy: "Super Admin"
    });
    return generateAccessToken({
        id: user._id,
        type: "ADMIN",
        roleId: user.roleId,
        role: user?.roleName || "",
        hasAllAccess: user?.hasAllAccess || false,
        sessionId: sessionData?._id?.toString()
    })
        }
     catch (error) {
        console.log("error", error);
        throw new Error(error);
    }
}


const addAdminService = async (params) => {
  //verify the given admin already exist or not
  const result = await Admin.findOne({
    email: params?.email,
    isDeleted:false
  });
  if (result) {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.adminExists,
      data: [],
    };
  }
  const password = params?.password;
  //encrypt given original password by bcrypt
  params.password = await bcrypt.hash(password.toString(), 10);

  //store admin details into Admin table
  const admin = new Admin(params);
  const details = await admin.save();
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.adminAdded,
    data: {
      _id: details._id,
    },
  };
};

const getAdminProfileService = async (params) => {
  console.log("params -->",params)
  //get admin details by admin id
  const result = await Admin.find(
    {
      $or:[{ adminId: params?.adminId }, {_id:params.id}]
    }
    ).lean();
  if (result) {
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: statusMessage.success,
      data: result,
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

const getAdminProfileByIdService = async (params) => {
  //get admin details by admin id
  console.log(params?.adminId)
  const result = await Admin.findOne({
    $or: [{ _id: params?.id }, { adminId: params?.adminId }],
    isDeleted: false,
  });
  if (result) {
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: statusMessage.success,
      data: result,
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


const updateAdminProfileService = async (params) => {
  const Id = params?.id;
  if(params.password && params.password !='')
  {
    params.password = await bcrypt.hash(params?.password.toString(), 10);
  }
  else
  {
    delete params.password
  }
  var query = { $set: params };
  console.log('query-->', query)
  const result = await Admin.updateOne({ _id: Id }, query);
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

const deleteAdminService = async (params) => {
  let ids= [];
  if(params.id) ids.push(params?.id); else if(params.ids) {
ids = params.ids 
  }
  const id = params?.id ;
  console.log("id -->",id)
  var query = {
    $set: {
      isDeleted: true,
      updatedBy: params?.updatedBy,
      lastUpdatedBy: params?.lastUpdatedBy,
    },
  };
//console.log(pa)
  //update admin details into admins table
  console.log("id-->",ids)


  const result = await Admin.updateMany({_id:ids}, query);
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

const adminListService = async (params) => {
  try {
    
    let cond = {};  
    cond.isDeleted = false 
    let page = params?.page || 1;
    page = Number(page);
    let limit = params?.size || 10;
    limit = Number(limit);

    if (params.search) {
      cond.$or = [
        { adminId: { $regex: `${params?.search}`, $options: "i" } },
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
    
    let totalCount = await Admin.find(cond).countDocuments();
    let data = await Admin.find(cond).sort({ createdAt: -1}).skip(limit * (page - 1)).limit(limit);
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
        data:{ list: data, pageMeta },
      };

    }
     


}
catch (error) {
  console.log("error", error);
  throw new Error(error);
}
}

const uploadImageService = async (req) => {
  let type = 'images'
  var {
    tempFilePath,
    name,
    mimetype,
    size,
  } = req.files.data;
  console.log('req.files.data',req.files.data)
  let fileName = name
  name = `${type}/`+ name + new Date().getTime()

  const params = {
    Bucket: bucketName,
    Body: fs.readFileSync(tempFilePath),
    Key: `${name}`,
    ContentType: mimetype,
    //ACL: "public-read",
  };
  const upload = util.promisify(s3.upload).bind(s3);
  const location = (await upload(params)).Location;
  const s3URL = getSignedURL(name);
  const data = {
    key: name,
   // location: location,
    fileName : fileName,
    s3URL:s3URL,
    mimetype : mimetype,
    size : size
  };
 
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.updated,
    data: {data : data},
  };
};

const getSequenceIdService = async (req) => {
  console.log("req-->",req?.body)
  let counter = await Sequence.findOneAndUpdate({type:req?.body?.type}, {$inc: { count: 1} })
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.updated,
    data:counter,
  };
};

const getImageBlobService = async (key,res) => { 
  const s3Object = await s3.getObject({
    Bucket: bucketName,
    Key: key,
  }).promise();

  if(s3Object)
  {

  

      
    let data =  {
      ContentType : s3Object.ContentType,
      Body : s3Object.Body
    }
  
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: messages?.updated,
      data: {data : data},
    };
  }
  else
  {
    return {
      status:false,
      statusCode: statusCodes?.HTTP_OK,
      data:{ },
    };
  }
 
};

module.exports = {
    adminLoginService,
    sendOTPService,
    forgotPasswordService,
    verifyOTPService,
    resetPasswordService,
    addAdminService,
    getAdminProfileService,
    updateAdminProfileService,
    deleteAdminService,
    adminListService,
    getAdminProfileByIdService,
    uploadImageService,
    getSequenceIdService,
    getImageBlobService
  };
