const User = require("../../models/client/user.model");
const hashPassword = require("../../utils/hashPassword");
const bcrypt = require("bcrypt");
const { generateToken } = require("../../utils/jwtGenerate");

// [POST] /auth/signup
module.exports.signup = async (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const checkUserExist = await User.findOne({
        username: username,
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
        username: username,
        password: password,
    });
    await user.save();
    res.status(201).end();
};

// [POST] /auth/login
module.exports.login = async (req, res) => {
    const { username, password } = req.body;

    const existingUser = await User.findOne({
        username: username,
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