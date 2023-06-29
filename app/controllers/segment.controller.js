const { sendErrorResponse,sendSuccessResponse,} = require("../response/response");

const { addSegmentService, getSegmentByIdService, updateSegmentService, deleteSegmentService, segmentListService } = require("../services/segment.service");

const addSegment = async (req, res) => {
    const params = req.body;
    params.createdBy = req?.user?._id?.toString();
    params.updatedBy = req?.user?._id?.toString();
    const result = await addSegmentService(req, params);
    if (!result.status) {
        return sendErrorResponse(req, res, result?.statusCode, result?.message, result?.data);
    }
    return sendSuccessResponse(req, res, result?.statusCode, result?.message, result?.data);
};

const getSegmentById = async (req, res) => {
    console.log("data");
    let params = {};
    params.id = req.query.id
    params.adminScheduleId = req?.query?.adminScheduleId;
    console.log("enter");
    const result = await getSegmentByIdService(params);
    if (!result.status) {
        return sendErrorResponse( req,res,result?.statusCode, result?.message,result?.data);
    }
    return sendSuccessResponse( req,res,result?.statusCode,result?.message,result?.data);
};

const updateSegment = async (req, res) => {
    const params = req.body;
    params.id = req?.query?.id || req.user._id.toString();
    params.updatedBy = req?.user?._id?.toString();
    params.lastUpdatedBy = req?.user?.userType;
    const result = await updateSegmentService(params);
    if (!result.status) {
        return sendErrorResponse( req,res,result?.statusCode, result?.message,result?.data);
    }
    return sendSuccessResponse( req,res,result?.statusCode,result?.message,result?.data);
};

const segmentList = async (req, res) => {
    const params = req?.query;
    params.createdBy = req?.user?._id.toString()
    const result = await segmentListService(params);
    if (!result.status) {
        return sendErrorResponse( req,res,result?.statusCode, result?.message,result?.data);
    }
    return sendSuccessResponse( req,res,result?.statusCode,result?.message,result?.data);
};

const deleteSegment = async (req, res) => {
    const params = req.body;
    params.id = req?.query?.id || req.user._id.toString();
    params.updatedBy = req?.user?._id?.toString();
    params.lastUpdatedBy = req?.user?.userType;
    const result = await deleteSegmentService(params);
    if (!result.status) {
        return sendErrorResponse( req,res,result?.statusCode, result?.message,result?.data);
    }
    return sendSuccessResponse( req,res,result?.statusCode,result?.message,result?.data);
};

module.exports = {
    addSegment,
    getSegmentById,
    updateSegment,
    segmentList,
    deleteSegment
};
