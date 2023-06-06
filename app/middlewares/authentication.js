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
        req.user.userType = "AP";
      } catch (e) {
        //token authorization by admin
        decode = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
        user = await Admin.findOne({
          _id: decode._id,
          //token: token,
        }).lean();
        req.user = user;
        req.user.userType = "ADMIN";
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


const verifyToken = (type = ["ADMIN"]) =>
  async function (req, res, next) {
    try {
      if (
        req.headers["x-access-token"] ||
        req.headers["authorization"] ||
        req.headers["Authorization"]
      ) {
        let token =
          req.headers["x-access-token"] ||
          req.headers["authorization"] ||
          req.headers["Authorization"];
        token = token.replace("Bearer ", "");
        let decode, user;
        var userData = null;
        let userType = null;
        try {
          decode = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
          userData = await Admin.findOne({
            _id: decode._id,
            //token: token,
          });
          userType = "ADMIN";
        } catch (error) {
          if (type.includes("AP")) {
            decode = jwt.verify(token, process.env.JWT_authorizedPerson_SECRET);
            userData = await authorizedPersons.findOne({
              _id: decode._id,
              // token: token,
            });
            userType = "AP";
          }
        }
        if (userData) {
          if (!userData?.isActive) {
            return sendErrorResponse(
              req,
              res,
              statusCodes.HTTP_NOT_FOUND,
              messages.adminInActive,
              []
            );
          } else {
            req.user = userData;
            req.user.userType = userType;
            next();
          }
        } else {
          return sendErrorResponse(
            req,
            res,
            statusCodes.HTTP_NOT_FOUND,
            messages.tokenInvalid,
            []
          );
        }
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
      console.log(error);
      return sendErrorResponse(
        req,
        res,
        statusCodes.HTTP_NOT_FOUND,
        messages.tokenInvalid,
        []
      );
    }
  };
const verifyAdminRole = (roles, action) =>
  async function (req, res, next) {
    let isPermissionDenied = true;
    if (req.user && req.user.permissions) {
      if (req.user.permissions[roles]) {
        if (
          req.user.permissions[roles].indexOf(action.toString()) ||
          req.user.permissions[roles].indexOf("ALL")
        ) {
          isPermissionDenied = false;
        }
      }
    }
    if (req.user.userType == "AP") {
      isPermissionDenied = false;
    }
    if (isPermissionDenied) {
      return sendErrorResponse(
        req,
        res,
        statusCodes.HTTP_NOT_FOUND,
        messages.accessDenied,
        []
      );
    } else {
      next();
    }
  };
  
module.exports = { verifyAdminToken, verifyauthorizedPersonToken,verifyAdminRole,verifyToken };
