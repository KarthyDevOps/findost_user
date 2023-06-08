const { Admin } = require("../models/admin");
const { authorizedPersons } = require("../models/authorizedPersons");
const { clientFamily } = require("../models/clientFamily");

const json2csv = require("json2csv").parse;

const pageMetaService = async (params, count) => {
  try {
    return {
      pageCount: Math.ceil(count / params?.limit),
      nextPage:
        params?.page >= Math.ceil(count / params?.limit)
          ? null
          : Number(params?.page) + 1,
      pageSize: params?.limit,
      total: count,
      currentPage: Number(params?.page),
    };
  } catch (error) {
    throw Error(error);
  }
};

const sendOTP_to_mobileNumber = async (
  mobileNumber,
  type = "authorizedPerson"
) => {
  if (mobileNumber) {
    return 1234;
  }
  throw new Error("");
};

const sendOTP_to_email = async (params) => {
  if (params.email) {
    return { status: true, otp: "1234" };
  }
  throw new Error("");
};

const errHandle = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const convert_JSON_to_file = async (res, data, params) => {
  let type = params?.type;
  //json data into csv file
  const csvString = json2csv(data?.data);
  if (type == "authorizedPerson") {
    res.setHeader(
      "Content-disposition",
      "attachment; filename=authorizedPerson Export.csv"
    );
  }
  // else if (type == "") { //need to change type
  //   res.setHeader(
  //     "Content-disposition",
  //     "attachment; filename=Trucker Export.csv"
  //   );
  // }
  res.set("Content-Type", "text/csv");
  res.status(200).send(csvString);
  return;
};

//client family related functions

const getClientFamilyByEmail_or_MobileNumber = async (params) => {
  //get client family details by email or mobileNumber
  const data = await clientFamily.findOne({
    $or: [
      { email: params?.email },
      { mobileNumber: params?.mobileNumber },
      { clientId: params?.clientId },
    ],
  });

  //return object based on client family already exist or not
  if (data && Object.keys(data).length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: {} };
  }
};

const getClientFamilyDetailsById = async (params) => {
  console.log("params", params?.id);
  //get authorizedPerson details by id
  const data = await clientFamily.findOne({
    $or: [{ _id: params?.id }, { clientId: params?.clientId }],
    isDeleted: false,
  });
  console.log("data", data);
  //return object based on authorizedPerson already exist or not
  if (data && Object.keys(data).length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: {} };
  }
};

const getClientPersonList = async (param) => {
  let filter = {
    isDeleted: false,
  };

  if (param.search) {
    filter.$or = [
      { clientName: { $regex: `${param.search}`, $options: "i" } },
      { clientId: { $regex: `${param.search}`, $options: "i" } },
      { email: { $regex: `${param.search}`, $options: "i" } },
    ];
  }

  if (param.isActive) {
    filter.$or = [{ isActive: param.isActive }];
  }

  const data = await clientFamily
    .find(filter)
    .skip(Number(param?.page - 1) * Number(param?.limit))
    .limit(Number(param?.limit))
    .sort({ createdAt: -1 });

  if (data.length > 0) {
    return {
      status: true,
      data: data.length,
    };
  }
  return {
    status: false,
    data: [],
  };
};

module.exports = {
  pageMetaService,
  sendOTP_to_mobileNumber,
  sendOTP_to_email,
  errHandle,
  convert_JSON_to_file,
  getClientPersonList,
  getClientFamilyByEmail_or_MobileNumber,
  getClientFamilyDetailsById,
};
