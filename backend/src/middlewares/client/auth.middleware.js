const jwt = require("jsonwebtoken");
const BlackList = require("../../models/client/blackList.model");
const { secretKey } = require("../../config/jwt");

module.exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({
            message: "Unauthorized: Missing token!",
        })
    }
    const [bearer, token] = authHeader.split(" ");
    if (bearer !== "Bearer" || !token) {
        return res.status(401).json({
            message: "Unauthorized: Invalid token format!",
        })
    }
    const checkIfBlacklisted = await BlackList.findOne({
        token: token
    });
    if (checkIfBlacklisted) {
        return res.status(401).json({
            message: "This session has expired. Please login!" 
        });
    }

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: "Forbidden: Invalid token!",
            })
        }
        req.user = user;
        next();
    });
};