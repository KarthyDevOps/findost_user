const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const { Sequence } = require("./sequence");
const { ROLE_TYPE } = require("../constants");
const { getImageURL } = require("../utils/s3Utils");
const mongooseLeanVirtuals = require("mongoose-lean-virtuals");
const mongooseLeanGetters = require("mongoose-lean-getters");

const settingsSchema = new mongoose.Schema(
  {
    isDarkTheme: {
      type: Boolean,
      default: false,
    },
    isEnableBioMetricLogin: {
      type: Boolean,
      default: false,
    },
    isMyNotificationSettings: {
      type: Boolean,
      default: false,
    },
    isInsurenceNotification: {
      type: Boolean,
      default: false,
    },
    isMutualFundsNotification: {
      type: Boolean,
      default: false,
    },
    isEquityNotification: {
      type: Boolean,
      default: false,
    },
    isSIPNotification: {
      type: Boolean,
      default: false,
    },
    isIPONotification: {
      type: Boolean,
      default: false,
    },
    isLoanNotification: {
      type: Boolean,
      default: false,
    },
  }
)


const BOUserSchema = new mongoose.Schema(
  {
    BOUserId: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    accountName: {
      type: String,
      required: true,
    },
    
    mobileNumber: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
    },
    branchCode: {
      type: String,
      required: false,
      trim: true,
    },
    subBranchCode: {
      type: String,
      required: false,
      trim: true,
    },
    dob: {
      type: String,
      required: false,
      trim: true,
    },
    certifications: {
      type: Array,
      required: false,
      trim: true,
    },
    settings: settingsSchema,
  
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



BOUserSchema.plugin(mongooseLeanVirtuals);
BOUserSchema.plugin(mongooseLeanGetters);

BOUserSchema.virtual("profileURLS3").get(function () {
  return this.profileURL ? getImageURL(this.profileURL) : null;
});

BOUserSchema.virtual("LinkS3").get(
  function () {
    for (let item of this.certifications) {
      return item?.link  ? getImageURL(item?.link) : null;
    }
  }
);

const BOUSERS = mongoose.model("BOUSERS", BOUserSchema);

// export default Admin;

module.exports = { BOUSERS };
