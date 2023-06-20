const mongoose = require("mongoose");

const sequenceSchema = new mongoose.Schema(
    {
        type: {
            type: String,

        },
        count: {
            type: Number,
        }
    }

);



const Sequence = mongoose.model("sequence", sequenceSchema);
// export default Admin;
module.exports = { Sequence };
