const express = require("express");
const process = require("process");
const dotenv = require("dotenv");
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

//load environment variable
dotenv.config({ path: path.join(process.cwd(), `${process.argv[2]}`) });
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

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
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Connected to MongoDB Sucessfully!!");
};

connectToMongo();
//initiative aws s3 bucket
instantiateAWSS3();

const port = process.env.PORT;

app.use("/api", routerService);

app.listen(port, () => {
  console.log(
    `Microservice ${process.env.SERVICE_NAME} is running on port ${port}.`
  );
});

app.get("/", (req, res) => {
  res.send("successfully connnected");
});

app.use(errHandle);
