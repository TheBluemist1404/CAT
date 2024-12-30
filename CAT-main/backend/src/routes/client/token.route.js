const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/token.controller");
const validation = require("../../middlewares/client/validation.middleware");

router.post('/', validation.validateRefreshToken, controller.getNewToken);
module.exports = router;