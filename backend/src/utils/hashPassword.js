const bcrypt = require("bcryptjs");
require('dotenv').config();

module.exports.hash = async (password) => {
    const salt = parseInt(process.env.saltRounds);
    return await bcrypt.hash(password, salt);
}