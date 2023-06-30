const { messages } = require("../response/customMessages");
const { statusCodes } = require("../response/httpStatusCodes");
const { statusMessage } = require("../response/httpStatusMessages");
const { pageMetaService } = require("../helpers/index")
const { registrationSettings } = require("../models/registrationsetting");

const addregisterSettingService = async (req, params) => {
    try {
        console.log("paras",params)
        const createAdminSchedule = await new registrationSettings(params);
        const result = await createAdminSchedule.save();
        console.log("rrer-->",result)
        if (result) {
            return {
                status: true,
                statusCode: statusCodes?.HTTP_OK,
                message: messages?.inserted,
                data: result,
            };
        }
        else {
            return {
                status: false,
                statusCode: statusCodes?.HTTP_INTERNAL_SERVER_ERROR,
                message: messages?.notRegistered,
                data: [],
            };
        }
    } catch (error) {
        console.log('error -->', error)
    }
};

const getregisterSettingByIdService = async (params) => {
    console.log("params-->", params)
    //get ScheduleListService details by ScheduleListService id
    const result = await registrationSettings.findOne(
        {
            _id: params?.id,
            isDeleted: false
        });

    console.log('result', result)
    if (result) {
        return {
            status: true,
            statusCode: statusCodes?.HTTP_OK,
            message: statusMessage.success,
            data: result,
        };
    } else {
        return {
            status: false,
            statusCode: statusCodes?.HTTP_BAD_REQUEST,
            message: messages.dataNotFound,
            data: [],
        };
    }
};

const updateregisterSettingService = async (params) => {
    const id = params?.id;
    var query = { $set: params };
    console.log("id", id);
    //update ScheduleListService details into ScheduleListService table
    const result = await registrationSettings.updateOne({ _id: id }, query);
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

const deleteregisterSettingService = async (params) => {
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
    //update ScheduleListService details into ScheduleListService table
    const result = await registrationSettings.updateOne({ _id: ids }, query);
    if (!result.modifiedCount) {
        return {
            status: false,
            statusCode: statusCodes?.HTTP_BAD_REQUEST,
            message: messages?.dataNotFound,
            data: [],
        };
    }
    return {
        status: true,
        statusCode: statusCodes?.HTTP_OK,
        message: messages?.success,
        data: [],
    };
};

const registerSettingListService = async (params) => {
    console.log("params",params)
    //get all ScheduleListService list
    const allList = await registrationSettings.find({
        isDeleted: false,
        createdBy: params?.createdBy
    });
    console.log("allList", allList);

    //calculate pagemeta for pages and count
    const pageMeta = await pageMetaService(params, allList?.length || 0);
    return {
        status: true,
        statusCode: statusCodes?.HTTP_OK,
        data: { list: allList, pageMeta },
    };
};

module.exports = {
    addregisterSettingService,
    getregisterSettingByIdService,
    updateregisterSettingService,
    deleteregisterSettingService,
    registerSettingListService,
};
