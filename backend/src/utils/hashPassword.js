const bcrypt = require("bcrypt");
require('dotenv').config();

module.exports.hash = async (password) => {
    const salt = parseInt(process.env.saltRounds);
    return await bcrypt.hash(password, salt);
}