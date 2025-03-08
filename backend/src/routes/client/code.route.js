const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/code.controller');

router.post('/execute',  controller.execute)
// Add this SSE route for log streaming.
router.get('/logs/:executionId', controller.streamLogs);

module.exports = router