const { messages } = require("../response/customMessages");
const { statusCodes } = require("../response/httpStatusCodes");
const { statusMessage } = require("../response/httpStatusMessages");
const { pageMetaService } = require("../helpers/index")
const { segment } = require("../models/segment");

const addSegmentService = async (req, params) => {
    try {
        console.log("paras",params)
        const createAdminSchedule = await new segment(params);
        const result = await createAdminSchedule.save();
        console.log("rrer",result)
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

const getSegmentByIdService = async (params) => {
    console.log("params-->", params)
    //get ScheduleListService details by ScheduleListService id
    const result = await segment.findOne(
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

const updateSegmentService = async (params) => {
    const id = params?.id;
    var query = { $set: params };
    console.log("id", id);
    //update ScheduleListService details into ScheduleListService table
    const result = await segment.updateOne({ _id: id }, query);
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

const deleteSegmentService = async (params) => {
    const id = params?.id;
    var query = {
        $set: {
            isDeleted: true,
            updatedBy: params?.updatedBy,
            lastUpdatedBy: params?.lastUpdatedBy,
        },
    };
    //update ScheduleListService details into ScheduleListService table
    const result = await segment.updateOne({ _id: id }, query);
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

const segmentListService = async (params) => {
    console.log("params",params)
    //get all ScheduleListService list
    const allList = await segment.find({
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
    addSegmentService,
    getSegmentByIdService,
    updateSegmentService,
    deleteSegmentService,
    segmentListService,
};
