const routes = {
  v1: {
    admin: {
      login: "/v1/admin/login",
      addProfile: "/v1/admin/addProfile",
      getProfile: "/v1/admin/getProfile",
      updateProfile: "/v1/admin/updateProfile",
      delete: "/v1/admin/delete",
      list: "/v1/admin/list",
      logout: "/v1/admin/logout",
      sendOTP: "/v1/admin/sendOTP",
      verifyOTP: "/v1/admin/verifyOTP",
      resetPassword: "/v1/admin/resetPassword",
    },
    customers: {
      login: "/v1/customer/login",
      loginById: "/v1/customer/loginbyId",
      verifyOTP: "/v1/customer/verifyOTP",
      addProfile: "/v1/customer/addProfile",
      getProfile: "/v1/customer/getProfile",
      updateProfile: "/v1/customer/updateProfile",
      delete: "/v1/customer/delete",
      list: "/v1/customer/list",
      logout: "/v1/customer/logout",

      export: "/v1/customer/export",
    },

    aws: {
      uploadImage: "/v1/upload/image",
    },
  },
};

module.exports = { routes };
