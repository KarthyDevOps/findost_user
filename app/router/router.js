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
  addClientFamilySchema,
  clientFamilyProfileSchema,
  clientFamilyListSchema,
  updateClientFamilyProfileSchema,
  forgotPasswordLoginIdSchema,
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
//router.post(routes.v1.admin.logout, [verifyToken(["ADMIN"])], errHandle(adminLogout));
router.post(routes.v1.admin.sendOTP, [sendOTPSchema], errHandle(sendOTP));
router.post(routes.v1.admin.verifyOTP, [verifyOTPSchema], errHandle(verifyOTP));
router.post(
  routes.v1.admin.forgotPassword,
  [resetPasswordSchema],
  errHandle(forgot_password)
);
router.post(
  routes.v1.admin.resetPassword,
  [verifyToken(["ADMIN"])],
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
    getAdminProfileSchema,
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
); //authorized person verify Otp through mobileNumber
router.post(
  routes.v1.authorizedPerson.sendOTP,
  [sendOTPSchema],
  errHandle(authorizedPersonLogin)
); //authorized person send Otp through authorizedPersonID
router.post(
  routes.v1.authorizedPerson.forgotPasswordverifyOTP,
  [forgotPasswordVerifyOTPSchema],
  errHandle(authorizedPersonverifyOTP)
); //authorized person verify Otp through authorizedPersonID
router.post(
  routes.v1.authorizedPerson.forgotPasswordLoginIdMail,
  [forgotPasswordLoginIdSchema],
  errHandle(authorizedPersonMailLoginById)
); //authorized person verify Otp through authorizedPersonID
router.post(
  routes.v1.authorizedPerson.loginById,
  [authorizedPersonloginbyIdSchema],
  errHandle(authorizedPersonLoginById)
); //authorized person login via id and password
router.post(
  routes.v1.authorizedPerson.addProfile,
  [addAuthorizedPersonSchema],
  errHandle(addauthorizedPerson)
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
  [verifyToken(["AP"]), updateAuthorizedPersonProfileSchema],
  errHandle(deleteauthorizedPerson)
);
router.put(
  routes.v1.authorizedPerson.updateProfile,
  [verifyToken(["AP"]), updateAuthorizedPersonProfileSchema],
  errHandle(updateauthorizedPersonProfile)
);
router.get(
  routes.v1.authorizedPerson.list,
  [verifyToken(["ADMIN"]), authorizedPersonListSchema],
  errHandle(authorizedPersonList)
);
//client family related api
router.post(
  routes.v1.clientFamily.addProfile,
  [verifyToken(["AP"]), addClientFamilySchema],
  errHandle(addClientFamilyPerson)
);
router.put(
  routes.v1.clientFamily.updateProfile,
  [updateClientFamilyProfileSchema],
  errHandle(updateClientFamilyProfile)
);
router.get(
  routes.v1.clientFamily.getProfile,
  [clientFamilyProfileSchema],
  errHandle(getClientPersonProfile)
);
router.get(
  routes.v1.clientFamily.list,
  [clientFamilyListSchema],
  errHandle(clientFamilyList)
);
router.delete(
  routes.v1.clientFamily.delete,
  [clientFamilyProfileSchema],
  errHandle(deleteClientFamily)
);
//client admin family related api
router.post(
  routes.v1.clientAdminFamily.addProfile,
  [verifyToken(["AP"]), addClientFamilySchema],
  errHandle(addClientFamilyPerson)
);
router.put(
  routes.v1.clientAdminFamily.updateProfile,
  [updateClientFamilyProfileSchema],
  errHandle(updateClientFamilyProfile)
);
router.get(
  routes.v1.clientAdminFamily.getProfile,
  [clientFamilyProfileSchema],
  errHandle(getClientPersonProfile)
);
router.get(
  routes.v1.clientAdminFamily.list,
  [clientFamilyListSchema],
  errHandle(clientFamilyList)
);
router.delete(
  routes.v1.clientAdminFamily.delete,
  [clientFamilyProfileSchema],
  errHandle(deleteClientFamily)
);
module.exports = router;
