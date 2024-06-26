const { clientFamily } = require("../models/clientFamily");

const { BOUSERS } = require("../models/BOUsers");

const clientFamilyList = async (params) => {
  let data;
  if (params.all) {
    let filter = {
      isDeleted: false,
    };
    if (params?.isActive) {
      filter.isActive = params.isActive;
    }
    if (params?.type) {
      filter.type = params.type;
    }
    if (params?.search) {
      filter.$or = [
        { clientId: params?.search },
        { clientName: { $regex: `${params?.search}`, $options: "i" } },
        {
          "familyMember.email": { $regex: `${params?.search}`, $options: "i" },
        },
      ];
    }
    console.log("filter--->", filter);
    data = await clientFamily.find(filter);
  } else {
    console.log("data--?");
    let filter = {
      isDeleted: false,
    };
    if (params?.type) {
      filter.type = params.type;
    }
    if (params?.isActive) {
      filter.isActive = params.isActive;

      console.log("data-->", data);
    }
    if (params?.search) {
      filter.$or = [
        { clientId: params?.search },
        { clientName: { $regex: `${params?.search}`, $options: "i" } },
        {
          "familyMember.email": { $regex: `${params?.search}`, $options: "i" },
        },
      ];
    }

    data = await clientFamily.aggregate([
      {
        $match: filter,
      },
      {
        $unwind: "$familyMember",
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: (params.page - 1) * params.limit,
      },
      {
        $limit: Number(params.limit),
      },
    ]);
    if (data && data.length) {
      return { status: true, data: data };
    } else {
      return { status: false, data: [] };
    }
  }
  if (data && data.length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: [] };
  }
};

const getBOUsersList = async (params) => {
  let data;
  if (params.isActive === "true") params.isActive = true;
  if (params.isActive === "false") params.isActive = false;
  console.log("params", params);
  if (params.all) {
    let filter = {
      isDeleted: false,
    };
    if ([true, false].includes(params?.isActive)) {
      filter.isActive = params.isActive;
    }
    if (params.planType) {
      filter.planType = params.planType;
    }
    if (params?.search) {
      filter.$or = [
        { title: { $regex: `${params?.search}`, $options: "i" } },
        { contentId: { $regex: `${params?.search}`, $options: "i" } },
      ];
    }
    data = await BOUSERS.find(filter);
  } else {
    let filter = {
      isDeleted: false,
    };
    if ([true, false].includes(params?.isActive)) {
      filter.isActive = params.isActive;
    }
    if (params.planType) {
      filter.planType = params.planType;
    }
    if (params?.search) {
      filter.$or = [
        { title: { $regex: `${params?.search}`, $options: "i" } },
        { contentId: { $regex: `${params?.search}`, $options: "i" } },
      ];
    }
    data = await BOUSERS.find(filter)
      .skip((params.page - 1) * params.limit)
      .limit(params.limit)
      .sort({ createdAt: -1 });
  }
  if (data && data.length) {
    return { status: true, data: data };
  } else {
    return { status: false, data: [] };
  }
};

module.exports = {
  clientFamilyList,
  getBOUsersList,
};
