const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");

const { ROLE_TYPE } = require('../constants')

const { getImageURL } = require("../utils/s3Utils")

const { Sequence } = require('./sequence');

const clientFamilySchema = new mongoose.Schema(
  {
    clientId: {
      type: String
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    relativeName: {
      type: String,
      required: false,
      get(value) {
        return getImageURL(value);
      }
    },
    relationShip: {
      type: Object,
      required: false,
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

clientFamilySchema.pre('save', async function (next) {
  var doc = this;
  let counter = await Sequence.findOneAndUpdate({ type: 'clientFamily' }, { $inc: { count: 1 } })
  doc.clientId = (counter.count + 1).toString().padStart(6, '0').toString();;
  next();

});


const clientFamily = mongoose.model("clientFamily", clientFamilySchema);

// export default clientFamily;
module.exports = { clientFamily };
