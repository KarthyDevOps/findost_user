const routes = {
  v1: {
    admin: {
      login: "/v1/admin/login",
      addProfile: "/v1/admin/addProfile",
      getProfile: "/v1/admin/getProfile",
      getAdmin: "/v1/admin/getAdmin",
      updateProfile: "/v1/admin/updateProfile",
      delete: "/v1/admin/delete",
      list: "/v1/admin/list",
      logout: "/v1/admin/logout",
      sendOTP: "/v1/admin/sendOTP",
      verifyOTP: "/v1/admin/verifyOTP",
      forgotPassword: "/v1/admin/forgotPassword",
      resetPassword: "/v1/admin/resetPassword",
    },
    authorizedPerson: {
      login: "/v1/authorizedPerson/login",
      loginById: "/v1/authorizedPerson/loginbyId",
      sendOTP: "/v1/authorizedPerson/sendOtp",
      verifyOTP: "/v1/authorizedPerson/verifyOTP",
      resetPassword: "/v1/authorizedPerson/resetPassword",
      forgotPasswordverifyOTP: "/v1/authorizedPerson/forgotPassword/verifyOTP",
      forgotPasswordLoginIdMail: "/v1/authorizedPerson/forgotPassword/loginIdByMail",
      addProfile: "/v1/authorizedPerson/addProfile",
      getProfile: "/v1/authorizedPerson/getProfile",
      getProfileById: "/v1/authorizedPerson/getProfileById",
      updateProfile: "/v1/authorizedPerson/updateProfile",
      delete: "/v1/authorizedPerson/delete",
      list: "/v1/authorizedPerson/list",
      logout: "/v1/authorizedPerson/logout",
      export: "/v1/authorizedPerson/export",
    },
    clientFamily: {
      addProfile: "/v1/clientFamily/addProfile",
      getProfile: "/v1/clientFamily/getProfile",
      updateProfile: "/v1/clientFamily/updateProfile",
      delete: "/v1/clientFamily/delete",
      list: "/v1/clientFamily/list",
      export: "/v1/clientFamily/export",
    },
    clientAdminFamily: {
      addProfile: "/v1/admin/clientFamily/addProfile",
      getProfile: "/v1/admin/clientFamily/getProfile",
      updateProfile: "/v1/admin/clientFamily/updateProfile",
      delete: "/v1/admin/clientFamily/delete",
      list: "/v1/admin/clientFamily/list",
      export: "/v1/admin/clientFamily/export",
    },

    aws: {
      uploadImage: "/v1/upload/image",
    },
    sequence: {
      sequenceId: "/v1/get/sequenceId",
    },
    razorPay: {
      orderCreate: "/v1/razorPay/orderCreate",     
      paymentverify : "/v1/razorPay/paymentverify",
      checkPaymentStatus : "/v1/razorPay/checkPaymentStatus",
      
    },
  },
};

module.exports = { routes };
