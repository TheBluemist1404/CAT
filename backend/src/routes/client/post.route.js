const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/post.controller');
const auth = require('../../middlewares/client/auth.middleware');
const validate = require('../../middlewares/client/validation.middleware');
const multer = require('../../middlewares/client/multer.middleware');
const uploadCloud = require('../../middlewares/client/uploadCloud.middleware');

router.get('/', controller.index);
router.post(
  '/create',
  auth.authenticateToken,
  multer.array('images'),
  uploadCloud.uploadMulti,
  validate.validateCreate,
  controller.create,
);

module.exports = router;
