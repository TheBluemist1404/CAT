const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/jwt");

module.exports.generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email
    }
    return jwt.sign(payload, secretKey, { expiresIn: "3h" })
};