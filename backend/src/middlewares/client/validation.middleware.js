module.exports.validateLogin = (req, res, next) => {
    if (!req.body.email) {
        res.status(400).json({
            message: "Please enter email!",
        });
        return;
    }
    if (!req.body.password) {
        res.status(400).json({
            message: "Please enter password!",
        });
        return;
    }
    next();
};

module.exports.validateSignup = (req, res, next) => {
    if (!req.body.fullName) {
        res.status(400).json({
            message: "Please enter full name!",
        });
        return;
    }
    if (!req.body.email) {
        res.status(400).json({
            message: "Please enter email!",
        });
        return;
    }
    if (!req.body.password) {
        res.status(400).json({
            message: "Please enter password!",
        });
        return;
    }
    next();
};