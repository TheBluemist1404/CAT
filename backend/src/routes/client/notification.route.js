const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/client/auth.middleware');
const notificationController = require('../../controllers/client/notification.controller');

router.get(
  '/',
  auth.authenticateToken,
  notificationController.getNotifications,
);
router.patch(
  '/:id',
  auth.authenticateToken,
  notificationController.updateNotifications,
);

module.exports = router;
