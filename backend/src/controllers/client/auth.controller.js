const User = require("../../models/client/user.model");
const hashPassword = require("../../utils/hashPassword");
const bcrypt = require("bcrypt");
const BlackList = require("../../models/client/blackList.model");
const { generateToken } = require("../../utils/jwtGenerate");

// [POST] /api/v1/auth/signup
module.exports.signup = async (req, res) => {
    try {
        const email = req.body.email;
        const fullName = req.body.fullName;
        const checkUserExist = await User.findOne({
            email: email,
            deleted: false,
        });

        if (checkUserExist) {
            res.status(409).json({
                message: 'User already exists',
            });
            return;
        }

        const password = await hashPassword.hash(req.body.password);

        const user = new User({
            email: email,
            fullName: fullName,
            password: password,
        });

        await user.save();

        res.status(201).json({user: user});
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
};

// [POST] /api/v1/auth/login
module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({
            email: email,
            deleted: false,
        })
        if (!existingUser) {
            res.status(404).json({
                message: 'User not found',
            });
            return;
        }

        const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordMatch) {
            res.status(403).json({
                message: 'Invalid password',
            });
            return;
        }

        const token = generateToken(existingUser);  
        res.status(200).json({user: existingUser, token: token });
    } catch (err) {
        res.status(500).json({
            message: err.message,
        });
    }
    
};

// [POST] /api/v1/auth/logout
module.exports.logout = async (req, res) => {
    try {
        const authHeader = req.header("Authorization");
        if (!authHeader) {
            return res.status(401).json({
                message: "Unauthorized: Missing token!",
            });
            
        }
        const [bearer, token] = authHeader.split(" ");
        if (bearer !== "Bearer" || !token) {
            return res.status(401).json({
                message: "Unauthorized: Invalid token format!",
            });
        }
        const checkIfBlacklisted = await BlackList.findOne({ token: token }); // Check if that token is blacklisted
        // if true, send a no content response.
        if (checkIfBlacklisted) return res.sendStatus(204);
        // otherwise blacklist token
        const newBlackList = new BlackList({
            token: token
        });
        await newBlackList.save();

        res.status(200).json({ 
            message: 'You are logged out!' 
        });
    } catch (err) {
        res.status(500).json({
          message: 'Internal Server Error',
        });
    }
    res.end();
};