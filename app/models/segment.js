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
segmentSchema.pre('save', async function (next) {
    var doc = this;
    let counter = await Sequence.findOneAndUpdate({ type: 'segment' }, { $inc: { count: 1 } })
    doc.segmentId = (counter.count + 1).toString().padStart(6, '0').toString();;
    next();
  
  });
  
const segment = mongoose.model("segment", segmentSchema);
// export default Admin;
module.exports = { segment };
