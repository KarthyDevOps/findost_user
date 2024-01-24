module.exports = function (env) {
  const DEV_CONSTANTS = {
    PORT: 2277,
    MONGO_URI:
      "mongodb+srv://findoc_user:nQKMemhPm0N4maIJ@cluster0.kr4lh0f.mongodb.net/findoc_users",
    NODE_ENV: "development",
    SERVICE_NAME: "Findost-USER-Service",
    USER_URL: "http://doodlebluelive.com:2811",
    200: "success",
    USER_URL: process.env.USER_URL,
    COMMUNICATION_URL: process.env.COMMUNICATION_URL,
    CMS_URL: process.env.CMS_URL,
    FINANCE_URL: process.env.FINANCE_URL,
  };

  const LOCAL_CONSTANTS = {
    PORT: 2277,
    MONGO_URI:
      "mongodb+srv://findoc_user:nQKMemhPm0N4maIJ@cluster0.kr4lh0f.mongodb.net/findoc_users",
    NODE_ENV: "development",
    SERVICE_NAME: "Findost-USER-Service",
    USER_URL: "http://doodlebluelive.com:2811",
    200: "success",
    USER_URL: process.env.USER_URL,
    COMMUNICATION_URL: process.env.COMMUNICATION_URL,
    CMS_URL: process.env.CMS_URL,
    FINANCE_URL: process.env.FINANCE_URL,
  };

  const PREPROD_CONSTANTS = {
    PORT: 2277,
    MONGO_URI:"mongodb://Developer:Dev$1234@findoc-preprod-docdb-2024-01-17-13-34-25.cluster-chi2e68wccik.ap-south-1.docdb.amazonaws.com:27017/findoc_users",
    NODE_ENV: "development",
    SERVICE_NAME: "Findost-USER-Service",
    200: "success",
    JWT_ADMIN_SECRET:"1234_admin_findost",
    JWT_authorizedPerson_SECRET:"1234_authorizedPerson_findost", 
    TOKEN_EXPIRATION : "24h",
    COMMUNICATION:"http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com:2275",
    FE_URL:"http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com/auth/resetpassword?token=",
    gupshup_api_key : "FINDOSTki1oide65rpq9y5ysufrndmukhdaeqpn",   
    AWS_BUCKET : "findoc-development",
    AWS_ACCESS_KEY : "AKIARS5OYL26JGKUYGRR",
    AWS_SECRET_KEY : "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",
    S3_IMAGES_PATH : "images",
    S3_DOCUMENTS_PATH : "documents",
    S3_MEDIA_PATH: "media",  
    S3_REGION : "ap-south-1",   
    AWS_S3_HOST : "https://findost-project-development.s3.ap-south-1.amazonaws.com",
    USER_URL : "http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com:2277",
    COMMUNICATION_URL : "http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com:2275",
    CMS_URL : "http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com:2274",
    FINANCE_URL : "http://preprod-findost-1423761427.ap-south-1.elb.amazonaws.com:2276",
    RAZORPAY_KEY_ID : "rzp_test_ZyARZmZbxZsgjs",
    RAZORPAY_KEY_SECRET : "yKP2tFDv2FmLmH1kh2XrJeKF", 
    AP_REGISTER_DISCOUNT_COUPON : "ABCDEFG",
    AP_REGISTER_DISCOUNT_COUPON_PERCENTAGE : 20,
  };


  const PROD_CONSTANTS = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    SERVICE_NAME: process.env.SERVICE_NAME,
    USER_URL: process.env.USER_URL,
    200: "success",
  };
  let envType;

  switch (env) {
    case "DEV":
      envType = DEV_CONSTANTS;
      break;

    case "LOCAL":
      envType = LOCAL_CONSTANTS;
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
