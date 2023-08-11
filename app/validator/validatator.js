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
    password: joi.string().min(8).max(10).optional(),
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
    name: joi.string().required(),
    password: joi.string().required(),
    fatherName: joi.string().required(),
    motherName: joi.string().required(),
    gender: joi.string().required(),
    mobileNumber: joi.string().min(10).max(10).required(),
    email: joi.string().email(),
    nationality: joi.string().allow(null).allow(""),
    tradeMember: joi.string().allow(null).allow(""),
    website: joi.string().allow(null).allow(""),
    occupationType: joi.string().required(),
    role: joi.string().required(),
    address: joi.object({
      addressType: joi.string().required(),
      residentialFlatNo: joi.string().optional(),
      residentialArea: joi.string().optional(),
      residentialCity: joi.string().optional(),
      residentialState: joi.string().optional(),
      residentialCountry: joi.string().optional(),
      residentialLandMark: joi.string().optional(),
      residentialPinCode: joi.string().optional(),
      isResidentialSameAsOffice: joi.boolean().required(),
      officeFlatNo: joi.string().optional(),
      officeArea: joi.string().optional(),
      officeCity: joi.string().optional(),
      officeState: joi.string().optional(),
      officeCountry: joi.string().optional(),
      officeLandMark: joi.string().optional(),
      officePinCode: joi.string().optional(),
      isOfficeSameAsResident: joi.boolean().required() 
    }),
    // document:joi.object({
    //   professionalDocument: joi.object().optional(),
    //   educationQualificationDocument: joi.object().optional(),
    //   isDifferentPanName: joi.boolean().optional(),
    //   residentialAddressProof: joi.object().optional(),
    //   officeAddressProof: joi.object().optional(),
    // }),
    bankDetails: joi.object({
      bankName: joi.string().required(),
      accountNo: joi.string().required(),
      ifscCode: joi.string().optional(),
      bankBranch: joi.string().optional(),
      uploadChequeLeaflet: joi.object().optional(),
    }),
    nomineeDetails:joi.object({
      nomineeName: joi.string().required(),
      nomineePan: joi.string().optional(),
      nomineeMobile: joi.string().optional(),
      nomineeDOB : joi.string().optional(),
      nomineeRelationship: joi.string().optional(),
      isNomineeMinor : joi.boolean().required(),
      nomineeRelationship: joi.string().optional(), 
      nomineeGuardian: joi.object({
        guardianName:joi.string().allow(null).allow(""),
        guardianPAN: joi.string().allow(null).allow(""),
        guardianMobile: joi.string().allow(null).allow(""),
        guardianDOB : joi.string().allow(null).allow("")
      }),   
    }),
    // paymentDetails:joi.required({
    //   applicationFee:paymentDetails,
    //   securityDeposit: joi.string().required(),
    //   couponCode: joi.string().required(),
    //   totalcharges : joi.string().required()
    // }),
    settings: joi.object({
      isDarkTheme: joi.string().required(),
      isEnableBioMetricLogin: joi.string().required(),
      isMyNotificationSettings: joi.string().required(),
      isInsurenceNotification: joi.string().required(),
      isMutualFundsNotification: joi.string().required(),
      isEquityNotification: joi.string().required(),
      isSIPNotification: joi.string().required(),
      isIPONotification: joi.string().required(),
      isLoanNotification: joi.string().required()

    }),

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
    limit: joi.number().optional(),
    page: joi.number().optional(),
  });
  return queryParamValidation(req, res, next, schema);
};


//client family api

const addClientFamilySchema = (req, res, next) => {
  const schema = joi.object({
    clientName: joi.string().required(),
    familyMember: joi.array().required(),
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

const authorizedPersonResetPasswordSchema = (req, res, next) => {
  const schema = joi.object({
    password: joi.string().required(),
    confirmPassword: joi.string().required(),
   // confirmPassword: //joi.any().valid(joi.ref('password')).required().options({ confirmPassword: { any: { allowOnly: 'must match password' } } })
  });
  return bodyParamValidation(req, res, next, schema);
};

const validateCouponSchema = (req, res, next) => {
  const schema = joi.object({
    couponCode: joi.string().required(),
  });
  return bodyParamValidation(req, res, next, schema);
};

const clientFamilyProfileSchema = (req, res, next) => {
  const schema = joi.object({
    id: joi.string().optional(),
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
  updateClientFamilyProfileSchema,
  authorizedPersonResetPasswordSchema,
  validateCouponSchema
};
