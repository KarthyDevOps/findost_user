const { clientFamily } = require("../models/clientFamily");

const clientFamilyList = async (params) => {
    let data;
    if (params.all) {
      let filter = {
        isDeleted: false,
      };
      if (params?.isActive) {
        filter.isActive = params.isActive;
      }
     if(params?.type) {
      filter.type = params.type 
     }
      if (params?.search) {
        filter.$or = [
          { clientId: params?.search },
          { clientName: { $regex: `${params?.search}`, $options: "i" } },
          { email: { $regex: `${params?.search}`, $options: "i" } },
        ];
      }
      console.log('filter--->', filter)
      data = await clientFamily.find(filter);
    } else {
        console.log('data--?')
        let filter = {
            isDeleted: false,
        };
        if (params?.type) {
            filter.type = params.type
        }
        if (params?.isActive) {
            filter.isActive = params.isActive;
            
  console.log("data-->",data)
    }
        if (params?.search) {
            filter.$or = [
                { clientId: params?.search },
                { clientName: { $regex: `${params?.search}`, $options: "i" } },
                { email: { $regex: `${params?.search}`, $options: "i" } },
            ];
        }
        
        data = await clientFamily.aggregate([
            {
                '$match': filter
            },
            {
                $unwind: "$familyMember"
            },
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: (params.page - 1) * params.limit
            },
            {
                $limit:Number(params.limit)
            }
        ])
    if (data && data.length) {
      return { status: true, data: data };
    } else {
      return { status: false, data: [] };
    }
  };

}

  
  module.exports = {
    clientFamilyList
  }