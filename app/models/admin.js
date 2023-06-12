const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const {ROLE_TYPE} = require('../constants')
const {getImageURL} = require("../utils/s3Utils")
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const mongooseLeanGetters = require('mongoose-lean-getters');

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () => {
        const now = Date.now().toString();
        return  now.slice(0, 3) + now.slice(10, 13);
      },
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileURL: {
      type: String,
      required: false
    },
    permissions: {
      type: Object,
      required: false,
    },
    role: {
      type: String,
      required: false,
      enum: [ROLE_TYPE.SUPER_ADMIN,ROLE_TYPE.ADMIN,ROLE_TYPE.STAFF,ROLE_TYPE.SUB_Admin],
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    token: String,
    otp: String,
  },

  
  { timestamps: true }
);

adminSchema.methods.toJSON = function () {
  const admin = this;
  const adminObject = admin.toObject();
  delete adminObject.password;
  return adminObject;
};


adminSchema.plugin(mongooseLeanVirtuals);
adminSchema.plugin(mongooseLeanGetters);

adminSchema.virtual('profileUrlS3').get(function () {
  console.log('s')
  return this.profileURL ? getImageURL(this.profileURL) : null;
})

adminSchema.methods.generateAuthToken = async function (department) {
  const admin = this;
  const token = jwt.sign(
    {
      _id: admin._id ? admin._id.toString() : "",
      name: admin.name ? admin.name.toString() : "",
      mobileNumber: admin.mobileNumber ? admin.mobileNumber.toString() : "",
      profileURL: admin.profileURL ? admin.profileURL.toString() : "",
    },
    process.env.JWT_ADMIN_SECRET,
  //  { expiresIn: process.env.TOKEN_EXPIRATION }
  );
  admin.token = token;
  await admin.save();
  return token;
};
const Admin = mongoose.model("admin", adminSchema);
// export default Admin;
module.exports = { Admin };
