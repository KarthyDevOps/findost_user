const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../response/response");

const {
  loginCountService,
  loginActivityReportService,
} = require("../services/session.service");

const loginCount = async (req, res) => {
  const params = req.query;
  const result = await loginCountService(params);
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

const loginActivityReport = async (req, res) => {
  const params = req.query;
  const result = await loginActivityReportService(params);
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
  loginCount,
  loginActivityReport,
};
