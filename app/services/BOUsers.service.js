const { statusCodes } = require("../response/httpStatusCodes");
const { statusMessage } = require("../response/httpStatusMessages");
const { messages } = require("../response/customMessages");
const { BOUSERS } = require("../models/BOUsers");

const { pageMetaService } = require("../helpers/index");

const { getBOUsersList } = require("./list.services");

const createBOUsersService = async (params) => {

  if (!params.settings) {
    params.settings = {
      isDarkTheme: false,
      isEnableBioMetricLogin: false,
      isMyNotificationSettings: false,
      isInsurenceNotification: false,
      isMutualFundsNotification: false,
      isEquityNotification: false,
      isSIPNotification: false,
      isIPONotification: false,
      isLoanNotification: false,
    };
  }
  
  var newvalues = params;
  const resp = await BOUSERS.create(newvalues);
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.created,
    data: {
      _id: resp?._id,
    },
  };
};


const getBOUsersService = async (params) => {
  if (params.token) {
    var payload = {
      token: params?.token,
      isDeleted: false,
    };
  } else {
    var payload = {
      _id: params?.id,
      isDeleted: false,
    };
  }
  console.log('payload-->', payload)
  const resp = await BOUSERS.findOne(payload);
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.success,
    data: resp,
  };
};


const updateBOUserService = async (params) => {
  var payload = {
    _id: params?.id,
    isDeleted: false,
  };
  delete params["faqId"];
  var newvalues = {
    $set: params,
  };
  const resp = await BOUSERS.updateOne(payload, newvalues);
  if (!resp.modifiedCount) {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_UNPROCESSABLE_ENTITY,
      message: messages?.somethingWrong,
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


const BOUserListService = async (params) => {
  params.all = true;
  const allList = await getBOUsersList(params);
  params.all = params.returnAll == true ? true : false;

  const result = await getBOUsersList(params);
  const pageMeta = await pageMetaService(params, allList?.data?.length || 0);
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    data: { list: result?.data, pageMeta },
  };
};

const deleteBOUserService = async (params) => {
  let ids = [];
  if (params.id) ids.push(params?.id);
  else if (params.ids) {
    ids = params.ids;
  }
  var newvalues = {
    $set: {
      isDeleted: true,
      updatedBy: params?.updatedBy,
      lastUpdatedBy: params?.lastUpdatedBy,
    },
  };

  const resp = await BOUSERS.updateMany({ _id: ids }, newvalues);
  if (!resp.modifiedCount) {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_UNPROCESSABLE_ENTITY,
      message: messages?.somethingWrong,
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

module.exports = {
  createBOUsersService,
  getBOUsersList,
  updateBOUserService,
  BOUserListService,
  getBOUsersService,
  deleteBOUserService,
};
