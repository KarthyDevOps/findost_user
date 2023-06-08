const joi = require("joi");
const { statusCodes } = require("../response/httpStatusCodes");
const { statusMessage } = require("../response/httpStatusMessages");

const { joierrors } = require("../response/response");
const options = {
  // generic option
  basic: {
    abortEarly: false,
    convert: true,
    allowUnknown: false,
    stripUnknown: true,
  },
  // Options for Array of array
  array: {
    abortEarly: false,
    convert: true,
    allowUnknown: true,
    stripUnknown: {
      objects: true,
    },
  },
};

const bodyParamValidation = (req, res, next, schama) => {
  let schema = schama;
  let option = options.basic;
  var { error, value } = schema.validate(req.body, option);
  if (error && Object.keys(error).length > 0) {
    joierrors(
      req,
      res,
      statusCodes.HTTP_BAD_REQUEST,
      statusMessage[400],
      error
    );
  } else {
    next();
  }
};

const queryParamValidation = (req, res, next, schama) => {
  let schema = schama;
  let option = options.basic;
  var { error, value } = schema.validate(req.query, option);
  if (error && Object.keys(error).length > 0) {
    joierrors(
      req,
      res,
      statusCodes.HTTP_BAD_REQUEST,
      statusMessage[400],
      error
    );
  } else {
    if (req?.bodyParam) return;
    else next();
    // next();
  }
};

const adminloginSchema = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required(),
  });
  return bodyParamValidation(req, res, next, schema);
};

const addAdminSchema = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().required(),
    mobileNumber: joi.string().optional(),
    email: joi.string().required().email(),
    password: joi.string().required(),
  });
  return bodyParamValidation(req, res, next, schema);
};

const getAdminProfileSchema = (req, res, next) => {
  const schema = joi.object({
    adminId: joi.string().optional().allow(null).allow(""),
    id: joi.string().optional().allow(null).allow("")
  });
  return queryParamValidation(req, res, next, schema);
};

const deleteAdminProfileSchema = (req, res, next) => {
  const schema = joi.object({
  //  adminId: joi.string().optional().allow(null).allow(""),
    id: joi.string().optional().allow(null).allow("")
  });
  return queryParamValidation(req, res, next, schema);
};


const updateAdminProfileSchema = (req, res, next) => {
  
  const querySchema = joi.object({
    id: joi.string().required(null).allow(""),
  });
  req.bodyParam = true;
  queryParamValidation(req, res, next, querySchema);

  const schema = joi.object({
    name: joi.string(),
    gender: joi.string(),
    mobileNumber: joi.string().min(10).max(10),
    email: joi.string().email(),
    isActive: joi.boolean(),
  });
  return bodyParamValidation(req, res, next, schema);
};

const adminListSchema = (req, res, next) => {
  const schema = joi.object({
    search: joi.allow(null).allow(""),
    limit: joi.number().required(),
    page: joi.number().required(),
  });
  return queryParamValidation(req, res, next, schema);
};

const sendOTPSchema = (req, res, next) => {
  const schema = joi.object({
    mobileNumber: joi.string().optional().min(10).max(10),
    authorizedPersonId : joi.string()
  });
  return bodyParamValidation(req, res, next, schema);
};

const verifyOTPSchema = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().required().email(),
    otp: joi.string().required(),
  });
  return bodyParamValidation(req, res, next, schema);
};

const forgotThroughMailSchema = (req,res,next) => {
  const schema = joi.object({
    email: joi.string().required().email(),
  });
  return bodyParamValidation(req, res, next, schema);
}

const resetPasswordSchema = (req, res, next) => {
  const schema = joi.object({
    password: joi.string().required(),
    confirmPassword: joi.string().required(),
  });
  return bodyParamValidation(req, res, next, schema);
};

const authorizedPersonloginSchema = (req, res, next) => {
  const schema = joi.object({
    mobileNumber: joi.string().min(10).max(10),
    authorizedPersonId: joi.string(),
  }).or( 'mobileNumber', 'authorizedPersonId');

  return bodyParamValidation(req, res, next, schema);
};
const authorizedPersonloginbyIdSchema = (req, res, next) => {
  const schema = joi.object({
    authorizedPersonId: joi.string().min(6).max(6).required(),
    password: joi.string().min(8).max(10).required(),
  });
  return bodyParamValidation(req, res, next, schema);
};

const authorizedPersonforgotPasswordSchema = (req, res, next) => {
  const schema = joi.object({
    authorizedPersonId: joi.string().min(6).max(8).required(),
  });
  return bodyParamValidation(req, res, next, schema);
};

const authorizedPersonVerifyOTPSchema = (req, res, next) => {
  const schema = joi.object({
    mobileNumber: joi.string().min(10).max(10),
    authorizedPersonId: joi.string(),
    otp: joi.number().required(),
  }).or('mobileNumber', 'authorizedPersonId');
  return bodyParamValidation(req, res, next, schema);
};

const forgotPasswordVerifyOTPSchema = (req, res, next) => {
  const schema = joi.object({
    authorizedPersonId: joi.string().required().min(6).max(10),
    otp: joi.number().required(),
  });
  return bodyParamValidation(req, res, next, schema);
};

const forgotPasswordLoginIdSchema = (req, res, next) => {
  const schema = joi.object({
    email: joi.string().required()
  });
  return bodyParamValidation(req, res, next, schema);
};

const addAuthorizedPersonSchema = (req, res, next) => {
  const schema = joi.object({
    // name: joi.string().required(),
    // password: joi.string().required(),
    // fatherName: joi.string().required(),
    // motherName: joi.string().required(),
    // gender: joi.string().required(),
    // mobileNumber: joi.string().min(10).max(10).required(),
    // email: joi.string().email(),
    // nationality: joi.string().allow(null).allow(""),
    // tradeMember: Joi.string().required(),
    // website: Joi.string().optional(),
    // occupationType: Joi.string().required(),
    // role: Joi.string().required(),
    // address: Joi.object().items(Joi.object({
    //   addressType: Joi.string().required(),
    //   residentialFlatNo: Joi.string().optional(),
    //   residentialArea: Joi.string().optional(),
    //   residentialCity: Joi.string().optional(),
    //   residentialState: Joi.string().optional(),
    //   residentialCountry: Joi.string().optional(),
    //   residentialLandMark: Joi.string().optional(),
    //   residentialPinCode: Joi.string().optional(),
    //   isResidentialSameAsOffice: Joi.boolean().required(),
    //   officeFlatNo: Joi.string().optional(),
    //   officeArea: Joi.string().optional(),
    //   officeCity: Joi.string().optional(),
    //   officeState: Joi.string().optional(),
    //   officeCountry: Joi.string().optional(),
    //   officeLandMark: Joi.string().optional(),
    //   officePinCode: Joi.string().optional(),
    //   isOfficeSameAsResident: Joi.string().optional() 
    // })),
    // document: Joi.object().items(Joi.object({
    //   professionalDocument: Joi.string().required(),
    //   educationQualificationDocument: Joi.string().optional(),
    //   isDifferentPanName: Joi.string().optional(),
    //   residentialAddressProof: Joi.string().optional(),
    //   officeAddressProof: Joi.string().optional(),
    //   proofOfNameChange: Joi.string().optional()
    // })),
    // bankDetails: Joi.object().items(Joi.object({
    //   bankName: Joi.string().required(),
    //   accountNo: Joi.string().optional(),
    //   ifscCode: Joi.string().optional(),
    //   bankBranch: Joi.string().optional(),
    //   uploadChequeLeaflet: Joi.string().optional(),
    // })),
    // nomineeDetails: Joi.object().items(Joi.object({
    //   nomineeName: Joi.string().required(),
    //   nomineePan: Joi.string().optional(),
    //   nomineeMobile: Joi.string().optional(),
    //   nomineeDOB : Joi.string().optional(),
    //   nomineeRelationship: Joi.string().optional(),
    //   isNomineeMinor : Joi.string().optional(),
    //   nomineeRelationship: Joi.string().optional(),

    // })),

  
  });
  return bodyParamValidation(req, res, next, schema);
};

const getAuthorizedPersonProfileSchema = (req, res, next) => {
  const schema = joi.object({
    authorizedPersonId: joi.string().optional(),
    id: joi.string().optional(),
    
  });
  return queryParamValidation(req, res, next, schema);
};

const updateAuthorizedPersonProfileSchema = (req, res, next) => {
  console.log("data-->");
  const querySchema = joi.object({
    id: joi.string().required(),
  });
  req.bodyParam = true;
  queryParamValidation(req, res, next, querySchema);

  const schema = joi.object({
    name: joi.string(),
    // gender: joi.string(),
    mobileNumber: joi.string().min(10).max(10),
    email: joi.string().email(),
    profileURL: joi.string().allow(null).allow(""),
  });
  return bodyParamValidation(req, res, next, schema);
};

const authorizedPersonListSchema = (req, res, next) => {
  const schema = joi.object({
    search: joi.allow(null).allow(""),
    limit: joi.number().required(),
    page: joi.number().required(),
  });
  return queryParamValidation(req, res, next, schema);
};


//client family api

const addClientFamilySchema = (req, res, next) => {
  const schema = joi.object({
    clientName: joi.string().required(),
    gender: joi.string().optional(),
    mobileNumber: joi.string().min(10).max(10).required(),
    email: joi.string().email(),
    dateOfBirth: joi.string().required(),
    relativeName: joi.string().required(),
    relationShip: joi.string().required(),
    isActive: joi.boolean().required(),
  });
  return bodyParamValidation(req, res, next, schema);
};

const updateClientFamilyProfileSchema = (req, res, next) => {
  console.log("data-->");
  const querySchema = joi.object({
    clientId: joi.string().optional(),
    id:joi.string().required()
  });
  req.bodyParam = true;
  queryParamValidation(req, res, next, querySchema);

  const schema = joi.object({
    clientName: joi.string().optional(),
    gender: joi.string().optional(),
    mobileNumber: joi.string().min(10).max(10).optional(),
    email: joi.string().email(),
    dateOfBirth: joi.string().optional(),
    relativeName: joi.string().optional(),
    relationShip: joi.string().optional(),
    isActive: joi.boolean().optional(),
  });
  return bodyParamValidation(req, res, next, schema);
};


const clientFamilyProfileSchema = (req, res, next) => {
  const schema = joi.object({
    id: joi.string().required(),
  });
  return queryParamValidation(req, res, next, schema);
};

const clientFamilyListSchema = (req, res, next) => {
  const schema = joi.object({
    search: joi.allow(null).allow(""),
    limit: joi.number().required(),
    page: joi.number().required(),
  });
  return queryParamValidation(req, res, next, schema);
};


module.exports = {
  adminloginSchema,
  addAdminSchema,
  getAdminProfileSchema,
  updateAdminProfileSchema,
  deleteAdminProfileSchema,
  adminListSchema,
  sendOTPSchema,
  verifyOTPSchema,
  forgotThroughMailSchema,
  resetPasswordSchema,
  authorizedPersonloginSchema, //<---- authorized person 
  authorizedPersonVerifyOTPSchema,
  addAuthorizedPersonSchema,
  authorizedPersonforgotPasswordSchema,
  getAuthorizedPersonProfileSchema,
  forgotPasswordVerifyOTPSchema,
  forgotPasswordLoginIdSchema,
  updateAuthorizedPersonProfileSchema,
  authorizedPersonListSchema,
  authorizedPersonloginbyIdSchema,
  addClientFamilySchema , //<----client family
  clientFamilyProfileSchema,
  clientFamilyListSchema,  
  updateClientFamilyProfileSchema
};
