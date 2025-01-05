const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/client/auth.middleware');
const controller = require('../../controllers/client/profile.controller');
const multer = require('../../middlewares/client/multer.middleware');
const uploadCloud = require('../../middlewares/client/uploadCloud.middleware');
const validate = require('../../middlewares/client/validation.middleware');

router.get('/detail/:id', auth.authenticateToken, controller.index);
router.patch(
  '/edit/:id',
  auth.authenticateToken,
  multer.single('avatar'),
  uploadCloud.uploadSingle,
  validate.validateEditProfile,
  controller.edit,
);

module.exports = router;
