const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    deleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const User = mongoose.model("users", userSchema);
module.exports = User;