const express = require("express");
const Router = express.Router;
var multer = require("multer");
var upload = multer();
const {
  verifyAdminToken,
  verifyCustomerToken,
} = require("../middlewares/authentication");
const {
  adminloginSchema,
  customersloginSchema,
  updateCustomerProfileSchema,
  customersVerifyOTPSchema,
  customersforgotPasswordSchema,
  forgotPasswordVerifyOTPSchema,
  addCustomerSchema,
  getCustomerProfileSchema,
  customerListSchema,
  addAdminSchema,
  getAdminProfileSchema,
  updateAdminProfileSchema,
  adminListSchema,
  sendOTPSchema,
  resetPasswordSchema,
  verifyOTPSchema,
  customersloginbyIdSchema,
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
  customerLogin,
  customerverifyOTP,
  addCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  customerList,
  deleteCustomer,
  customerLoginById,
} = require("../controllers/customer.controller");
const { errHandle } = require("../helpers/index");
const { routes } = require("../routes/routes");
const router = Router();

//admin related api's
router.post(routes.v1.admin.login, [adminloginSchema], errHandle(adminLogin));
//router.post(routes.v1.admin.logout, [verifyAdminToken], errHandle(adminLogout));
router.post(routes.v1.admin.sendOTP, [sendOTPSchema], errHandle(sendOTP));
router.post(routes.v1.admin.verifyOTP, [verifyOTPSchema], errHandle(verifyOTP));
router.post(routes.v1.admin.resetPassword,[resetPasswordSchema], errHandle(resetPassword));
router.post(routes.v1.admin.addProfile, [addAdminSchema], errHandle(addAdmin));
router.get(routes.v1.admin.getProfile,[verifyAdminToken, getAdminProfileSchema],  errHandle(getAdminProfile));
router.get(routes.v1.admin.getAdmin,errHandle(getProfile));
router.put(routes.v1.admin.updateProfile,[verifyAdminToken, updateAdminProfileSchema],errHandle(updateAdminProfile));
router.delete(routes.v1.admin.delete,[verifyAdminToken, getAdminProfileSchema], errHandle(deleteAdmin));
router.get(routes.v1.admin.list,[verifyAdminToken, adminListSchema],errHandle(adminList));

// authorizedPerson related api's
router.post(routes.v1.customers.login,[customersloginSchema],errHandle(customerLogin)); //authorizedPerson login using mobileNumber
router.post(routes.v1.customers.verifyOTP,[customersVerifyOTPSchema],errHandle(customerverifyOTP));//authorized person verify Otp through mobileNumber
router.post(routes.v1.customers.sendOTP,[customersforgotPasswordSchema], errHandle(customerLogin)); //authorized person send Otp through customerID
router.post(routes.v1.customers.forgotPasswordverifyOTP,[forgotPasswordVerifyOTPSchema],errHandle(customerverifyOTP)); //authorized person verify Otp through customerID
router.post(routes.v1.customers.loginById,[customersloginbyIdSchema], errHandle(customerLoginById));//authorized person login via id and password
router.post(routes.v1.customers.addProfile,[addCustomerSchema], errHandle(addCustomer));
router.get(routes.v1.customers.getProfile,  [verifyCustomerToken, getCustomerProfileSchema],errHandle(getCustomerProfile));
router.put(routes.v1.customers.updateProfile,[verifyCustomerToken, updateCustomerProfileSchema],errHandle(updateCustomerProfile));
router.delete(routes.v1.customers.delete,[verifyCustomerToken, getCustomerProfileSchema], errHandle(deleteCustomer));
router.get( routes.v1.customers.list, [verifyAdminToken, customerListSchema],errHandle(customerList));

module.exports = router;
