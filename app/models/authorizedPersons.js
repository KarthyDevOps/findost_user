const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const { string } = require("joi");

const authorizedPersonsSchema = new mongoose.Schema(
  {
    authorizedPersonId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () => {
        const now = Date.now().toString();
        return now.slice(0, 3) + now.slice(10, 13);
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

authorizedPersonsSchema.methods.toJSON = function () {
  const authorizedPersons = this;
  const authorizedPersonsObject = authorizedPersons.toObject();
  delete authorizedPersonsObject.otp;
  //delete authorizedPersonsObject.token;
  return authorizedPersonsObject;
};
authorizedPersonsSchema.methods.generateAuthToken = async function () {
  const authorizedPersons = this;
  const token = jwt.sign(
    {
      _id: authorizedPersons._id ? authorizedPersons._id.toString() : "",
      name: authorizedPersons.name ? authorizedPersons.name.toString() : "",
      email: authorizedPersons.email ? authorizedPersons.email.toString() : "",
      mobileNumber: authorizedPersons.mobileNumber
        ? authorizedPersons.mobileNumber.toString()
        : "",
      profileURL: authorizedPersons.profileURL
        ? authorizedPersons.profileURL.toString()
        : "",
    },
    process.env.JWT_authorizedPerson_SECRET,

    { expiresIn: process.env.TOKEN_EXPIRATION }
  );
  authorizedPersons.token = token;
  await authorizedPersons.save();
  return token;
};

/*
authorizedPersonsSchema.statics.findByCredentials = async (
    mobileNumber,
    otp = undefined
) => {
    const authorizedPersons = await authorizedPersons.findOne({
        mobileNumber
    });
    if (otp) {
        const isMatch = await bcrypt.compare(otp, authorizedPersons.otp);
        if (!isMatch) {
            throw invalidOtp;
        }
        return authorizedPersons;
    } else {
        if (!authorizedPersons) {
            throw invalidMobileNumber;
        }
        return authorizedPersons;
    }
};
*/

const authorizedPersons = mongoose.model(
  "authorizedPersons",
  authorizedPersonsSchema
);
// export default authorizedPersons;
module.exports = { authorizedPersons };
