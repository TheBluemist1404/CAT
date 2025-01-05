const express = require('express');
const router = express.Router();
const controller = require('../../controllers/client/auth.controller');
const validation = require('../../middlewares/client/validation.middleware');
const auth = require('../../middlewares/client/auth.middleware');

router.post('/signup', validation.validateSignup, controller.signup);
router.post('/login', validation.validateLogin, controller.login);
router.delete('/logout', controller.logout);
router.post('/forgot', validation.validateForgot, controller.forgot);
router.post('/otp', validation.validateOtp, controller.otp);
router.post(
  '/change-password',
  auth.authenticateOtpToken,
  validation.validateChangePass,
  controller.changePassword,
);
module.exports = router;
