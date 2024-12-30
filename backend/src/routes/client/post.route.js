const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/post.controller');
const auth = require('../../middlewares/client/auth.middleware');
const validate = require('../../middlewares/client/validation.middleware');

router.get('/', controller.index);
router.post(
  '/create',
  auth.authenticateToken,
  validate.validateCreate,
  controller.create,
);

module.exports = router;
