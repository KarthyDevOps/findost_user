let { InternalAPIs } = require("../configs");
let { Rest } = require("../restCalls");

const sendEmail = async (data) => {
  try {
    console.log("The following is the data", data);
    let urlPayload = JSON.parse(JSON.stringify(InternalAPIs.sendEmail));
    console.log('urlPayload', urlPayload)
    urlPayload.data = data;
    let response = await Rest.callApi(urlPayload);
    console.log("The following is the response", response);
    return response.data;
  } catch (err) {
    console.log(">>>>>>", err);
    throw new Error(err);
  }
};

const forgetEmail = async (data) => {
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
module.exports = {
  sendEmail,
  forgetEmail

};
