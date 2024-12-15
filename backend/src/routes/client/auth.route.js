const express = require("express");
const cors = require("cors");
const router = express.Router();
const controller = require("../../controllers/client/auth.controller");


router.post("/signup", controller.signup);
router.post("/login", controller.login);

module.exports = router;