const mongoose = require("mongoose");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../response/response");

const {
  addauthorizedPersonService,
  authorizedPersonLoginService,
  updateauthorizedPersonProfileService,
  authorizedPersonVerifyOTPService,
  getauthorizedPersonProfileService,
  authorizedPersonListService,
  deleteauthorizedPersonService,
  authorizedPersonSendLoginIdService,
  authorizedPersonSendMailIdService,
  authorizedPersonResetPasswordService
} = require("../services/authorizedPerson.service");

//authorizedPerson profile related api's

const authorizedPersonLogin = async (req, res) => {
  const params = req.body;
  const result = await authorizedPersonLoginService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const authorizedPersonMailLoginById = async (req, res) => {
  const params = req.body;
  const result = await authorizedPersonSendMailIdService(params);
  console.log('result111--->', result)
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const authorizedPersonLoginById = async (req, res) => {
  const params = req.body;
  const result = await authorizedPersonSendLoginIdService(params);
  console.log('result111--->', result)
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};



const authorizedPersonverifyOTP = async (req, res) => {
  const params = req.body;
  const result = await authorizedPersonVerifyOTPService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const authorizedPersonSendLoginId = async (req, res) => {
  const params = req.body;
  const result = await authorizedPersonVerifyOTPService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};


const addauthorizedPerson = async (req, res) => {
  const params = req.body;
  params.createdBy =
    req?.user?._id?.toString() ||
    new mongoose.Types.ObjectId("64631448ebfae840423f4d16");
  params.updatedBy =
    req?.user?._id?.toString() ||
    new mongoose.Types.ObjectId("64631448ebfae840423f4d16");
  params.lastUpdatedBy = req?.user?.userType;
  const result = await addauthorizedPersonService(req, params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const getauthorizedPersonProfile = async (req, res) => {
  console.log("data");
  let params = {};
  params.id = req.query.id || req.query._id
  params.authorizedPersonId = req?.query?.authorizedPersonId  // || req.user._id.toString();
  console.log("enter");
  const result = await getauthorizedPersonProfileService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const updateauthorizedPersonProfile = async (req, res) => {
  const params = req.body;
  params.id = req?.query?.id;
  params.authorizedPersonId =
    req?.query?.authorizedPersonId || req.user._id.toString();
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  const result = await updateauthorizedPersonProfileService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const authorizedPersonList = async (req, res) => {
  const params = req?.query;
  const result = await authorizedPersonListService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const deleteauthorizedPerson = async (req, res) => {
  const params = req.body;
  params.authorizedPersonId =
    req?.query?.authorizedPersonId || req.user._id.toString();
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  const result = await deleteauthorizedPersonService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const authorizedPersonResetPassword = async (req, res) => {
  const params = req.body;
  params.authorizedPersonId =
    req?.query?.authorizedPersonId || req.user._id.toString();
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  const result = await authorizedPersonResetPasswordService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};


module.exports = {
  authorizedPersonLogin,
  authorizedPersonverifyOTP,
  addauthorizedPerson,
  authorizedPersonLoginById,
  getauthorizedPersonProfile,
  updateauthorizedPersonProfile,
  authorizedPersonList,
  authorizedPersonMailLoginById,
  authorizedPersonSendLoginId,
  deleteauthorizedPerson,
  authorizedPersonResetPassword
};
