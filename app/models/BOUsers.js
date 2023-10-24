const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const { Sequence } = require("./sequence");
const { ROLE_TYPE } = require("../constants");
const { getImageURL } = require("../utils/s3Utils");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const mongooseLeanGetters = require("mongoose-lean-getters");

const BOUserSchema = new mongoose.Schema(
  {
    BOUserId: {
      type: String,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
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
  },
  {
    timestamps: true,
    toObject: { getters: true },
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

BOUserSchema.pre("save", async function (next) {
  var doc = this;
  let counter = await Sequence.findOneAndUpdate(
    { type: "BOUSERS" },
    { $inc: { count: 1 } }
  );
  console.log('counter-->', counter)
  doc.BOUserId = (counter.count + 1).toString().padStart(6, "0").toString();
  next();
});



BOUserSchema.plugin(mongooseLeanVirtuals);
BOUserSchema.plugin(mongooseLeanGetters);

BOUserSchema.virtual("profileURLS3").get(function () {
  return this.profileURL ? getImageURL(this.profileURL) : null;
});

const BOUSERS = mongoose.model("BOUSERS", BOUserSchema);

// export default Admin;

module.exports = { BOUSERS };
