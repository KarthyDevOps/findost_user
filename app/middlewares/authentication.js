const jwt = require("jsonwebtoken");
const { Admin } = require("../models/admin");
const { sendErrorResponse } = require("../response/response");
const { statusCodes } = require("../response/httpStatusCodes");
const { messages } = require("../response/customMessages");
const { Customers } = require("../models/customers");



const verifyCustomerToken = async (req, res, next) => {
  try {
    if (req.header("Authorization")) {
      const token = req.header("Authorization").replace("Bearer ", "");
      let decode, user;

      //custtomer profile can access by both customer and admin. So we should allow both users
      try {
        //token authorization by customer
        decode = jwt.verify(token, process.env.JWT_CUSTOMER_SECRET);
        user = await Customers.findOne({
          _id: decode._id,
          //token: token,
        }).lean();
        req.user = user;
        req.user.userType = "customer";
      } catch (e) {
        //token authorization by admin
        decode = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        user = await Admin.findOne({
          _id: decode._id,
          //token: token,
        }).lean();
        req.user = user;
        req.user.userType = "admin";
      }

      if (!user) {
        return sendErrorResponse(
          req,
          res,
          statusCodes.HTTP_NOT_FOUND,
          messages.tokenInvalid,
          []
        );
      }
      next();
    } else {
      return sendErrorResponse(
        req,
        res,
        statusCodes.HTTP_UNAUTHORIZED,
        messages.tokenEmpty,
        []
      );
    }
  } catch (error) {
    return sendErrorResponse(
      req,
      res,
      statusCodes.HTTP_UNAUTHORIZED,
      messages.tokenExpired,
      []
    );
  }
};

const verifyAdminToken = async (req, res, next) => {
  try {
    const a = req.header("Authorization") || req.header("token");
    if (req.header("Authorization")) {
      const token = req.header("Authorization").replace("Bearer ", "");
      let decode, user;
      try {
        decode = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        user = await Admin.findOne({
          _id: decode._id,
          //token: token,
        });
        req.user = user;
      //  req.user.userType = "admin";
      } catch {
          decode = jwt.verify(token, process.env.JWT_CUSTOMER_SECRET);
          user = await Customers.findOne({
            _id: decode._id,
           // token: token,
          });
          req.user = user;
        //  req.user.userType = "customer";
         
      }

      if (!user) {
        return sendErrorResponse(
          req,
          res,
          statusCodes.HTTP_NOT_FOUND,
          messages.tokenInvalid,
          []
        );
      }
      next();
    } else {
      return sendErrorResponse(
        req,
        res,
        statusCodes.HTTP_UNAUTHORIZED,
        messages.tokenEmpty,
        []
      );
    }
  } catch (error) {
    return sendErrorResponse(
      req,
      res,
      statusCodes.HTTP_NOT_FOUND,
      messages.tokenInvalid,
      []
    );
  }
};


module.exports = { verifyAdminToken, verifyCustomerToken };
