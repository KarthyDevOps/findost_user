const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const sessionSchema = new mongoose.Schema(
   { userId: {
        type: Schema.Types.ObjectId,
        required: true,
        index: true
    },
    userType: {
        type: Schema.Types.String,
        required: true,
        index: true
    },
    loggedInAt: {
        type: Schema.Types.Date,
        required: true,
    },
    loggedOutAt: {
        type: Schema.Types.Date
    },
    status: {
        type: Schema.Types.String,
        required: true,
        enum: ["ACTIVE", "INACTIVE"]
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

const session = mongoose.model("session", sessionSchema);
// export default Admin;
module.exports = { session };
