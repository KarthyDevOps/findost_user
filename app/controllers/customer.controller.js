const { default: mongoose } = require("mongoose");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../response/response");

const {
  addCustomerService,
  customerLoginService,
  customerLogoutService,
  updateCustomerProfileService,
  customerVerifyOTPService,
  getCustomerProfileService,
  customerListService,
  deleteCustomerService,
  addCustomerAddressService,
  updateCustomerAddressService,
  customerAddressListService,
  getCustomerAddressService,
  deleteCustomerAddressService,
  setDefaultCustomerAddressService,
  exportCustomerService,
  premiumCustomerListService,
  feedbackListService,
  addContactUsService,
  updateContactUsService,
  ContactUsListService,
  getContactUsService,
  customerLoginByIdService,
  deleteContactUsService,
  addCustomerFeedbackService,
  updateCustomerFeedbackService,
  getCustomerFeedbackService,
  deleteCustomerFeedbackService,
} = require("../services/customer.service");

//customer profile related api's

const customerLogin = async (req, res) => {
  const params = req.body;
  const result = await customerLoginService(params);
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

const customerLoginById = async (req, res) => {
  const params = req.body;
  const result = await customerLoginByIdService(params);
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

const customerverifyOTP = async (req, res) => {
  const params = req.body;
  const result = await customerVerifyOTPService(params);
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

const addCustomer = async (req, res) => {
  const params = req.body;
  params.createdBy =
    req?.user?._id?.toString() ||
    mongoose.Types.ObjectId("645c7e913469f5d7ca43926f");
  params.updatedBy =
    req?.user?._id?.toString() ||
    mongoose.Types.ObjectId("645c7e913469f5d7ca43926f");
  params.lastUpdatedBy = req?.user?.userType;
  const result = await addCustomerService(req, params);
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

const getCustomerProfile = async (req, res) => {
  console.log("data");
  let params = {};
  params.customerId = req?.query?.customerId || req.user._id.toString();
  console.log("enter");
  const result = await getCustomerProfileService(params);
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

const updateCustomerProfile = async (req, res) => {
  const params = req.body;
  params.customerId = req?.query?.customerId || req.user._id.toString();
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  const result = await updateCustomerProfileService(params);
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

const customerList = async (req, res) => {
  const params = req?.query;
  const result = await customerListService(params);
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

const deleteCustomer = async (req, res) => {
  const params = req.body;
  params.customerId = req?.query?.customerId || req.user._id.toString();
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  const result = await deleteCustomerService(params);
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
  customerLogin,
  customerverifyOTP,
  addCustomer,
  customerLoginById,
  getCustomerProfile,
  updateCustomerProfile,
  customerList,

  deleteCustomer,
};
