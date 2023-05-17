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
      resetPassword: "/v1/admin/resetPassword",
    },
    authorizedPerson: {
      login: "/v1/authorizedPerson/login",
      loginById: "/v1/authorizedPerson/loginbyId",
      sendOTP: "/v1/authorizedPerson/sendOtp",
      verifyOTP: "/v1/authorizedPerson/verifyOTP",
      forgotPasswordverifyOTP: "/v1/authorizedPerson/forgotPassword/verifyOTP",
      addProfile: "/v1/authorizedPerson/addProfile",
      getProfile: "/v1/authorizedPerson/getProfile",
      updateProfile: "/v1/authorizedPerson/updateProfile",
      delete: "/v1/authorizedPerson/delete",
      list: "/v1/authorizedPerson/list",
      logout: "/v1/authorizedPerson/logout",

      export: "/v1/authorizedPerson/export",
    },

    aws: {
      uploadImage: "/v1/upload/image",
    },
  },
};

module.exports = { routes };
