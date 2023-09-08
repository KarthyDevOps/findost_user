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
    params.applicationFee = Number(req?.body?.applicationFee).toFixed(2);
    params.securityDeposit = Number(req?.body?.securityDeposit).toFixed(2);
    const result = await addregisterSettingService(req, params);
    if (!result.status) {
        return sendErrorResponse(req, res, result?.statusCode, result?.message, result?.data);
    }
    return sendSuccessResponse(req, res, result?.statusCode, result?.message, result?.data);
};

const getregisterSettingById = async (req, res) => {

    const result = await getregisterSettingByIdService();
    if (!result.status) {
        return sendErrorResponse( req,res,result?.statusCode, result?.message,result?.data);
    }
    return sendSuccessResponse( req,res,result?.statusCode,result?.message,result?.data);
};

const updateregisterSetting = async (req, res) => {
    const params = req.body;
    params.id = req?.query?.id 
    params.updatedBy = req?.user?._id?.toString();
    params.lastUpdatedBy = req?.user?.userType;
    params.applicationFee = Number(req?.body?.applicationFee).toFixed(2);
    params.securityDeposit = Number(req?.body?.securityDeposit).toFixed(2);
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
    if (req.query.id) {
        params.id = req?.query?.id;
    }
    params.updatedBy = req?.user?._id?.toString();
    params.lastUpdatedBy = req?.user?.userType;
    params.ids = req.body.ids;
    const result = await deleteregisterSettingService(params);
    if (!result.status) {
        return sendErrorResponse(req, res, result?.statusCode, result?.message, result?.data);
    }
    return sendSuccessResponse(req, res, result?.statusCode, result?.message, result?.data);
};

module.exports = {
    addregisterSettings,
    getregisterSettingById,
    updateregisterSetting,
    registerSettingList,
    deleteregisterSetting

};
