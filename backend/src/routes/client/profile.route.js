const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/client/auth.middleware');
const controller = require('../../controllers/client/profile.controller');

router.get('/me', auth.authenticateToken, controller.me);

module.exports = router;
