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

      loginCount: "/v1/admin/loginCount",
      loginActivityReport: "/v1/admin/loginActivityReport",
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
      validateNomineeAge: "/v1/authorizedPerson/validateNomineeAge",
      getProfile: "/v1/authorizedPerson/getProfile",
      getProfileById: "/v1/authorizedPerson/getProfileById",
      updateProfile: "/v1/authorizedPerson/updateProfile",
      delete: "/v1/authorizedPerson/delete",
      list: "/v1/authorizedPerson/list",
      logout: "/v1/authorizedPerson/logout",
      export: "/v1/authorizedPerson/export",
      validateCoupon  : "/v1/authorizedPerson/validateCoupon"
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
      getImageBlob: "/v1/image/getBlob",
    },
    sequence: {
      sequenceId: "/v1/get/sequenceId",
    },
    razorPay: {
      orderCreate: "/v1/razorPay/orderCreate",     
      paymentverify : "/v1/razorPay/paymentverify",
      checkPaymentStatus : "/v1/razorPay/checkPaymentStatus",
      
    },
    segment: {
      addSegment: "/v1/segment/addSegment",
      getSegment: "/v1/segment/getSegment",
      updateSegment: "/v1/segment/updateSegment",
      delete: "/v1/segment/deleteSegment",
      list: "/v1/segment/list",
    },
    registerSetting: {
      add: "/v1/registerSetting/add",
      get: "/v1/registerSetting/get",
      update: "/v1/registerSetting/update",
      delete: "/v1/registerSetting/delete",
      list: "/v1/registerSetting/list",
    },
    BOUSERS: {
      add: "/v1/BOUSERS/add",
      get: "/v1/BOUSERS/get",
      update: "/v1/BOUSERS/update",
      delete: "/v1/BOUSERS/delete",
      list: "/v1/BOUSERS/list",
    },
  },
};

module.exports = { routes };
