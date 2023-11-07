
const excelJs = require('exceljs')
const {
  sendErrorResponse,
  sendSuccessResponse,
} = require("../response/response");

const {
  addauthorizedPersonService,
  authorizedPersonLoginService,
  updateauthorizedPersonProfileService,
  authorizedPersonVerifyOTPService,
  getauthorizedPersonProfileService,
  authorizedPersonListService,
  deleteauthorizedPersonService,
  authorizedPersonSendLoginIdService,
  authorizedPersonSendMailIdService,
  authorizedPersonResetPasswordService,
  validateCouponService,
} = require("../services/authorizedPerson.service");

const moment = require("moment");

//authorizedPerson profile related api's

const authorizedPersonLogin = async (req, res) => {
  const params = req.body;
  const result = await authorizedPersonLoginService(params);
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

const authorizedPersonMailLoginById = async (req, res) => {
  const params = req.body;
  const result = await authorizedPersonSendMailIdService(params);
  console.log("result111--->", result);
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

const authorizedPersonLoginById = async (req, res) => {
  const params = req.body;
  const result = await authorizedPersonSendLoginIdService(params);
  console.log("result111--->", result);
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

const authorizedPersonverifyOTP = async (req, res) => {
  const params = req.body;
  const result = await authorizedPersonVerifyOTPService(params);
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

const authorizedPersonSendLoginId = async (req, res) => {
  const params = req.body;
  const result = await authorizedPersonVerifyOTPService(params);
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

const addauthorizedPerson = async (req, res) => {
  const params = req.body;
  console.log("params--->",params)
  params.lastUpdatedBy = req?.user?.userType;
  const result = await addauthorizedPersonService(req, params);
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

const validateNomineeAge = async (req, res) => {
  if (req?.body?.nomineeDOB) {
    const birthdate = req.body.nomineeDOB;

    const currentDate = moment();

    const ageInYears = currentDate.diff(birthdate, "years");

    console.log("ageInYears-->", ageInYears);

    if (ageInYears <= 18) {
      return sendErrorResponse(
        req,
        res,
        400,
        "Nomine Must be Greater than 18 Age",
        []
      );
    } else {
      return sendSuccessResponse(req, res, 200, "Nominee Age Accepted", []);
    }
  }
  if (req?.body?.guardianDOB) {
    const birthdate = req.body.guardianDOB;

    const currentDate = moment();

    const ageInYears = currentDate.diff(birthdate, "years");

    console.log("ageInYears-->", ageInYears);

    if (ageInYears <= 18) {
      return sendErrorResponse(
        req,
        res,
        400,
        "Guardian Must be Greater than 18 Age",
        []
      );
    } else {
      return sendSuccessResponse(req, res, 200, "Guardian Age Accepted", []);
    }
  }
};

const getauthorizedPersonProfile = async (req, res) => {
  console.log("data");
  let params = {};
  params.id = req.query.id || req.query._id;
  params.authorizedPersonId = req?.query?.authorizedPersonId; // || req.user._id.toString();
  console.log("enter");

  let result = await getauthorizedPersonProfileService(params);

  result = JSON.parse(JSON.stringify(result));

  let showtime;

  let currentHour = moment(new Date()).tz("Asia/kolkata").format("HH");

  if (currentHour >= 4 && currentHour < 12) {
    showtime = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 16) {
    showtime = "Good Afternoon";
  } else if (currentHour >= 16 && currentHour < 20) {
    showtime = "Good Evening";
  } else if (
    (currentHour >= 20 && currentHour < 24) ||
    (currentHour >= 0 && currentHour < 4)
  ) {
    showtime = "Good Night";
  }
  console.log("showtime", showtime);

  result.data.showtime = showtime;

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

const updateauthorizedPersonProfile = async (req, res) => {
  const params = req.body;
  // params.id = req?.query?.id;
  params.authorizedPersonId = req?.query?.id || req.user._id.toString();
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  const result = await updateauthorizedPersonProfileService(params);
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

const authorizedPersonList = async (req, res) => {
  const params = req?.query;
  const result = await authorizedPersonListService(params);
  let professionalDocument,educationQualificationDocument,residentialAddressProof,officeAddressProof,proofOfNameChange;

  if (String(req.query.isExport) == "true" &&  result?.data?.list) {
    for (let item of result?.data?.list) {
      if (item.document.professionalDocument.documentPath) {
        professionalDocument = {
          type: item.document.professionalDocument.type,
          url: item.document.professionalDocument.documentPath.urlS3,
        };
      } else professionalDocument == null;
      if (item.document.educationQualificationDocument.documentPath) {
        educationQualificationDocument = {
          type: item.document.educationQualificationDocument.type,
          url: item.document.educationQualificationDocument.urlS3,
        };
      } else educationQualificationDocument == null;
      if (item.document.residentialAddressProof.documentPath) {
        residentialAddressProof = {
          type: item.document.residentialAddressProof.type,
          url: item.document.residentialAddressProof.documentPath.urlS3,
        };
      } else residentialAddressProof == null;
      if (item.document.officeAddressProof.documentPath) {
        officeAddressProof = {
          type: item.document.officeAddressProof.type,
          url: item.document.officeAddressProof.documentPath.urlS3,
        };
      } else officeAddressProof == null;
      if (item.document.proofOfNameChange.documentPath) {
        proofOfNameChange = {
          type: item.document.proofOfNameChange.type,
          url: item.document.proofOfNameChange.documentPath.urlS3,
        };
      } else proofOfNameChange == null;

      item.professionalDocument = professionalDocument;
     item.educationQualificationDocument =  educationQualificationDocument,
     item.residentialAddressProof = residentialAddressProof,
     item.officeAddressProof =  officeAddressProof,
     item.proofOfNameChange =  proofOfNameChange
    }

    let workbook = new excelJs.Workbook();
    let worksheet = workbook.addWorksheet("Sheet1");

    worksheet.columns = [
      { header: "name", key: "name", width: 15 },
      { header: "fatherName", key: "fatherName", width: 25 },
      { header: "motherName", key: "motherName", width: 25 },
      { header: "gender", key: "gender", width: 25 },
      { header: "mobileNumber", key: "mobileNumber", width: 25 },
      { header: "email", key: "email", width: 25 },
      { header: "nationality", key: "nationality", width: 25 },
      { header: "tradeMember", key: "tradeMember", width: 15 },
      { header: "website", key: "website", width: 25 },
      { header: "occupationType", key: "occupationType", width: 25 },
      { header: "role", key: "role", width: 25 },
      { header: "capitalMarketingExperience", key: "capitalMarketingExperience", width: 25 },
      { header: "isBrokerExperirnce", key: "isBrokerExperirnce", width: 25 },
      { header: "brokerDetails", key: "brokerDetails", width: 25 },
      { header: "address", key: "address", width: 25 },
      { header: "document", key: "document", width: 25 },
      { header: "business", key: "business", width: 25 },
      { header: "bankDetails", key: "bankDetails", width: 25 },
      { header: "nomineeDetails", key: "nomineeDetails", width: 25 },
      { header: "paymentDetails", key: "paymentDetails", width: 25 },
      { header: "inPersonVerification", key: "inPersonVerification", width: 25 },
      { header: "authorizedPersonId", key: "authorizedPersonId", width: 15 },
      { header: "professionalDocument", key: "professionalDocument", width: 40 },
      { header: "educationQualificationDocument", key: "educationQualificationDocument", width: 40 },
      { header: "residentialAddressProof", key: "residentialAddressProof", width: 40 },
      { header: "officeAddressProof", key: "officeAddressProof", width: 40 },
      { header: "proofOfNameChange", key: "proofOfNameChange", width: 40 },
    ];
    let workData = result?.data?.list || [];
  //  console.log(workData);
    // if (workData?.length) workData = workData?.map(w => ({ ...w, fullName: w?.userDetails?.fullName || "" }))
    worksheet.addRows(result?.data?.list);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" +
        `Sales Statistics-${moment().format("YYYY-MM-DD-hh-mm-ss")}.xlsx`
    );

    await workbook.xlsx.write(res);
    return res.status(statusCodes.HTTP_OK).end();
  }
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

const deleteauthorizedPerson = async (req, res) => {
  const params = req.body;
  params.authorizedPersonId =
    req?.query?.authorizedPersonId || req.user._id.toString();
  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  const result = await deleteauthorizedPersonService(params);
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

const authorizedPersonResetPassword = async (req, res) => {
  const params = req.body;
  params.authorizedPersonId =
    req?.query?.authorizedPersonId || req.user._id.toString();

  params.updatedBy = req?.user?._id?.toString();
  params.lastUpdatedBy = req?.user?.userType;
  params.email = req?.user?.email;
  const result = await authorizedPersonResetPasswordService(params);
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

const validateCoupon = async (req, res) => {
  const params = req.body;
  const result = await validateCouponService(params);
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

module.exports = {
  authorizedPersonLogin,
  authorizedPersonverifyOTP,
  addauthorizedPerson,
  authorizedPersonLoginById,
  getauthorizedPersonProfile,
  updateauthorizedPersonProfile,
  authorizedPersonList,
  authorizedPersonMailLoginById,
  authorizedPersonSendLoginId,
  deleteauthorizedPerson,
  validateNomineeAge,
  authorizedPersonResetPassword,
  validateCoupon,
};
