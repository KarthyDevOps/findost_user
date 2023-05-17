const jwt = require("jsonwebtoken");
const { Admin } = require("../models/admin");
const { sendErrorResponse } = require("../response/response");
const { statusCodes } = require("../response/httpStatusCodes");
const { messages } = require("../response/customMessages");
const { authorizedPersons } = require("../models/authorizedPersons");

const verifyauthorizedPersonToken = async (req, res, next) => {
  try {
    if (req.header("Authorization")) {
      const token = req.header("Authorization").replace("Bearer ", "");
      let decode, user;

      //custtomer profile can access by both authorizedPerson and admin. So we should allow both users
      try {
        //token authorization by authorizedPerson
        decode = jwt.verify(token, process.env.JWT_authorizedPerson_SECRET);
        user = await authorizedPersons
          .findOne({
            _id: decode._id,
            //token: token,
          })
          .lean();
        req.user = user;
        req.user.userType = "authorizedPerson";
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
    if (req.header("Authorization")) {
      console.log("timimh");
      // const token = req.header("Authorization") || req.header("token");
      // console.log('decode._id', first)

      console.log("data -->");
      const token = req.header("Authorization").replace("Bearer ", "");
      let decode, user;
      try {
        decode = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        console.log("decode._id", decode);
        user = await Admin.findOne({
          _id: decode._id,
          //token: token,
        });
        console.log("user", user);
        req.user = user;
        //  req.user.userType = "admin";
      } catch {
        decode = jwt.verify(token, process.env.JWT_authorizedPerson_SECRET);
        user = await authorizedPersons.findOne({
          _id: decode._id,
          // token: token,
        });
        req.user = user;
        //  req.user.userType = "authorizedPerson";
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

module.exports = { verifyAdminToken, verifyauthorizedPersonToken };
