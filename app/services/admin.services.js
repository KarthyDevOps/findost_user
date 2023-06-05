const { statusCodes } = require("../response/httpStatusCodes");
const { statusMessage } = require("../response/httpStatusMessages");
const { messages } = require("../response/customMessages");
const { Admin } = require("../models/admin");
const bcrypt = require("bcryptjs");
//const { PermissionModules } = require("../models/permission-modules");
const {
  getDepartment_Details_By_Name,
  getAdminDetailsByEmail_or_MobileNumber,
  getAdminDetailsById,
  getAdminList,
  pageMetaService,
  getProfileById,
//   getDepartmentList,
//   getdropDownDepartmentList,
//   getDepartmentDetailsById,
  sendOTP_to_email,
  updateAdminProfileByEmail,
  getAdminProfile,
} = require("../helpers");
const { InternalServices } = require("../apiServices");
const { session } = require("../models/session");
const { generateAccessToken } = require("../utils");
//const { Department } = require("../models/departments");

// admin related api's

const adminLoginService = async (params) => {
  // get admin details by email
  let result = await getAdminDetailsByEmail_or_MobileNumber(params);
  if (result.status) {
 //   console.log('result-->', result)
    if (!result.data.isActive) {
      console.log('result 11-->', result)
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: statusMessage.notActive,
      };
    }
    if (result.data.isDeleted) {
      console.log('result 11-->', result)
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message:"user not found",
      };
    }
    const admin = result.data;
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
    //generate token with user details
    const token = await admin.generateAuthToken(result?.data);
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
  const adminDetails = await getAdminDetailsByEmail_or_MobileNumber(params);
  if (!adminDetails.status) {
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
  const result = await updateAdminProfileByEmail(params);
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
    message: messages?.otpSendSuccessful,
    data: [],
  };
};

const verifyOTPService = async (params) => {
  //get admin details by email
  const adminDetails = await getAdminDetailsByEmail_or_MobileNumber(params);
  if (!adminDetails.status) {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.userNotExist,
      data: [],
    };
  }
  let admin = JSON.stringify(adminDetails?.data);
  admin = JSON.parse(admin);
  if (adminDetails.status && admin) {
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
  const adminDetails = await getAdminDetailsByEmail_or_MobileNumber(params);
  if (!adminDetails.status) {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.userNotExist,
      data: [],
    };
  }
  let token = await createToken(adminDetails.data, '3h');
  console.log('token-->', token)
  let url = await process.env.FE_URL + process.env.ADMIN_RESET_PATH + token;

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
     //get admin details by email

  } catch (error) {
    console.log('error-->', error)
  }
 
 
};



const createToken = async (user, expiry) =>{
  
    try {
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
  const result = await getAdminDetailsByEmail_or_MobileNumber(params);
  if (result.status) {
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
  //get admin details by admin id
  const result = await getAdminProfile(params);
  if (result.status) {
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: statusMessage.success,
      data: result.data,
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
  const result = await getProfileById(params);
  if (result.status) {
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: statusMessage.success,
      data: result.data,
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
  delete params["adminId"];
  var query = { $set: params };

  //update admin details into admins table
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
  const id = params?.id;
  delete params["adminId"];
  var query = {
    $set: {
      isDeleted: true,
      updatedBy: params?.updatedBy,
      lastUpdatedBy: params?.lastUpdatedBy,
    },
  };

  //update admin details into admins table
  const result = await Admin.updateOne({ _id: id }, query);
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
  //get all admin list
  params.all = true;
  const allList = await getAdminList(params);
  //get all admin list created by admin
  params.all = params.returnAll ==true ? true : false;
  const result = await getAdminList(params);

  //calculate pagemeta for pages and count
  const pageMeta = await pageMetaService(params, allList?.data?.length || 0);
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    data: { list: result?.data, pageMeta },
  };
};

const adminLogoutService = async (params) => {
  var data = {
    token: null,
  };
  var newvalues = { $set: data };
  const resp = await Admin.updateOne({ _id: params?.userId }, newvalues);
  if (!resp.modifiedCount) {
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
    message: messages?.logoutSuccessful,
    data: [],
  };
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
    adminLogoutService,
    getAdminProfileByIdService
  };
  