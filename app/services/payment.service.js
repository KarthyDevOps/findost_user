const { statusCodes } = require("../response/httpStatusCodes");
const { authorizedPersons } = require("../models/authorizedPersons");
const { PAYMENT_STATUS, ORDER_STATUS, PAYMENT_ENTITY, REFUND_ENTITY } = require("../constants");
const { messages } = require("../response/customMessages");

const Razorpay = require("razorpay");
const crypto = require("crypto");
const orderCreateService = async (req, params) => {
  console.log("params 111-->", params);
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  const options = {
    amount: +params.amount * 100 || 0,
    currency: ORDER_STATUS.currency,
    receipt: crypto.randomBytes(10).toString("hex"),
  };
  let order = await instance.orders.create(options)
  if(order.error)
  {
    return {
      status: false,
      statusCode: statusCodes?.HTTP_OK,
      messages: "Something Went Wrong! Unable to create razorpay Order!",
      data: [],
    };
  }
  else
  {
    let obj = {
      orderId: order.id,
      orderAmount: +order.amount,
      orderReceipt: order.receipt,
      paymentMode: "Online - Razorpay",
    };
    var query = {
      $set: {
        paymentDetails: {
          paymentStatus: "PENDING",
          totalAmount: order.amount,
          orderId: order.id,
        },
      },
    };
    console.log('success');
    const result = await authorizedPersons.updateOne(
      { _id: params.authorizedPersonId },
      query
    );

    return {
      status: true,
      statusCode: statusCodes?.HTTP_OK,
      data: obj,
    };
  }
  
};
const paymentverifyService = async (req, params) => {
  let body = req.body;
  let headers = req.headers;
  console.log('body',JSON.stringify(body,null,2))
  console.log('headers',JSON.stringify(headers,null,2))
  const shasum = crypto.createHmac("sha256", process.env.KEY_SECRET);
  shasum.update(JSON.stringify(body));
  const digest = shasum.digest("hex");

  if (digest !== headers["x-razorpay-signature"])
    return response.success(
      req,
      res,
      statusCodes.HTTP_FORBIDDEN,
      null,
      "Signature missmatch"
    );
  if (![...PAYMENT_ENTITY, ...REFUND_ENTITY]?.includes(body.event))
    return response.success(
      req,
      res,
      statusCodes.HTTP_FORBIDDEN,
      null,
      "payment failed"
    );
  if (PAYMENT_ENTITY?.includes(body.event)) {
    let paymentStatus = PAYMENT_STATUS.PENDING,
      paymentId,
      paymentMode,
      paymentInfo;
    let paymentOrderId = body?.payload?.payment?.entity?.order_id;
    if (body?.payload?.payment?.entity?.status == "captured") {
      paymentStatus = PAYMENT_STATUS.COMPLETED;
      paymentId = body.payload.payment.entity.id;
      paymentMode = body?.payload?.payment?.entity?.method;
      if (paymentMode === "card") {
        paymentMode =
          body?.payload?.payment?.entity?.card?.network?.toUpperCase?.() +
          " ************" +
          body?.payload?.payment?.entity?.card?.last4;
        paymentInfo = body?.payload?.payment?.entity?.card;
      }
      if (["paylater", "wallet"].includes(paymentMode)) {
        paymentMode += " - " + body?.payload?.payment?.entity?.wallet;
        paymentInfo = { wallet: body?.payload?.payment?.entity?.wallet };
      }
      if (paymentMode === "netbanking") {
        paymentMode += " - " + body?.payload?.payment?.entity?.bank;
        paymentInfo = { bank: body?.payload?.payment?.entity?.bank };
      }

      var query = {
        $set: {
          paymentDetails: {
            paymentStatus: paymentStatus,
            paymentMode: paymentMode,
            paymentInfo: paymentInfo,
            paymentId: paymentId,
          },
        },
      };
    }
    if (body?.payload?.payment?.entity?.status == "failed") {
      paymentStatus = PAYMENT_STATUS.FAILURE;
      paymentId = body?.payload?.payment?.entity?.id || null;
      var query = {
        $set: {
          paymentDetails: {
            paymentStatus: paymentStatus,
            paymentId: paymentId,
          },
        },
      };
    }
    console.log(query,'query')
    const result = await authorizedPersons.updateOne(
      { "paymentDetails.orderId": paymentOrderId },
      query
    );
  } else if (REFUND_ENTITY?.includes(body.event)) {
  }
};

const checkPaymentStatusService = async (req, params) => {
  const data = await authorizedPersons.findOne({
    $or: [
      { authorizedPersonId: params?.authorizedPersonId },
      { _id: params?.authorizedPersonId }
    ],
  });
  return {
    status: true,
    statusCode: statusCodes?.HTTP_OK,
    message: messages?.success,
    data: { data : data },
  };
};
module.exports = {
  orderCreateService,
  paymentverifyService,
  checkPaymentStatusService
};
