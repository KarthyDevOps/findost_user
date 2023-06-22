const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const { Sequence } = require('./sequence');
const { ROLE_TYPE } = require('../constants')
const { getImageURL } = require("../utils/s3Utils")
const mongooseLeanVirtuals = require('mongoose-lean-virtuals');
const mongooseLeanGetters = require('mongoose-lean-getters');

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String
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
      enum: [ROLE_TYPE.SUPER_ADMIN, ROLE_TYPE.ADMIN, ROLE_TYPE.STAFF, ROLE_TYPE.SUB_Admin],
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


  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: {
      virtuals: true,
      getters: true
    }
  }
);

adminSchema.pre('save', async function (next) {
  var doc = this;
  let counter = await Sequence.findOneAndUpdate({ type: 'ADMIN' }, { $inc: { count: 1 } })
  doc.adminId = (counter.count + 1).toString().padStart(6, '0').toString();;
  next();

});

adminSchema.methods.toJSON = function () {
  const admin = this;
  const adminObject = admin.toObject();
  delete adminObject.password;
  return adminObject;
};


adminSchema.plugin(mongooseLeanVirtuals);
adminSchema.plugin(mongooseLeanGetters);

adminSchema.virtual('profileURLS3').get(function () {
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
