const {
  convert_JSON_to_file,
  getauthorizedPersonDetailsByEmail_or_MobileNumber,
  getauthorizedPersonDetailsById,
  getauthorizedPersonList,
  pageMetaService,
  sendOTP_to_mobileNumber,
  getClientFamilyByEmail_or_MobileNumber,
  getClientFamilyDetailsById,
  getClientPersonList,
  authorizedPersonbyId,
} = require("../helpers");
const { clientFamily } = require("../models/clientFamily");
const { messages } = require("../response/customMessages");
const { statusCodes } = require("../response/httpStatusCodes");
const bcrypt = require("bcryptjs");
const { statusMessage } = require("../response/httpStatusMessages");
//const { authorizedPersonsAddress } = require("../models/authorizedPerson-address");
const moment = require("moment-timezone");
//authorizedPerson profile related api's

const addClientFamilyService = async (req, params) => {
  console.log("params-->", params);
  //verify the given person already exist or not
  const result = await getClientFamilyByEmail_or_MobileNumber(params);
  if (result.status) {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_BAD_REQUEST,
      message: messages?.clientFamilyExists,
      data: [],
    };
  }

  const clientFamilys = await new clientFamily(params);
  const details = await clientFamilys.save();
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.clientFamilyAdded,
    data: { _id: details._id },
  };
};

const getClientProfileService = async (params) => {
  console.log("params1");
  //get authorizedPerson details by authorizedPerson id
  const result = await getClientFamilyDetailsById(params);
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

const updateClientProfileService = async (params) => {
  const id = params?.id;

  var query = { $set: params };
  console.log("id", id);
  //update client profile details into client profile table
  const result = await clientFamily.updateOne({ _id: id }, query);
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

const deleteClientFamilyService = async (params) => {
  const id = params?.id;
  //  delete params["authorizedPersonId"];
  var query = {
    $set: {
      isDeleted: true,
      updatedBy: params?.updatedBy,
      lastUpdatedBy: params?.lastUpdatedBy,
    },
  };

  //update authorizedPerson details into authorizedPersons table
  const result = await clientFamily.updateOne({ _id: id }, query);
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

const clientFamilyListService = async (params) => {
  //get all authorizedPerson list
  const allList = await getClientPersonList(params);
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
  addClientFamilyService,
  getClientProfileService,
  updateClientProfileService,
  deleteClientFamilyService,
  clientFamilyListService,
};
