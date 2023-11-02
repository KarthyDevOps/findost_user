const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const APsessionSchema = new mongoose.Schema(
  {
    APId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    loggedInAt: {
      type: Schema.Types.Date,
      required: true,
    },
    loggedOutAt: {
      type: Schema.Types.Date,
    },
    status: {
      type: Schema.Types.String,
      required: true,
      enum: ["ACTIVE", "INACTIVE"],
    },
    createdBy: {
      type: String,
      trim: true,
    },
    updatedBy: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const APsession = mongoose.model("APsession", APsessionSchema);
// export default Admin;
module.exports = { APsession };
