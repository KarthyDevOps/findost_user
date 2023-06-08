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

//authorizedPerson related functions
const getauthorizedPersonDetailsByEmail_or_MobileNumber = async (params) => {
  //get authorizedPerson details by email or mobileNumber
  const data = await authorizedPersons.findOne({
    $or: [
      { email: params?.email },
      { mobileNumber: params?.mobileNumber },
      { authorizedPersonId: params?.authorizedPersonId },
      // { _id: mongoose.Types.ObjectId(params?.authorizedPersonId) },
    ],
  });

  //return object based on authorizedPerson already exist or not
  if (data && Object.keys(data).length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: {} };
  }
};

const authorizedPersonbyId = async (params) => {
  //get authorizedPerson details by email or mobileNumber
  const data = await authorizedPersons.findOne({
    authorizedPersonId: params?.authorizedPersonId,
  });

  //return object based on authorizedPerson already exist or not
  if (data && Object.keys(data).length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: {} };
  }
};

const getauthorizedPersonDetailsById = async (params) => {
  console.log("params");
  //get authorizedPerson details by id
  const data = await authorizedPersons.findOne({
    $or: [
      { _id: params?._id },
      { _id: params?.authorizedPersonId },
      { _id: params?.id },
    ],
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

const getauthorizedPersonList = async () => {
  const data = await authorizedPersons.find({
    isDeleted: false,
  });
  if (data.length > 0) {
    return {
      status: true,
      data: data,
    };
  }
  return {
    status: false,
    data: {},
  };
};

// admin related functions

const getAdminDetailsByEmail_or_MobileNumber = async (params) => {
  //get admin details by email or mobileNumber
  const data = await Admin.findOne({
    email: params?.email,
  });

  //return object based on admin already exist or not
  if (data && Object.keys(data).length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: {} };
  }
};

const getAdminDetailsById = async (params) => {
  //get admin details by id
  const data = await Admin.findOne({
    $or: [{ _id: params?._id }, { _id: params?.adminId }],
  });

  //return object based on admin already exist or not
  if (data && Object.keys(data).length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: {} };
  }
};

const getAdminProfile = async (params) => {
  //get admin details
  const data = await Admin.find({
    $or: [{ adminId: params?.adminId }, { _id: params.id }],
  }).lean();

  //return object based on admin already exist or not
  if (data && Object.keys(data).length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: {} };
  }
};

const getProfileById = async (params) => {
  //get admin details
  const data = await Admin.findOne({
    $or: [{ _id: params?.id }, { adminId: params?.adminId }],
    isDeleted: false,
  }).lean();

  //return object based on admin already exist or not
  if (data && Object.keys(data).length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: {} };
  }
};

const getAdminList = async (params) => {
  let data,
    payload = { isDeleted: false };

  if (params?.search) {
    payload.$or = [
      { adminId: { $regex: `${params?.search}`, $options: "i" } },
      { name: { $regex: `${params?.search}`, $options: "i" } },
      { mobileNumber: { $regex: `${params?.search}`, $options: "i" } },
      { email: { $regex: `${params?.search}`, $options: "i" } },
    ];
  }
  //get admin list

  if (params?.all) {
    data = await Admin.find(payload).sort({ createdAt: -1 }).lean();
  } else {
    data = await Admin.find(payload)
      .skip(Number(params?.page - 1) * Number(params?.limit))
      .limit(Number(params?.limit))
      .sort({ createdAt: -1 })
      .lean();
  }

  //return object based on person already exist or not
  if (data && data.length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: {} };
  }
};

const updateAdminProfileByEmail = async (params) => {
  const email = params?.email;
  delete params["email"];
  const query = {
    $set: params,
  };
  //get admin details by email or mobileNumber
  const data = await Admin.updateOne(
    {
      email: email,
    },
    query
  );

  return data;
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
  let totalCount = await clientFamily.find(filter).countDocuments();
  if (data.length > 0) {
    return {
      status: true,
      data: data,
      total: totalCount,
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
  getauthorizedPersonDetailsByEmail_or_MobileNumber,
  getauthorizedPersonDetailsById,
  authorizedPersonbyId,
  getauthorizedPersonList,
  convert_JSON_to_file,
  getClientPersonList,
  getClientFamilyByEmail_or_MobileNumber,
  getClientFamilyDetailsById,
};
