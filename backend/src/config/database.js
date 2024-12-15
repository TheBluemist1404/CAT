const mongoose = require("mongoose");
require('dotenv').config();

module.exports.connect = async () => {
    try {
        await mongoose.connect(process.env.DB_URI);
        console.log("Database connected!");
    } catch {
        console.log("Failed to connect to database!");
    }
};