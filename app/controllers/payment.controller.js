const mongoose = require("mongoose");
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../response/response");

const {
  orderCreateService,
  paymentverifyService,
  checkPaymentStatusService,
} = require("../services/payment.service");

//authorizedPerson profile related api's


const orderCreate = async (req, res) => {
  const params = req.body;
  const result = await orderCreateService(req, params);
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

const paymentverify = async (req, res) => {
  let params = {};
  const result = await paymentverifyService(params);
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


const checkPaymentStatus = async (req, res) => {
  const params = req.query;
  const result = await checkPaymentStatusService(req, params);
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
    orderCreate,
    paymentverify,
    checkPaymentStatus
};
