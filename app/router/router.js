const express = require("express");
const Router = express.Router;
var multer = require("multer");
var upload = multer();
const {
  verifyToken,
  verifyAdminRole,
} = require("../middlewares/authentication");
const {
  adminloginSchema,
  addAdminSchema,
  getAdminProfileSchema,
  updateAdminProfileSchema,
  adminListSchema,
  deleteAdminProfileSchema,
  authorizedPersonloginSchema,
  getAuthorizedPersonProfileSchema,
  authorizedPersonVerifyOTPSchema,
  forgotPasswordVerifyOTPSchema,
  addAuthorizedPersonSchema,
  updateAuthorizedPersonProfileSchema,
  authorizedPersonListSchema,
  sendOTPSchema,
  resetPasswordSchema,
  verifyOTPSchema,
  authorizedPersonloginbyIdSchema,
  addClientFamilySchema,
  clientFamilyProfileSchema,
  clientFamilyListSchema,
  updateClientFamilyProfileSchema,
  forgotPasswordLoginIdSchema,
  forgotThroughMailSchema,
  authorizedPersonResetPasswordSchema,
  validateCouponSchema,
} = require("../validator/validatator");
const {
  adminLogin,
  getAdminProfile,
  updateAdminProfile,
  addAdmin,
  deleteAdmin,
  adminList,
  getProfile,
  verifyOTP,
  sendOTP,
  resetPassword,
  forgot_password,
  uploadImage,
  getImageBlob,
  getSequenceId,
} = require("../controllers/admin.controller");
const {
  authorizedPersonLogin,
  authorizedPersonverifyOTP,
  addauthorizedPerson,
  getauthorizedPersonProfile,
  updateauthorizedPersonProfile,
  authorizedPersonList,
  deleteauthorizedPerson,
  validateNomineeAge,
  authorizedPersonLoginById,
  authorizedPersonMailLoginById,
  authorizedPersonResetPassword,
  validateCoupon,
} = require("../controllers/authorizedPerson.controller");
const {
  addClientFamilyPerson,
  getClientPersonProfile,
  clientFamilyList,
  updateClientFamilyProfile,
  deleteClientFamily,
  getAdminClientPersonProfile,
  updateAdminClientFamilyProfile,
} = require("../controllers/clientFamily.controller");
const {
  orderCreate,
  paymentverify,
  checkPaymentStatus,
} = require("../controllers/payment.controller");
const {
  addSegment,
  getSegmentById,
  updateSegment,
  segmentList,
  deleteSegment,
} = require("../controllers/segment.controller");
const {
  addregisterSettings,
  getregisterSettingById,
  updateregisterSetting,
  deleteregisterSetting,
  registerSettingList,
} = require("../controllers/registerSetting.controller");

const {createBOusers,updateBOusers,deleteBOusers,BOusersList,getBOusers} = require("../controllers/BOUser.controller")
const { errHandle } = require("../helpers/index");
const { routes } = require("../routes/routes");
const router = Router();
//admin related api's
router.post(routes.v1.admin.login, [adminloginSchema], errHandle(adminLogin));
router.post(routes.v1.admin.sendOTP, errHandle(sendOTP)); //for future use
router.post(routes.v1.admin.verifyOTP, [verifyOTPSchema], errHandle(verifyOTP)); //for future use
router.post(
  routes.v1.admin.forgotPassword,
  [forgotThroughMailSchema],
  errHandle(forgot_password)
);
router.post(
  routes.v1.admin.resetPassword,
  [resetPasswordSchema, verifyToken(["ADMIN"])],
  errHandle(resetPassword)
);
router.post(routes.v1.admin.addProfile, [addAdminSchema], errHandle(addAdmin));
router.get(
  routes.v1.admin.getProfile,
  [
    verifyToken(["ADMIN"]),
    verifyAdminRole("staffManagement", "VIEW"),
    getAdminProfileSchema,
  ],
  errHandle(getAdminProfile)
);
router.get(routes.v1.admin.getAdmin, errHandle(getProfile));
router.put(
  routes.v1.admin.updateProfile,
  [
    verifyToken(["ADMIN"]),
    verifyAdminRole("staffManagement", "EDIT"),
    updateAdminProfileSchema,
  ],
  errHandle(updateAdminProfile)
);
router.delete(
  routes.v1.admin.delete,
  [
    verifyToken(["ADMIN"]),
    verifyAdminRole("staffManagement", "DELETE"),
    deleteAdminProfileSchema,
  ],
  errHandle(deleteAdmin)
);
router.get(
  routes.v1.admin.list,
  [verifyToken(["ADMIN"]), adminListSchema],
  errHandle(adminList)
);
// authorizedPerson related api's
router.post(
  routes.v1.authorizedPerson.login,
  [authorizedPersonloginSchema],
  errHandle(authorizedPersonLogin)
); //authorizedPerson login using mobileNumber
router.post(
  routes.v1.authorizedPerson.verifyOTP,
  [authorizedPersonVerifyOTPSchema],
  errHandle(authorizedPersonverifyOTP)
); //authorized person verify Otp through mobileNumber or AP ID
router.post(
  routes.v1.authorizedPerson.sendOTP,
  [sendOTPSchema],
  errHandle(authorizedPersonLogin)
); //for future use
router.post(
  routes.v1.authorizedPerson.forgotPasswordverifyOTP,
  [forgotPasswordVerifyOTPSchema],
  errHandle(authorizedPersonverifyOTP)
); //for furture use
router.post(
  routes.v1.authorizedPerson.forgotPasswordLoginIdMail,
  [forgotPasswordLoginIdSchema],
  errHandle(authorizedPersonMailLoginById)
); //AP send id through mail
router.post(
  routes.v1.authorizedPerson.loginById,
  errHandle(authorizedPersonLoginById)
); //authorized person login via id and password
router.post(
  routes.v1.authorizedPerson.addProfile,
  [addAuthorizedPersonSchema],
  errHandle(addauthorizedPerson)
);

router.post(
  routes.v1.authorizedPerson.validateNomineeAge,
  errHandle(validateNomineeAge)
);
router.get(
  routes.v1.authorizedPerson.getProfile,
  [verifyToken(["AP"]), getAuthorizedPersonProfileSchema],
  errHandle(getauthorizedPersonProfile)
);
router.get(
  routes.v1.authorizedPerson.getProfileById,
  errHandle(getauthorizedPersonProfile)
);
router.delete(
  routes.v1.authorizedPerson.delete,
  [
    verifyToken(["AP", , "ADMIN"]),
    verifyAdminRole("apManagement", "DELETE"),
    updateAuthorizedPersonProfileSchema,
  ],
  errHandle(deleteauthorizedPerson)
);
router.put(
  routes.v1.authorizedPerson.updateProfile,
  [
    verifyToken(["ADMIN", "AP"]),
    verifyAdminRole("apManagement", "UPDATE"),
    updateAuthorizedPersonProfileSchema,
  ],
  errHandle(updateauthorizedPersonProfile)
);
router.get(
  routes.v1.authorizedPerson.list,
  [
    verifyToken(["ADMIN"]),
    verifyAdminRole("apManagement", "VIEW"),
    authorizedPersonListSchema,
  ],
  errHandle(authorizedPersonList)
);
router.post(
  routes.v1.authorizedPerson.resetPassword,
  [verifyToken(["AP"]), authorizedPersonResetPasswordSchema],
  errHandle(authorizedPersonResetPassword)
);
router.post(
  routes.v1.authorizedPerson.validateCoupon,
  [validateCouponSchema],
  errHandle(validateCoupon)
);
//client family related api
router.post(
  routes.v1.clientFamily.addProfile,
  [
    verifyToken(["AP", "ADMIN"]),
    verifyAdminRole("clientFamilyManagement", "ADD"),
    addClientFamilySchema,
  ],
  errHandle(addClientFamilyPerson)
);
router.put(
  routes.v1.clientFamily.updateProfile,
  [
    verifyToken(["AP", "ADMIN"]),
    verifyAdminRole("clientFamilyManagement", "EDIT"),
    updateClientFamilyProfileSchema,
  ],
  errHandle(updateClientFamilyProfile)
);
//admin side
router.put(
  routes.v1.clientAdminFamily.updateProfile,
  [
    verifyToken(["ADMIN"]),
    verifyAdminRole("clientFamilyManagement", "EDIT"),
    updateClientFamilyProfileSchema,
  ],
  errHandle(updateAdminClientFamilyProfile)
);
router.get(
  routes.v1.clientFamily.getProfile,
  [
    verifyToken(["AP", "ADMIN"]),
    verifyAdminRole("clientFamilyManagement", "VIEW"),
    clientFamilyProfileSchema,
  ],
  errHandle(getClientPersonProfile)
);
router.get(
  routes.v1.clientAdminFamily.getProfile,
  [
    verifyToken(["ADMIN"]),
    verifyAdminRole("clientFamilyManagement", "VIEW"),
    clientFamilyProfileSchema,
  ],
  errHandle(getAdminClientPersonProfile)
);
router.get(
  routes.v1.clientFamily.getProfile,
  [
    verifyToken(["AP", "ADMIN"]),
    verifyAdminRole("clientFamilyManagement", "VIEW"),
    clientFamilyProfileSchema,
  ],
  errHandle(getClientPersonProfile)
);

router.get(
  routes.v1.clientFamily.list,
  [
    verifyToken(["AP", "ADMIN"]),
    verifyAdminRole("clientFamilyManagement", "VIEW"),
    clientFamilyListSchema,
  ],
  errHandle(clientFamilyList)
);
router.delete(
  routes.v1.clientFamily.delete,
  [
    verifyToken(["AP", "ADMIN"]),
    verifyAdminRole("clientFamilyManagement", "DELETE"),
    clientFamilyProfileSchema,
  ],
  errHandle(deleteClientFamily)
);
//Segment api
router.post(
  routes.v1.segment.addSegment,
  [verifyToken(["ADMIN"]), verifyAdminRole("feeManagement", "ADD")],
  errHandle(addSegment)
);
router.put(
  routes.v1.segment.updateSegment,
  [verifyToken(["ADMIN"]), verifyAdminRole("feeManagement", "UPDATE")],
  errHandle(updateSegment)
);
router.get(
  routes.v1.segment.getSegment,
  [verifyToken(["ADMIN"]), verifyAdminRole("feeManagement", "VIEW")],
  errHandle(getSegmentById)
);
router.get(routes.v1.segment.list, errHandle(segmentList));
router.delete(
  routes.v1.segment.delete,
  [verifyToken(["ADMIN"]), verifyAdminRole("feeManagement", "DELETE")],
  errHandle(deleteSegment)
);
//register setting api
router.post(
  routes.v1.registerSetting.add,
  [verifyToken(["ADMIN"]), verifyAdminRole("feeManagement", "ADD")],
  errHandle(addregisterSettings)
);
router.put(
  routes.v1.registerSetting.update,
  [verifyToken(["ADMIN"]), verifyAdminRole("feeManagement", "UPDATE")],
  errHandle(updateregisterSetting)
);
router.get(routes.v1.registerSetting.get, errHandle(getregisterSettingById));
router.get(
  routes.v1.registerSetting.list,
  [verifyToken(["ADMIN"]), verifyAdminRole("feeManagement", "VIEW")],
  errHandle(registerSettingList)
);
router.delete(
  routes.v1.registerSetting.delete,
  [verifyToken(["ADMIN"]), verifyAdminRole("feeManagement", "DELETE")],
  errHandle(deleteregisterSetting)
);
//upload Image
router.post(routes.v1.aws.uploadImage, errHandle(uploadImage));
router.post(routes.v1.aws.getImageBlob, errHandle(getImageBlob));

//get sequence id
router.get(routes.v1.sequence.sequenceId, errHandle(getSequenceId));
// razorpay
router.post(routes.v1.razorPay.orderCreate, errHandle(orderCreate));
router.post(routes.v1.razorPay.paymentverify, errHandle(paymentverify));
router.get(
  routes.v1.razorPay.checkPaymentStatus,
  errHandle(checkPaymentStatus)
);

//BOUSERS Management
router.get(routes.v1.BOUSERS.list, errHandle(BOusersList));
router.post(routes.v1.BOUSERS.add, errHandle(createBOusers));
router.get(routes.v1.BOUSERS.get, errHandle(getBOusers));
router.put(routes.v1.BOUSERS.update, errHandle(updateBOusers));
router.delete(routes.v1.BOUSERS.delete, errHandle(deleteBOusers));

module.exports = router;
