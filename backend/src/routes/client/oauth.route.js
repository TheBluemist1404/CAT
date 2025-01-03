const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/oauth.controller");

router.get('/google', controller.oauth);

module.exports = router;