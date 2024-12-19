const User = require("../../models/client/user.model");
const hashPassword = require("../../utils/hashPassword");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/jwtGenerate");

// [POST] /auth/signup
module.exports.signup = async (req, res) => {
    const email = req.body.email;
    const fullName = req.body.fullName;
    const checkUserExist = await User.findOne({
        email: email,
        deleted: false,
    });

    if (checkUserExist) {
        res.status(409).json({
            message: 'Username already exists',
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
    res.status(201).end();
};

// [POST] /auth/login
module.exports.login = async (req, res) => {
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

    const isPasswordMatch = bcrypt.compare(password, existingUser.password);
    if (!isPasswordMatch) {
        res.status(403).json({
            message: 'Invalid password',
          });
          return;
    }

    const token = generateToken(existingUser);  
    res.status(200).json({ token: token });
};