module.exports = function (env) {
  const DEV_CONSTANTS = {
    PORT: 2274,
    MONGO_URI: "mongodb+srv://findoc_user:nQKMemhPm0N4maIJ@cluster0.kr4lh0f.mongodb.net/findoc_users",
    NODE_ENV: "development",
    SERVICE_NAME : "Findost-CMS-Service",
    USER_URL : "http://doodlebluelive.com:2811",
    200: "success"
  };

  const LOCAL_CONSTANTS = {
    PORT: 2274,
    MONGO_URI: "mongodb+srv://findoc_user:nQKMemhPm0N4maIJ@cluster0.kr4lh0f.mongodb.net/findoc_users",
    NODE_ENV: "development",
    SERVICE_NAME : "Findost-CMS-Service",
    USER_URL : "http://doodlebluelive.com:2811",
    200: "success"
  };

  const PROD_CONSTANTS = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    NODE_ENV: process.env.NODE_ENV,
    SERVICE_NAME :  process.env.SERVICE_NAME,
    USER_URL : process.env.USER_URL,
    200: "success"
  };
  let envType;

  switch(env){
      
    case "DEV": envType = DEV_CONSTANTS;
                break;

    case "LOCAL": envType = LOCAL_CONSTANTS;
                break;
    
    case "PROD": envType = PROD_CONSTANTS;
                break;
                
    default   : envType = {NA: "NA"};
                break;
  }

  return envType;
};
