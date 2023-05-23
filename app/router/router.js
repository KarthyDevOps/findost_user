const express = require("express");
const Router = express.Router;
var multer = require("multer");
var upload = multer();
const {
  verifyAdminToken,
  verifyauthorizedPersonToken,
} = require("../middlewares/authentication");
const {
  adminloginSchema,
  addAdminSchema,
  getAdminProfileSchema,
  updateAdminProfileSchema,
  adminListSchema,
  authorizedPersonloginSchema,
  getAuthorizedPersonProfileSchema,
  authorizedPersonVerifyOTPSchema,
  authorizedPersonforgotPasswordSchema,
  forgotPasswordVerifyOTPSchema,
  addAuthorizedPersonSchema,
  updateAuthorizedPersonProfileSchema,
  authorizedPersonListSchema,
  sendOTPSchema,
  resetPasswordSchema,
  verifyOTPSchema,
  authorizedPersonloginbyIdSchema,
  addClientFamilySchema ,
  clientFamilyProfileSchema,
  clientFamilyListSchema,  
  updateClientFamilyProfileSchema
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
} = require("../controllers/authorizedPerson.controller");

const  {addClientFamilyPerson, getClientPersonProfile,clientFamilyList,updateClientFamilyProfile,deleteClientFamily} = require("../controllers/clientFamily.controller")
const { errHandle } = require("../helpers/index");
const { routes } = require("../routes/routes");
const router = Router();

//admin related api's
router.post(routes.v1.admin.login, [adminloginSchema], errHandle(adminLogin));
//router.post(routes.v1.admin.logout, [verifyAdminToken], errHandle(adminLogout));
router.post(routes.v1.admin.sendOTP, [sendOTPSchema], errHandle(sendOTP));
router.post(routes.v1.admin.verifyOTP, [verifyOTPSchema], errHandle(verifyOTP));
router.post( routes.v1.admin.resetPassword, [resetPasswordSchema], errHandle(resetPassword));
router.post(routes.v1.admin.addProfile, [addAdminSchema], errHandle(addAdmin));
router.get( routes.v1.admin.getProfile,[verifyAdminToken, getAdminProfileSchema],errHandle(getAdminProfile));
router.get(routes.v1.admin.getAdmin, errHandle(getProfile));
router.put(routes.v1.admin.updateProfile,[verifyAdminToken, updateAdminProfileSchema],errHandle(updateAdminProfile));
router.delete(routes.v1.admin.delete, [verifyAdminToken, getAdminProfileSchema],errHandle(deleteAdmin));
router.get(routes.v1.admin.list,[verifyAdminToken, adminListSchema],errHandle(adminList));

// authorizedPerson related api's
router.post(routes.v1.authorizedPerson.login,[authorizedPersonloginSchema],errHandle(authorizedPersonLogin)); //authorizedPerson login using mobileNumber
router.post(routes.v1.authorizedPerson.verifyOTP, [authorizedPersonVerifyOTPSchema], errHandle(authorizedPersonverifyOTP)); //authorized person verify Otp through mobileNumber
router.post( routes.v1.authorizedPerson.sendOTP,[sendOTPSchema], errHandle(authorizedPersonLogin)); //authorized person send Otp through authorizedPersonID
router.post(routes.v1.authorizedPerson.forgotPasswordverifyOTP,[forgotPasswordVerifyOTPSchema],errHandle(authorizedPersonverifyOTP)); //authorized person verify Otp through authorizedPersonID
router.post(routes.v1.authorizedPerson.loginById,[authorizedPersonloginbyIdSchema],errHandle(authorizedPersonLoginById)); //authorized person login via id and password
router.post(routes.v1.authorizedPerson.addProfile, [addAuthorizedPersonSchema], errHandle(addauthorizedPerson));
router.get( routes.v1.authorizedPerson.getProfile,[verifyauthorizedPersonToken, getAuthorizedPersonProfileSchema], errHandle(getauthorizedPersonProfile));
router.delete( routes.v1.authorizedPerson.delete,[verifyauthorizedPersonToken, updateAuthorizedPersonProfileSchema], errHandle(deleteauthorizedPerson));
router.put(routes.v1.authorizedPerson.updateProfile,[verifyauthorizedPersonToken, updateAuthorizedPersonProfileSchema],errHandle(updateauthorizedPersonProfile));
router.get(routes.v1.authorizedPerson.list,[verifyAdminToken, authorizedPersonListSchema],errHandle(authorizedPersonList));


//client family related api
router.post(routes.v1.clientFamily.addProfile,[verifyauthorizedPersonToken,addClientFamilySchema],addClientFamilyPerson)
router.put(routes.v1.clientFamily.updateProfile,[updateClientFamilyProfileSchema],updateClientFamilyProfile)
 router.get(routes.v1.clientFamily.getProfile,[clientFamilyProfileSchema],getClientPersonProfile)
 router.get(routes.v1.clientFamily.list,[clientFamilyListSchema],clientFamilyList)
  router.delete(routes.v1.clientFamily.delete,[clientFamilyProfileSchema],deleteClientFamily)

module.exports = router;
