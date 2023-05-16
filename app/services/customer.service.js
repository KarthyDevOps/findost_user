const {
    convert_JSON_to_file,
    getCustomerDetailsByEmail_or_MobileNumber,
    getCustomerDetailsById,
    getCustomerList,
    pageMetaService,
    sendOTP_to_mobileNumber,

    customerbyId,
  } = require("../helpers");
  const { Customers } = require("../models/customers");
  const { messages } = require("../response/customMessages");
  const { statusCodes } = require("../response/httpStatusCodes");
  const bcrypt = require("bcryptjs");
  const { statusMessage } = require("../response/httpStatusMessages");
  //const { CustomersAddress } = require("../models/customer-address");
 const moment = require("moment-timezone");
  //customer profile related api's
  
  const customerLoginService = async (params) => {
    //get customer details by given email or mobileNumber
    const result = await getCustomerDetailsByEmail_or_MobileNumber(params);
    if (result.status) {
      const customers = result.data;
  
      //send OTP to given mobile number for verification
      const otp = await sendOTP_to_mobileNumber(customers);
      console.log(otp.toString());
      //hash the generated otp by bcypt
      customers.otp = await bcrypt.hash(otp.toString(), 4);
  
      //store customer details into customers table
      await customers.save();
      return {
        status: true,
        statusCode: statusCodes?.HTTP_OK,
        message: messages?.otpSendSuccessful,
        data: [],
      };
    } else {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: messages?.userNotExist,
        data: [],
      };
    }
  };
  
  
  const customerLoginByIdService = async (params) => {
    // get admin details by email
    let result = await customerbyId(params);
    if (result.status) {
   //   console.log('result-->', result)
      if (!result.data.isActive) {
        console.log('result 11-->', result)
        return {
          status: false,
          statusCode: statusCodes?.HTTP_BAD_REQUEST,
          message: statusMessage.notActive,
        };
      }
      if (result.data.isDeleted) {
        console.log('result 11-->', result)
        return {
          status: false,
          statusCode: statusCodes?.HTTP_BAD_REQUEST,
          message:"user not found",
        };
      }
      const customer = result.data;
      //compare given password and stored password by user
      const isMatch = await bcrypt.compare(params?.password, customer.password);
      if (!isMatch) {
        return {
          status: false,
          statusCode: statusCodes?.HTTP_BAD_REQUEST,
          message: statusMessage.invalidPwd,
          data: [],
        };
      }
      //generate token with user details
      const token = await customer.generateAuthToken(result?.data);
      customer.token = token;
      return {
        status: true,
        statusCode: statusCodes?.HTTP_OK,
        message: messages?.loginSuccessful,
        data: customer,
      };
    } else {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: messages?.userNotExist,
        data: [],
      };
    }
  };
  
  
  
  const customerVerifyOTPService = async (params) => {
    //get customer details by given email or mobileNumber
    const result = await getCustomerDetailsByEmail_or_MobileNumber(params);
    var customers = result.data;
    if (result.status) {
      const isMatch = await bcrypt.compare(params.otp, customers.otp);
      if (!isMatch) {
        return {
          status: false,
          statusCode: statusCodes?.HTTP_BAD_REQUEST,
          message: messages?.invalidOTP,
          data: [],
        };
      }
      //generate token with customer details
      const token = await customers.generateAuthToken();
      customers.token = token;
      return {
        status: true,
        statusCode: statusCodes?.HTTP_OK,
        message: messages?.otpVerifySuccessful,
        data: { _id: customers._id, token: customers.token },
      };
    } else {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: messages?.userNotExist,
        data: [],
      };
    }
  };
  
  const addCustomerService = async (req, params) => {
    //verify the given trucker already exist or not
    const result = await getCustomerDetailsByEmail_or_MobileNumber(params);
    if (result.status) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: messages?.truckerExists,
        data: [],
      };
    }
    const password = params?.password;
    //encrypt given original password by bcrypt
    params.password = await bcrypt.hash(password.toString(), 10);

    //migrating Customer to customers and store customer details into customers table
    const customers = await new Customers(params);
    const details = await customers.save();
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: messages?.customerAdded,
      data: { _id: details._id },
    };
  };
  
  const getCustomerProfileService = async (params) => {
    console.log("params1")
    //get customer details by customer id
    const result = await getCustomerDetailsById(params);
    if (result.status) {
      return {
        status: true,
        statusCode: statusCodes?.HTTP_OK,
        message: statusMessage.success,
        data: result.data,
      };
    } else {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: messages?.userNotExist,
        data: [],
      };
    }
  };
  
  const updateCustomerProfileService = async (params) => {
    const customerId = params?.customerId;
    delete params["customerId"];
    var query = { $set: params };
  
    //update customer details into customers table
    const result = await Customers.updateOne({ _id: customerId }, query);
    if (!result.modifiedCount) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: messages?.userNotExist,
        data: [],
      };
    }
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: messages?.updated,
      data: [],
    };
  };
  
  const deleteCustomerService = async (params) => {
    const customerId = params?.customerId;
    delete params["customerId"];
    var query = {
      $set: {
        isDeleted: true,
        updatedBy: params?.updatedBy,
        lastUpdatedBy: params?.lastUpdatedBy,
      },
    };
  
    //update customer details into customers table
    const result = await Customers.updateOne({ _id: customerId }, query);
    if (!result.modifiedCount) {
      return {
        status: false,
        statusCode: statusCodes?.HTTP_BAD_REQUEST,
        message: messages?.userNotExist,
        data: [],
      };
    }
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      message: messages?.deleted,
      data: [],
    };
  };
  
  const customerListService = async (params) => {
    //get all customer list
    params.all = true;
    const allList = await getCustomerList(params);
    //get all customer list created by admin
    params.all = false;
    const result = await getCustomerList(params);
  
    //calculate pagemeta for pages and count
    const pageMeta = await pageMetaService(params, allList?.data?.length || 0);
    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      data: { list: result?.data, pageMeta },
    };
  };
  
  
  module.exports = {
    customerLoginService,
    customerVerifyOTPService,
    addCustomerService,
    getCustomerProfileService,
    updateCustomerProfileService,
    deleteCustomerService,
    customerListService,
    customerLoginByIdService,
  };
  