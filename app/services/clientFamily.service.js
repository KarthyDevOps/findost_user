const { default: mongoose } = require("mongoose");
const {
  convert_JSON_to_file,
  pageMetaService,
} = require("../helpers");
const { clientFamily } = require("../models/clientFamily");
const { messages } = require("../response/customMessages");
const { statusCodes } = require("../response/httpStatusCodes");
const { statusMessage } = require("../response/httpStatusMessages");

const {clientFamilyList} = require('./list.services')

const addClientFamilyService = async (req, params) => {
  console.log("params-->", params);
  //verify the given person already exist or not

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
  const data = await clientFamily.findOne({
    _id:params.id
  });
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.success,
    data: { data : data },
  };
};

const getAdminClientProfileService = async (params) => {
  console.log("params1");
  //get authorizedPerson details by authorizedPerson id
  let data = await clientFamily.findOne({
    familyMember: {
      $elemMatch:{
        _id:params?.id
      }   
    }
  }).lean();

  if (data) {
    let obj = {}
    for (let item of data?.familyMember) {
      if (item._id == params.id) {
        console.log('item-->', item)
        obj = item
      }
    }
  
    data.familyMember = {...obj}
    
  }
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.success,
    data: { data : data },
  };
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

const updateAdminClientProfileService = async (params) => {
  const id = params?.id;

  console.log("id", id);
  console.log('params->', params)
  //update client profile details into client profile table
  const result = await clientFamily.updateOne({
    familyMember: {
      $elemMatch: {
        _id: new mongoose.Types.ObjectId(id)
      }
    }
  }, {
    '$set': {
      'familyMember.$.relativeName': params?.familyMember?.relativeName,
      'familyMember.$.dateOfBirth': params?.familyMember?.dateOfBirth,
      'familyMember.$.relationShip': params?.familyMember?.relationShip,
      'familyMember.$.mobileNumber': params?.familyMember?.mobileNumber,
      'familyMember.$.email': params?.familyMember?.email
    }
  });
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
  params.all = true;
  const allList = await clientFamilyList(params);
  //console.log('allList-->', allList)
  params.all = params.returnAll ==true ? true : false;
  //console.log('params-->', params)
  const result = await clientFamilyList(params);
 // console.log('result-->', allList?.data)
  const pageMeta = await pageMetaService(params, allList?.data?.length || 0);
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    data: { list: result?.data, pageMeta },
  };
};
module.exports = {
  addClientFamilyService,
  getClientProfileService,
  updateClientProfileService,
  deleteClientFamilyService,
  clientFamilyListService,
  getAdminClientProfileService,
  updateAdminClientProfileService
};
