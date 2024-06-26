const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../response/response");
const moment = require("moment");


const {
  adminLoginService,
  addAdminService,
  adminListService,
  deleteAdminService,
  updateAdminProfileService,
  getAdminProfileService,
  getAdminProfileByIdService,
  resetPasswordService,
  sendOTPService,
  verifyOTPService,
  forgotPasswordService,
  uploadImageService,
  getSequenceIdService,getImageBlobService
} = require("../services/admin.services");

// admin related api's

const adminLogin = async (req, res) => {
  const params = req.body;
  const result = await adminLoginService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,  
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const sendOTP = async (req, res) => {
  const params = req.body;
  const result = await sendOTPService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const verifyOTP = async (req, res) => {
  const params = req.body;
  const result = await verifyOTPService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const forgot_password = async (req, res) => {
  const params = req.body;
  const result = await forgotPasswordService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const resetPassword = async (req, res) => {
  const params = req.body;
  params.id =  req?.user?._id
  console.log('params-->', params)
  const result = await resetPasswordService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};


const addAdmin = async (req, res) => {
  const params = req.body;
  params.createdBy = req?.user?._id?.toString();
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  const result = await addAdminService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const getAdminProfile = async (req, res) => {
  let params = {};
  params.id = req.query.id || req.user._id.toString()
  params.adminId = req?.query?.adminId  //req.user._id.toString();
  const result = await getAdminProfileService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const getProfile = async (req, res) => {
  let params = {};
  params.adminId = req?.query?.adminId;
  params.id = req?.query?.id
  const result = await getAdminProfileByIdService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};



const updateAdminProfile = async (req, res) => {
 
  
  const params = req.body;
  params.id = req?.query?.id || req.user._id.toString();
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  const result = await updateAdminProfileService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const adminList = async (req, res) => {
  const params = req?.query;
  const result = await adminListService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};

const deleteAdmin = async (req, res) => {

  const params = req.body;
  if (req.query.id) {
    params.id = req?.query?.id;
  }
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  params.ids = req.body.ids;

  const result = await deleteAdminService(params);
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};


const uploadImage = async (req, res) => {
  const result = await uploadImageService(req);
  console.log(result)
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};


const getSequenceId = async (req, res) => {
  console.log("data-->",req.body)
  const result = await getSequenceIdService(req);
  console.log(result)
  if (!result.status) {
    return sendErrorResponse(
      req,
      res,
      result?.statusCode,
      result?.message,
      result?.data
    );
  }
  return sendSuccessResponse(
    req,
    res,
    result?.statusCode,
    result?.message,
    result?.data
  );
};


const getImageBlob = async (req, res) => {
  console.log("data-->",req.body)
  const result = await getImageBlobService(req.body.key,res);
  if(result.data)
  {
    console.log("data1-->",result)
    // res.setHeader(
    //   "custom-Content-Type",
    //   result.data.data.ContentType
    //   );
    //   let contentType = result.data.data.ContentType.split('/')[1]
    //   console.log(contentType,'contentType')
    //   res.setHeader("Content-Disposition", `attachment; filename=${moment().format('YYYY-MM-DD-hh-mm-ss')}.${contentType}`);
      return res.status(200).send(result.data.data);

    // return sendErrorResponse(
    //       req,
    //       res,
    //       result?.statusCode,
    //       result?.message,
    //       result?.data
    //     );

  }
 
   


  // if (!result.status) {
  //   return sendErrorResponse(
  //     req,
  //     res,
  //     result?.statusCode,
  //     result?.message,
  //     result?.data
  //   );
  // }
  // return sendSuccessResponse(
  //   req,
  //   res,
  //   result?.statusCode,
  //   result?.message,
  //   result?.data
  // );
};



module.exports = {
  adminLogin,
  sendOTP,
  verifyOTP,
  forgot_password,
  resetPassword,
  addAdmin,
  getAdminProfile,
  getProfile,
  updateAdminProfile,
  adminList,
  deleteAdmin,
  uploadImage,
  getSequenceId,
  getImageBlob
};
