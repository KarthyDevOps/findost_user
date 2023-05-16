const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const { string } = require("joi");

const customersSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () => {
        const now = Date.now().toString();
        return  now.slice(0, 3) + now.slice(10, 13);
      },
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    profileURL: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: false,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    otp: String,
    token: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

customersSchema.methods.toJSON = function () {
  const customers = this;
  const customersObject = customers.toObject();
  delete customersObject.otp;
  //delete customersObject.token;
  return customersObject;
};
customersSchema.methods.generateAuthToken = async function () {
  const customers = this;
  const token = jwt.sign(
    {
      _id: customers._id ? customers._id.toString() : "",
      name: customers.name ? customers.name.toString() : "",
      email: customers.email ? customers.email.toString() : "",
      mobileNumber: customers.mobileNumber
        ? customers.mobileNumber.toString()
        : "",
      profileURL: customers.profileURL ? customers.profileURL.toString() : "",
    },
    process.env.JWT_CUSTOMER_SECRET,

    { expiresIn: process.env.TOKEN_EXPIRATION }
  );
  customers.token = token;
  await customers.save();
  return token;
};

/*
customersSchema.statics.findByCredentials = async (
    mobileNumber,
    otp = undefined
) => {
    const customers = await Customers.findOne({
        mobileNumber
    });
    if (otp) {
        const isMatch = await bcrypt.compare(otp, customers.otp);
        if (!isMatch) {
            throw invalidOtp;
        }
        return customers;
    } else {
        if (!customers) {
            throw invalidMobileNumber;
        }
        return customers;
    }
};
*/

const Customers = mongoose.model("customers", customersSchema);
// export default Customers;
module.exports = { Customers };
