let { InternalAPIs } = require("../configs");
let { Rest } = require("../restCalls");

class InternalServices {}

InternalServices.sendEmail = async (data) => {
  try {
    console.log("The following is the data", data);
    let urlPayload = JSON.parse(JSON.stringify(InternalAPIs.sendEmail));
    urlPayload.data = data;
    let response = await Rest.callApi(urlPayload);
    console.log("The following is the response", response);
    return response.data;
  } catch (err) {
    console.log(">>>>>>", err);
    throw new Error(err);
  }
};

InternalServices.forgetEmail = async (data) => {
  try {
    console.log("The following is the data", data);
    let urlPayload = JSON.parse(JSON.stringify(InternalAPIs.forgetEmail));
    urlPayload.data = data;
    let response = await Rest.callApi(urlPayload);
    console.log("The following is the response", response);
    return response.data;
  } catch (err) {
    console.log(">>>>>>", err);
    throw new Error(err);
  }
};
module.exports = InternalServices;
