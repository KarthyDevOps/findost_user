const { Admin } = require("../models/admin");
const { Customers } = require("../models/customers");

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

const sendOTP_to_mobileNumber = async (mobileNumber, type = "customer") => {
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

//customer related functions

const getCustomerDetailsByEmail_or_MobileNumber = async (params) => {
  //get customer details by email or mobileNumber
  const data = await Customers.findOne({
    $or: [{ email: params?.email }, { mobileNumber: params?.mobileNumber }],
  });

  //return object based on customer already exist or not
  if (data && Object.keys(data).length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: {} };
  }
};

const customerbyId = async (params) => {
  //get customer details by email or mobileNumber
  const data = await Customers.findOne({ customerId: params?.customerId });

  //return object based on customer already exist or not
  if (data && Object.keys(data).length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: {} };
  }
};

const getCustomerDetailsById = async (params) => {
  console.log("params");
  //get customer details by id
  const data = await Customers.findOne({
    $or: [{ _id: params?._id }, { _id: params?.customerId }],
  });
  console.log("data", data);
  //return object based on customer already exist or not
  if (data && Object.keys(data).length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: {} };
  }
};

const getCustomerList = async (params) => {
  let data;

  //get customer list
  if (params.all) {
    if (params?.search) {
      data = await Customers.aggregate([
        {
          $match: {
            isDeleted: false,
            $or: [
              { name: { $regex: `${params?.search}`, $options: "i" } },
              { mobileNumber: { $regex: `${params?.search}`, $options: "i" } },
              { email: { $regex: `${params?.search}`, $options: "i" } },
            ],
          },
        },
        {
          $lookup: {
            from: "customersaddresses",
            as: "customerAddress",
            let: { id: "$_id" },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ["$$id", "$customerId"] },
                  isDefault: true,
                },
              },
            ],
          },
        },
        { $sort: { createdAt: -1 } },
      ]);
    } else {
      data = await Customers.find({
        isDeleted: false,
      });
    }
  } else if (params?.search) {
    //get data by join with customers and customersaddress using lookup
    data = await Customers.aggregate([
      {
        $match: {
          isDeleted: false,
          $or: [
            { name: { $regex: `${params?.search}`, $options: "i" } },
            { mobileNumber: { $regex: `${params?.search}`, $options: "i" } },
            { email: { $regex: `${params?.search}`, $options: "i" } },
          ],
        },
      },
      {
        $lookup: {
          from: "customersaddresses",
          as: "customerAddress",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$customerId"] },
                isDefault: true,
              },
            },
          ],
        },
      },
      { $skip: Number((params?.page - 1) * params?.limit) },
      { $limit: Number(params?.limit) },
      { $sort: { createdAt: -1 } },
    ]);
  } else {
    data = await Customers.aggregate([
      {
        $match: {
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "customersaddresses",
          as: "customerAddress",
          let: { id: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$customerId"] },
                isDefault: true,
              },
            },
          ],
        },
      },
      { $skip: Number((params?.page - 1) * params?.limit) },
      { $limit: Number(params?.limit) },
      { $sort: { createdAt: -1 } },
    ]);
  }

  //return object based on customer already exist or not
  if (data && data.length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: {} };
  }
};

// admin related functions

const getAdminDetailsByEmail_or_MobileNumber = async (params) => {
  //get admin details by email or mobileNumber
  const data = await Admin.findOne({
    $or: [{ email: params?.email }, { mobileNumber: params?.mobileNumber }],
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
  const data = await Admin.find({ _id: params?.adminId }).lean();

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
      { empId: { $regex: `${params?.search}`, $options: "i" } },
      { name: { $regex: `${params?.search}`, $options: "i" } },
      { mobileNumber: { $regex: `${params?.search}`, $options: "i" } },
      { email: { $regex: `${params?.search}`, $options: "i" } },
    ];
  }
  //get admin list

  if (params?.all) {
    data = await Admin.find(payload)
      .populate("departmentId")
      .sort({ createdAt: -1 })
      .lean();
  } else {
    data = await Admin.find(payload)
      .populate("departmentId")
      .skip(Number(params?.page - 1) * Number(params?.limit))
      .limit(Number(params?.limit))
      .sort({ createdAt: -1 })
      .lean();
  }
  // if (params.all) {
  //   if (params?.search) {
  //     data = await Admin.aggregate([
  //       {
  //         $match: {
  //           isDeleted: false,
  //           $or: [
  //             { empId: { $regex: `${params?.search}`, $options: "i" } },
  //             { name: { $regex: `${params?.search}`, $options: "i" } },
  //             { mobileNumber: { $regex: `${params?.search}`, $options: "i" } },
  //             { email: { $regex: `${params?.search}`, $options: "i" } },
  //           ],
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: "departments",
  //           localField: "departmentId",
  //           foreignField: "_id",
  //           as: "adminList",
  //         },
  //       },
  //       { $sort: { createdAt: -1 } },
  //     ]);
  //   } else {
  //     data = await Admin.find({
  //       isDeleted: false,
  //     });
  //   }
  // } else if (params?.search) {
  //   //get data by join with admin and admin using lookup
  //   data = await Admin.aggregate([
  //     {
  //       $match: {
  //         isDeleted: false,
  //         $or: [
  //           { empId: { $regex: `${params?.search}`, $options: "i" } },
  //           { name: { $regex: `${params?.search}`, $options: "i" } },
  //           { mobileNumber: { $regex: `${params?.search}`, $options: "i" } },
  //           { email: { $regex: `${params?.search}`, $options: "i" } },
  //         ],
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "departments",
  //         localField: "departmentId",
  //         foreignField: "_id",
  //         as: "adminList",
  //       },
  //     },
  //     { $skip: Number((params?.page - 1) * params?.limit) },
  //     { $limit: Number(params?.limit) },
  //     { $sort: { createdAt: -1 } },
  //   ]);
  // } else {
  //   data = await Admin.aggregate([
  //     {
  //       $match: {
  //         isDeleted: false,
  //       },
  //     },
  //     {
  //       $lookup: {
  //         from: "departments",
  //         localField: "departmentId",
  //         foreignField: "_id",
  //         as: "adminList",
  //       },
  //     },
  //     { $skip: Number((params?.page - 1) * params?.limit) },
  //     { $limit: Number(params?.limit) },
  //     { $sort: { createdAt: -1 } },
  //   ]);
  // }

  //return object based on trucker already exist or not
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
  if (type == "customer") {
    res.setHeader(
      "Content-disposition",
      "attachment; filename=Customer Export.csv"
    );
  } else if (type == "trucker") {
    res.setHeader(
      "Content-disposition",
      "attachment; filename=Trucker Export.csv"
    );
  }
  res.set("Content-Type", "text/csv");
  res.status(200).send(csvString);
  return;
};

module.exports = {
  pageMetaService,
  sendOTP_to_mobileNumber,
  sendOTP_to_email,
  errHandle,
  getCustomerDetailsByEmail_or_MobileNumber,
  getCustomerDetailsById,
  getAdminDetailsByEmail_or_MobileNumber,
  getAdminDetailsById,
  getAdminProfile,
  getAdminList,
  updateAdminProfileByEmail,
  customerbyId,
  getCustomerList,
  convert_JSON_to_file,
};
