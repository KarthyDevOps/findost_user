const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const segmentSchema = new mongoose.Schema(
    {
        segmentId: {
            type: String
        },
        segmentName: {
            type:String,
            trim:true
        },
        segmentCharge: {
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

const segment = mongoose.model("segment", segmentSchema);
// export default Admin;
module.exports = { segment };
