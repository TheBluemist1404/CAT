const mongoose = require("mongoose");
const blackListSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    }
}, { timestamps: true });

const BlackList = mongoose.model("Blacklist", blackListSchema);
module.exports = BlackList;