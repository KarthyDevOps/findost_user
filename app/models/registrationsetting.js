const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const registrationSettingSchema = new mongoose.Schema(
    {
        applicationFee: {
            type: String
        },
        securityDeposit: {
            type:String,
            trim:true
        },
        registrationCharge: {
            type:String,
            trim:true
        },
        couponCode: {
            type:String,
            trim:true
        },
        segmentGst: {
            type:String,
            trim:true
        },
        isDeleted: {
            type: Boolean,
            trim: true,
            default:false
        },
        createdBy: {
            type: String,
            trim: true
        },

        updatedBy: {
            type: String,
            trim: true
        }
    },
    { timestamps: true }
);

const registrationSettings = mongoose.model("registrationSettings", registrationSettingSchema);
// export default Admin;
module.exports = { registrationSettings };
