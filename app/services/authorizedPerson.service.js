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
const { InternalServices } = require("../apiServices");
//authorizedPerson profile related api's

const authorizedPersonLoginService = async (params) => {
  //get authorizedPerson details by given email or mobileNumber
  const result = await getauthorizedPersonDetailsByEmail_or_MobileNumber(
    params
  );
  if (result.status) {
    const authorizedPersons = result.data;

    //send OTP to given mobile number for verification
    const otp = await sendOTP_to_mobileNumber(authorizedPersons);
    console.log(otp.toString());
    //hash the generated otp by bcypt
    authorizedPersons.otp = await bcrypt.hash(otp.toString(), 4);

    //store authorizedPerson details into authorizedPersons table
    await authorizedPersons.save();
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: messages?.otpSendSuccessful,
      data: {
        mobileNumber : authorizedPersons.mobileNumber
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

const authorizedPersonSendLoginIdService = async (params) => {
  // get admin details by email
  let result = await getauthorizedPersonDetailsByEmail_or_MobileNumber(params);
  console.log("result", result);
  if (result.status) {
    //   console.log('result-->', result)
    if (!result.data.isActive) {
      console.log("result 11-->", result);
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: statusMessage.notActive,
      };
    }
    if (result.data.isDeleted) {
      console.log("result 11-->", result);
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: "user not found",
      };
    }
    const authorizedPerson = result.data;
    //compare given password and stored password by user
    const isMatch = await bcrypt.compare(
      params?.password,
      authorizedPerson.password
    );
    if (!isMatch) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: statusMessage.invalidPwd,
        data: [],
      };
    }
    //generate token with user details
    const token = await authorizedPerson.generateAuthToken(result?.data);
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


const authorizedPersonLoginByIdService = async (params) => {
  // get admin details by email
  let result = await getauthorizedPersonDetailsByEmail_or_MobileNumber(params);
  console.log("result", result);
  if (result.status) {
    //   console.log('result-->', result)
    if (!result.data.isActive) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: statusMessage.notActive,
      };
    }
    if (result.data.isDeleted) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: "user not found",
      };
    }
    let data = await InternalServices.sendEmail({
      to: params.email,
      subject: "Login Credentials",
      template: "forgot_password",
      url: result?.data?.authorizedPersonId,
    });
    if (data.status) {
      return {
        status: true,
        statusCode: statusCodes?.HTTP_ACCEPTED,
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

const authorizedPersonVerifyOTPService = async (params) => {
  //get authorizedPerson details by given email or mobileNumber
  const result = await getauthorizedPersonDetailsByEmail_or_MobileNumber(
    params
  );
  var authorizedPersons = result.data;
  if (result.status) {
    const isMatch = await bcrypt.compare(params.otp, authorizedPersons.otp);
    if (!isMatch) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: messages?.invalidOTP,
        data: [],
      };
    }
    //generate token with authorizedPerson details
    const token = await authorizedPersons.generateAuthToken();
    authorizedPersons.token = token;
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: messages?.otpVerifySuccessful,
      data: { _id: authorizedPersons._id, token: authorizedPersons.token },
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

const addauthorizedPersonService = async (req, params) => {
  //verify the given person already exist or not
  const result = await getauthorizedPersonDetailsByEmail_or_MobileNumber(
    params
  );
  if (result.status) {
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

  //migrating authorizedPerson to authorizedPersons and store authorizedPerson details into authorizedPersons table
  const authorizedPerson = await new authorizedPersons(params);
  const details = await authorizedPerson.save();
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
  const result = await getauthorizedPersonDetailsById(params);
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
  //get all authorizedPerson list
  const allList = await getauthorizedPersonList();
  console.log("allList", allList);

  //calculate pagemeta for pages and count
  const pageMeta = await pageMetaService(params, allList?.data?.length || 0);
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    data: { list: allList?.data, pageMeta },
  };
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
  authorizedPersonLoginByIdService,
};
