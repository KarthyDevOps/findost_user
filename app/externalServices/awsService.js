const AWS = require("aws-sdk");
const moment = require("moment");
const randomstring = require("randomstring");
let AWS_S3 = new AWS.S3({});

/**
 * AWS Service class
 */
const instantiateAWSS3 = async () => {
  /* AWS Access credentials*/
  const awsCredentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
  };

  // Update the AWS config
  AWS.config.update(awsCredentials);

  // Intialize the AWS s3
  AWS_S3 = new AWS.S3({});
  //return s3;
};

const putObjectToS3 = async (imageFile, filePath) => {
  // No need of await Uploading to AWS S3

  const params = {
    Bucket: process.env.AWS_BUCKET,
    Key: filePath,
    Body: imageFile.buffer,
    ACL: "public-read",
  };

  const putObjectPromise = AWS_S3.putObject(params).promise();

  return putObjectPromise
    .then(function (s3BucketData) {
      return {
        status: true,
        data: {
          url: `${process.env.AWS_S3_HOST}/${filePath}`,
        },
      };
    })
    .catch(function (err) {
      console.log("AWs Error", err);
      return {
        status: false,
        data: err,
      };
    });
};

const generateRandomNumber = () => {
  return Math.floor(Math.random() * 90000) + 10000;
};

const getRandomUniqueId = (req) => {
  console.log(
    "@Service globalFunction @Method getRandomUniqueId @Message input"
  );

  let randomStr = randomstring.generate({
    length: 4,
    charset: "alphabetic",
    capitalization: "uppercase",
  });
  let momentValue = moment().utc().format("x");

  let uniqueId = `${randomStr}-${momentValue}`;
  return uniqueId;
};
module.exports = {
  instantiateAWSS3,
  putObjectToS3,
  generateRandomNumber,
  getRandomUniqueId,
};
