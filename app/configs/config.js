module.exports = function (env) {
  const DEV_CONSTANTS = {
    PORT: 2277,
    MONGO_URI: "mongodb+srv://findoc_user:nQKMemhPm0N4maIJ@cluster0.kr4lh0f.mongodb.net/findoc_users",
    NODE_ENV: "development",
    SERVICE_NAME: "Findost-USER-Service",
    200: "success",
    JWT_ADMIN_SECRET: "1234_admin_findost",
    JWT_authorizedPerson_SECRET: "1234_authorizedPerson_findost",
    TOKEN_EXPIRATION: "72h",
    COMMUNICATION:"http://doodlebluelive.com:2275",
    FE_URL: "http://doodlebluelive.com:2273/auth/resetpassword?token=",
    gupshup_api_key: "FINDOSTki1oide65rpq9y5ysufrndmukhdaeqpn",
    AWS_BUCKET: "findoc-development",
    AWS_ACCESS_KEY: "AKIARS5OYL26JGKUYGRR",
    AWS_SECRET_KEY: "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",
    S3_IMAGES_PATH: "images",
    S3_DOCUMENTS_PATH: "documents",
    S3_MEDIA_PATH: "media",
    S3_REGION: "ap-south-1",
    AWS_S3_HOST:"https://findost-project-development.s3.ap-south-1.amazonaws.com",
    USER_URL: "http://doodlebluelive.com:2277",
    COMMUNICATION_URL: "http://doodlebluelive.com:2275",
    CMS_URL: "http://doodlebluelive.com:2274",
    FINANCE_URL: "http://doodlebluelive.com:2276",
    RAZORPAY_KEY_ID: "rzp_test_ZyARZmZbxZsgjs",
    RAZORPAY_KEY_SECRET: "yKP2tFDv2FmLmH1kh2XrJeKF",
    AP_REGISTER_DISCOUNT_COUPON: "ABCDEFG",
    AP_REGISTER_DISCOUNT_COUPON_PERCENTAGE: 20,
  };

  const LOCAL_CONSTANTS = {
    PORT: 2277,
    MONGO_URI: "mongodb+srv://findoc_user:nQKMemhPm0N4maIJ@cluster0.kr4lh0f.mongodb.net/findoc_users",
    NODE_ENV: "development",
    SERVICE_NAME: "Findost-USER-Service",
    200: "success",
    JWT_ADMIN_SECRET: "1234_admin_findost",
    JWT_authorizedPerson_SECRET: "1234_authorizedPerson_findost",
    TOKEN_EXPIRATION: "72h",
    COMMUNICATION:
      "http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com:2275",
    FE_URL: "http://doodlebluelive.com:2273/auth/resetpassword?token=",
    gupshup_api_key: "FINDOSTki1oide65rpq9y5ysufrndmukhdaeqpn",
    AWS_BUCKET: "findoc-development",
    AWS_ACCESS_KEY: "AKIARS5OYL26JGKUYGRR",
    AWS_SECRET_KEY: "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",
    S3_IMAGES_PATH: "images",
    S3_DOCUMENTS_PATH: "documents",
    S3_MEDIA_PATH: "media",
    S3_REGION: "ap-south-1",
    AWS_S3_HOST: "https://findost-project-development.s3.ap-south-1.amazonaws.com",
    USER_URL: "http://doodlebluelive.com:2277",
    COMMUNICATION_URL: "http://doodlebluelive.com:2275",
    CMS_URL: "http://doodlebluelive.com:2274",
    FINANCE_URL: "http://doodlebluelive.com:2276",
    RAZORPAY_KEY_ID: "rzp_test_ZyARZmZbxZsgjs",
    RAZORPAY_KEY_SECRET: "yKP2tFDv2FmLmH1kh2XrJeKF",
    AP_REGISTER_DISCOUNT_COUPON: "ABCDEFG",
    AP_REGISTER_DISCOUNT_COUPON_PERCENTAGE: 20,
  };

  const STAGE_CONSTANTS = {
    PORT: 2277,
    MONGO_URI:"mongodb://Developer:Dev$1234@findoc-preprod-docdb-2024-01-17-13-34-25.cluster-chi2e68wccik.ap-south-1.docdb.amazonaws.com:27017/findoc_user",
    NODE_ENV: "development",
    SERVICE_NAME: "Findost-USER-Service",
    200: "success",
    JWT_ADMIN_SECRET: "1234_admin_findost",
    JWT_authorizedPerson_SECRET: "1234_authorizedPerson_findost",
    TOKEN_EXPIRATION: "72h",
    COMMUNICATION:"http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com:2275",
    FE_URL:"http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com/auth/resetpassword?token=",
    gupshup_api_key: "FINDOSTki1oide65rpq9y5ysufrndmukhdaeqpn",
    AWS_BUCKET: "findoc-development",
    AWS_ACCESS_KEY: "AKIARS5OYL26JGKUYGRR",
    AWS_SECRET_KEY: "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",
    S3_IMAGES_PATH: "images",
    S3_DOCUMENTS_PATH: "documents",
    S3_MEDIA_PATH: "media",
    S3_REGION: "ap-south-1",
    AWS_S3_HOST:"https://findost-project-development.s3.ap-south-1.amazonaws.com",
    USER_URL: "http://doodlebluelive.com:2277",
    COMMUNICATION_URL: "http://doodlebluelive.com:2275",
    CMS_URL: "http://doodlebluelive.com:2274",
    FINANCE_URL: "http://doodlebluelive.com:2276",
    RAZORPAY_KEY_ID: "rzp_test_ZyARZmZbxZsgjs",
    RAZORPAY_KEY_SECRET: "yKP2tFDv2FmLmH1kh2XrJeKF",
    AP_REGISTER_DISCOUNT_COUPON: "ABCDEFG",
    AP_REGISTER_DISCOUNT_COUPON_PERCENTAGE: 20,
  };

  const PREPROD_CONSTANTS = {
    PORT: 2277,
    MONGO_URI:"mongodb://devops:Dev$1234@findoc-preprod-docdb-2024-01-17-13-34-25.cluster-chi2e68wccik.ap-south-1.docdb.amazonaws.com:27017/findoc_user?authMechanism=DEFAULT&tls=true&authSource=findoc_user&retryWrites=False",
    NODE_ENV: "PREPRODUCTION",
    SERVICE_NAME: "Findost-USER-Service",
    200: "success",
    JWT_ADMIN_SECRET: "1234_admin_findost",
    JWT_authorizedPerson_SECRET: "1234_authorizedPerson_findost",
    TOKEN_EXPIRATION: "72h",
    COMMUNICATION: "https://communication.findoc.com",
    FE_URL: "https://findost.findoc.com/auth/resetpassword?token=",
    gupshup_api_key: "FINDOSTki1oide65rpq9y5ysufrndmukhdaeqpn",
    AWS_BUCKET: "findost-bucket",
    AWS_ACCESS_KEY: "AKIA5O2OIHBJ2AZ6TOMP",
    AWS_SECRET_KEY: "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",
    S3_IMAGES_PATH: "images",
    S3_DOCUMENTS_PATH: "documents",
    S3_MEDIA_PATH: "media",
    S3_REGION: "ap-south-1",
    AWS_S3_HOST: "https://findost-project-development.s3.ap- south-1.amazonaws.com",
    USER_URL: "https://user.findoc.com",
    COMMUNICATION_URL: "https://communication.findoc.com",
    CMS_URL: "https://cms.findoc.com",
    FINANCE_URL: "https://finance.findoc.com",
    RAZORPAY_KEY_ID: "rzp_test_ZyARZmZbxZsgjs",
    RAZORPAY_KEY_SECRET: "yKP2tFDv2FmLmH1kh2XrJeKF",
    AP_REGISTER_DISCOUNT_COUPON: "ABCDEFG",
    AP_REGISTER_DISCOUNT_COUPON_PERCENTAGE: 20,
  };

  const PROD_CONSTANTS = {
    PORT: 2277,
    MONGO_URI:
      "mongodb://Developer:Dev$1234@findoc-preprod-docdb-2024-01-17-13-34-25.cluster-chi2e68wccik.ap-south-1.docdb.amazonaws.com:27017/findoc_user",
    NODE_ENV: "PRODUCTION",
    SERVICE_NAME: "Findost-USER-Service",
    200: "success",
    JWT_ADMIN_SECRET: "1234_admin_findost",
    JWT_authorizedPerson_SECRET: "1234_authorizedPerson_findost",
    TOKEN_EXPIRATION: "24h",
    COMMUNICATION:
      "http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com:2275",
    FE_URL:
      "http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com/auth/resetpassword?token=",
    gupshup_api_key: "FINDOSTki1oide65rpq9y5ysufrndmukhdaeqpn",
    AWS_BUCKET: "findoc-development",
    AWS_ACCESS_KEY: "AKIARS5OYL26JGKUYGRR",
    AWS_SECRET_KEY: "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",
    S3_IMAGES_PATH: "images",
    S3_DOCUMENTS_PATH: "documents",
    S3_MEDIA_PATH: "media",
    S3_REGION: "ap-south-1",
    AWS_S3_HOST:
      "https://findost-project-development.s3.ap-south-1.amazonaws.com",
    USER_URL:
      "http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com:2277",
    COMMUNICATION_URL:
      "http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com:2275",
    CMS_URL:
      "http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com:2274",
    FINANCE_URL:
      "http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com:2276",
    RAZORPAY_KEY_ID: "rzp_test_ZyARZmZbxZsgjs",
    RAZORPAY_KEY_SECRET: "yKP2tFDv2FmLmH1kh2XrJeKF",
    AP_REGISTER_DISCOUNT_COUPON: "ABCDEFG",
    AP_REGISTER_DISCOUNT_COUPON_PERCENTAGE: 20,
  };

  let envType;

  switch (env) {
    case "DEV":
      envType = DEV_CONSTANTS;
      break;

    case "LOCAL":
      envType = LOCAL_CONSTANTS;
      break;

    case "STAGE":
      envType = STAGE_CONSTANTS;
      break;

    case "PREPROD":
      envType = PREPROD_CONSTANTS;
      break;

    case "PROD":
      envType = PROD_CONSTANTS;
      break;

    default:
      envType = { NA: "NA" };
      break;
  }

  return envType;
};
