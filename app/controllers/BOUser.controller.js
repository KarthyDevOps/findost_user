const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../response/response");

const {
  createBOUsersService,
  BOUserListService,
  updateBOUserService,
  deleteBOUserService,
  getBOUsersService
} = require("../services/BOUsers.service");


const createBOusers = async (req, res) => {
  const params = req.body;
  params.createdBy = req?.user?._id?.toString();
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  params.userType = req?.user?.userType;
  const result = await createBOUsersService(params);
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

const getBOusers = async (req, res) => {
  const params = req.body;
  params.id = req?.query?.id;
  params.apId = req?.query?.apId;
  if(req.query.token) params.token = req?.query?.token
  const result = await getBOUsersService(params);
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

const updateBOusers = async (req, res) => {
  const params = req.body;
  params.id = req?.query?.id;
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  params.userType = req?.user?.userType;
  const result = await updateBOUserService(params);
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

const BOusersList = async (req, res) => {
  const params = req?.query;
  if (!params?.limit) params.limit = 10;
  if (!params?.page) params.page = 1;
  params.limit = parseInt(params?.limit);
  params.page = parseInt(params?.page);
  console.log("req", params);
  const result = await BOUserListService(params);
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

const deleteBOusers = async (req, res) => {
  const params = req.body;
  if (req.query.id) {
    params.id = req?.query?.id;
  }
  params.ids = req.body.ids;
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  params.userType = req?.user?.userType;
  const result = await deleteBOUserService(params);
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
  createBOusers,
  getBOusers,
  updateBOusers,
  BOusersList,
  deleteBOusers,
};
