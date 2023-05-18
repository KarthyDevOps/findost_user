const mongoose = require("mongoose");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../response/response");

const {
  addClientFamilyService,
  getClientProfileService,
  clientFamilyListService,
  updateClientProfileService,
  deleteClientFamilyService,
} = require("../services/clientFamily.service");

//authorizedPerson profile related api's


const addClientFamilyPerson = async (req, res) => {
  const params = req.body;
  params.createdBy = req?.user?._id?.toString();
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  const result = await addClientFamilyService(req, params);
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

const getClientPersonProfile = async (req, res) => {
  console.log("data");
  let params = {};
  params.clientId =
    req?.query?.clientId || req.user._id.toString();
  console.log("enter");
  const result = await getClientProfileService(params);
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

const updateClientFamilyProfile = async (req, res) => {
  const params = req.body;
  params.id =
    req?.query?.id || req.user._id.toString();
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  const result = await updateClientProfileService(params);
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

const clientFamilyList = async (req, res) => {
  const params = req?.query;
  const result = await clientFamilyListService(params);
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

const deleteClientFamily = async (req, res) => {
  const params = req.body;
  params.id = req?.query?.id || req.user._id.toString();
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  const result = await deleteClientFamilyService(params);
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
  addClientFamilyPerson,
  getClientPersonProfile,
  updateClientFamilyProfile,
  clientFamilyList,
  deleteClientFamily,
};
