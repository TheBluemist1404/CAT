const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/auth.controller");
const validation = require("../../middlewares/client/validation.middleware");

router.post("/signup", validation.validateSignup, controller.signup);
router.post("/login", validation.validateLogin,controller.login);
router.delete("/logout", controller.logout);

router.get('/google', )
module.exports = router;