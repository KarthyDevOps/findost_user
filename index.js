const express = require("express");
const expressFileUpload = require("express-fileupload");
var { createTunnel } = require("tunnel-ssh");

const process = require("process");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const routerService = require("./app/router/router");
const { errHandle } = require("./app/middlewares/errorHandler");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./app/swagger/swagger.json");
const app = express();
const { instantiateAWSS3 } = require("./app/externalServices/awsService.js");

//swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Load environment variable
require("dotenv").config({ path: path.join(process.cwd(), `.env`) });
const args = process.argv.slice(2)[0];
process.env.CONFIG_ARG = args;
let CONFIG = require("./app/configs/config")(args);
process.env = { ...process.env, ...CONFIG };

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});
//File Uploading middleware
app.use(
  expressFileUpload({
    safeFileNames: true,
    limits: { fileSize: 30 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
//app.use("/api-docs",swaggerUi.serve,swaggerUi.setup(swaggerDocument));

app.use(express.static(__dirname + "/assets"));

var numOfRequest = 1;

app.use((req, res, next) => {
  req.startTime = Date.now();
  req.numOfRequest = numOfRequest;
  numOfRequest++;
  console.log("Hit :" + req.originalUrl);
  next();
});


 
  //DB connection
  const connectToMongo = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB Sucessfully!!");
  };

  connectToMongo();

  // await mongoose.connect(process.env.MONGO_URI);
  // console.log("Connected to MongoDB Sucessfully!!");


connectToMongo();
//initiative aws s3 bucket
instantiateAWSS3();

const port = process.env.PORT;

app.use("/user/api", routerService);

app.listen(port, () => {
  console.log(
    `Microservice ${process.env.SERVICE_NAME} is running on port ${port}.`
  );
});

app.get("/", (req, res) => {
  res.send("successfully connnected  - findoc - USER");
});

app.use(errHandle);
