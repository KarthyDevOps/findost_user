const {
  convert_JSON_to_file,
  pageMetaService,
} = require("../helpers");
const { clientFamily } = require("../models/clientFamily");
const { messages } = require("../response/customMessages");
const { statusCodes } = require("../response/httpStatusCodes");
const { statusMessage } = require("../response/httpStatusMessages");

const addClientFamilyService = async (req, params) => {
  console.log("params-->", params);
  //verify the given person already exist or not
  const data = await clientFamily.findOne({
    $or: [
      { email: params?.email },
      { mobileNumber: params?.mobileNumber }
    ],
  });
console.log("data -->",data)
  if (data) {
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

  let ids = [];
  if (params.id) ids.push(params?.id); else if (params.ids) {
    ids = params.ids
  }
  var query = {
    $set: {
      isDeleted: true,
      updatedBy: params?.updatedBy,
      lastUpdatedBy: params?.lastUpdatedBy,
    },
  };
  console.log("ids-->",ids)
  const result = await clientFamily.updateMany({ _id: ids }, query);
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
  try {

    let cond = {};
    cond.isDeleted = false
    let page = params?.page || 1;
    page = Number(page);
    let limit = params?.limit || 10;
    limit = Number(limit);

    if (params.search) {
      cond.$or = [
        { clientId: { $regex: `${params?.search}`, $options: "i" } },
        { clientName: { $regex: `${params?.search}`, $options: "i" } },
        { email: { $regex: `${params?.search}`, $options: "i" } },
      ];
    }
    if (params.isActive) {
      cond.isActive = params?.isActive
    }
    let totalCount = await clientFamily.find(cond).countDocuments();
    let data = await clientFamily.find(cond).sort({ createdAt: -1 }).skip(limit * (page - 1)).limit(limit);
    const pageMeta = await pageMetaService(params, totalCount);
    if (data.length > 0) {
      return {
        status: true,
        statusCode: statusCodes?.HTTP_OK,
        data: { list: data, pageMeta },
      };

    }
    else {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_OK,
        data:  { list: data, pageMeta },
      };

    }
  }
  catch (error) {
    console.log("error", error);
    throw new Error(error);
  }
}

module.exports = {
  addClientFamilyService,
  getClientProfileService,
  updateClientProfileService,
  deleteClientFamilyService,
  clientFamilyListService,
};
