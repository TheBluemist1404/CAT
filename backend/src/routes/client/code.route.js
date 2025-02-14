const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/code.controller');

router.post('/execute',  controller.execute)

module.exports = router