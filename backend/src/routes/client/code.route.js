const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/code.controller');

router.post('/execute',  controller.execute)
// Add this SSE route for log streaming.
router.get('/logs/:executionId', controller.streamLogs);
router.post('/push-log', controller.pushLogEndpoint)

module.exports = router