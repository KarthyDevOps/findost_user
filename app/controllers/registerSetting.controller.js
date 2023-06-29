const { sendErrorResponse,sendSuccessResponse,} = require("../response/response");

const {  addregisterSettingService,
    getregisterSettingByIdService,
    updateregisterSettingService,
    deleteregisterSettingService,
    registerSettingListService, } = require("../services/registrationSettings");

const addregisterSettings = async (req, res) => {
    const params = req.body;
    params.createdBy = req?.user?._id?.toString();
    params.updatedBy = req?.user?._id?.toString();
    const result = await addregisterSettingService(req, params);
    if (!result.status) {
        return sendErrorResponse(req, res, result?.statusCode, result?.message, result?.data);
    }
    return sendSuccessResponse(req, res, result?.statusCode, result?.message, result?.data);
};

const getregisterSettingById = async (req, res) => {
    console.log("data");
    let params = {};
    params.id = req.query.id
    params.adminScheduleId = req?.query?.adminScheduleId;
    console.log("enter");
    const result = await getregisterSettingByIdService(params);
    if (!result.status) {
        return sendErrorResponse( req,res,result?.statusCode, result?.message,result?.data);
    }
    return sendSuccessResponse( req,res,result?.statusCode,result?.message,result?.data);
};

const updateregisterSetting = async (req, res) => {
    const params = req.body;
    params.id = req?.query?.id || req.user._id.toString();
    params.updatedBy = req?.user?._id?.toString();
    params.lastUpdatedBy = req?.user?.userType;
    const result = await updateregisterSettingService(params);
    if (!result.status) {
        return sendErrorResponse( req,res,result?.statusCode, result?.message,result?.data);
    }
    return sendSuccessResponse( req,res,result?.statusCode,result?.message,result?.data);
};

const registerSettingList = async (req, res) => {
    const params = req?.query;
    params.createdBy = req?.user?._id.toString()
    const result = await registerSettingListService(params);
    if (!result.status) {
        return sendErrorResponse( req,res,result?.statusCode, result?.message,result?.data);
    }
    return sendSuccessResponse( req,res,result?.statusCode,result?.message,result?.data);
};

const deleteregisterSetting = async (req, res) => {
    const params = req.body;
    params.id = req?.query?.id || req.user._id.toString();
    params.updatedBy = req?.user?._id?.toString();
    params.lastUpdatedBy = req?.user?.userType;
    const result = await deleteregisterSettingService(params);
    if (!result.status) {
        return sendErrorResponse( req,res,result?.statusCode, result?.message,result?.data);
    }
    return sendSuccessResponse( req,res,result?.statusCode,result?.message,result?.data);
};

module.exports = {
    addregisterSettings,
    getregisterSettingById,
    updateregisterSetting,
    registerSettingList,
    deleteregisterSetting

};
