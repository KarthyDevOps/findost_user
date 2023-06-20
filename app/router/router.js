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
  authorizedPersonResetPasswordSchema
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
  getSequenceId
} = require("../controllers/admin.controller");
const {
  authorizedPersonLogin,
  authorizedPersonverifyOTP,
  addauthorizedPerson,
  getauthorizedPersonProfile,
  updateauthorizedPersonProfile,
  authorizedPersonList,
  deleteauthorizedPerson,
  authorizedPersonLoginById,
  authorizedPersonMailLoginById,
  authorizedPersonResetPassword
} = require("../controllers/authorizedPerson.controller");
const {
  addClientFamilyPerson,
  getClientPersonProfile,
  clientFamilyList,
  updateClientFamilyProfile,
  deleteClientFamily,
} = require("../controllers/clientFamily.controller");
const { errHandle } = require("../helpers/index");
const { routes } = require("../routes/routes");
const router = Router();


//admin related api's
router.post(routes.v1.admin.login, [adminloginSchema], errHandle(adminLogin));
router.post(routes.v1.admin.sendOTP, errHandle(sendOTP)); //for future use
router.post(routes.v1.admin.verifyOTP, [verifyOTPSchema], errHandle(verifyOTP)); //for future use
router.post(routes.v1.admin.forgotPassword,[forgotThroughMailSchema],errHandle(forgot_password));
router.post(routes.v1.admin.resetPassword,[resetPasswordSchema,verifyToken(["ADMIN"])],errHandle(resetPassword));
router.post(routes.v1.admin.addProfile, [addAdminSchema], errHandle(addAdmin));
router.get(routes.v1.admin.getProfile,[verifyToken(["ADMIN"]),  verifyAdminRole("staffManagement", "VIEW"), getAdminProfileSchema,],errHandle(getAdminProfile));
router.get(routes.v1.admin.getAdmin, errHandle(getProfile));
router.put(routes.v1.admin.updateProfile,[verifyToken(["ADMIN"]),verifyAdminRole("staffManagement", "EDIT"),updateAdminProfileSchema],errHandle(updateAdminProfile));
router.delete(routes.v1.admin.delete,[ verifyToken(["ADMIN"]),  verifyAdminRole("staffManagement", "DELETE"),deleteAdminProfileSchema,],errHandle(deleteAdmin));
router.get( routes.v1.admin.list,[verifyToken(["ADMIN"]), adminListSchema],errHandle(adminList));

// authorizedPerson related api's
router.post(routes.v1.authorizedPerson.login,[authorizedPersonloginSchema],errHandle(authorizedPersonLogin)); //authorizedPerson login using mobileNumber
router.post(routes.v1.authorizedPerson.verifyOTP,[authorizedPersonVerifyOTPSchema],errHandle(authorizedPersonverifyOTP)); //authorized person verify Otp through mobileNumber or AP ID
router.post(routes.v1.authorizedPerson.sendOTP,[sendOTPSchema],errHandle(authorizedPersonLogin)); //for future use
router.post(routes.v1.authorizedPerson.forgotPasswordverifyOTP, [forgotPasswordVerifyOTPSchema], errHandle(authorizedPersonverifyOTP)); //for furture use
router.post(routes.v1.authorizedPerson.forgotPasswordLoginIdMail,[forgotPasswordLoginIdSchema],errHandle(authorizedPersonMailLoginById)); //AP send id through mail
router.post(routes.v1.authorizedPerson.loginById,[authorizedPersonloginbyIdSchema],errHandle(authorizedPersonLoginById)); //authorized person login via id and password
router.post(routes.v1.authorizedPerson.addProfile, [addAuthorizedPersonSchema],errHandle(addauthorizedPerson));
router.get(routes.v1.authorizedPerson.getProfile,[verifyToken(["AP"]), getAuthorizedPersonProfileSchema],errHandle(getauthorizedPersonProfile));
router.get(routes.v1.authorizedPerson.getProfileById,errHandle(getauthorizedPersonProfile));
router.delete(routes.v1.authorizedPerson.delete,[verifyToken(["AP",,"ADMIN"]), updateAuthorizedPersonProfileSchema],errHandle(deleteauthorizedPerson));
router.put(routes.v1.authorizedPerson.updateProfile,[verifyToken(["AP"]), updateAuthorizedPersonProfileSchema],errHandle(updateauthorizedPersonProfile));
router.get(routes.v1.authorizedPerson.list, [verifyToken(["ADMIN"]), authorizedPersonListSchema],errHandle(authorizedPersonList));

router.post(routes.v1.authorizedPerson.resetPassword,[verifyToken(["AP"]), authorizedPersonResetPasswordSchema],errHandle(authorizedPersonResetPassword));


//client family related api
router.post(routes.v1.clientFamily.addProfile,[verifyToken(["AP", "ADMIN"]), verifyAdminRole("clientFamilyManagement", "ADD"),addClientFamilySchema],errHandle(addClientFamilyPerson));
router.put(routes.v1.clientFamily.updateProfile,[verifyToken(["AP", "ADMIN"]),verifyAdminRole("clientFamilyManagement", "EDIT"),updateClientFamilyProfileSchema],errHandle(updateClientFamilyProfile));
router.get(routes.v1.clientFamily.getProfile,[verifyToken(["AP", "ADMIN"]),verifyAdminRole("clientFamilyManagement", "VIEW"),clientFamilyProfileSchema],errHandle(getClientPersonProfile));
router.get(routes.v1.clientFamily.list,[verifyToken(["AP", "ADMIN"]),verifyAdminRole("clientFamilyManagement", "VIEW"),clientFamilyListSchema],errHandle(clientFamilyList));
router.delete(routes.v1.clientFamily.delete,[verifyToken(["AP", "ADMIN"]),verifyAdminRole("clientFamilyManagement", "DELETE"),clientFamilyProfileSchema],errHandle(deleteClientFamily));


//upload Image
router.post(routes.v1.aws.uploadImage,errHandle(uploadImage));

//get sequence id
router.get(routes.v1.sequence.sequenceId,errHandle(getSequenceId));



module.exports = router;
