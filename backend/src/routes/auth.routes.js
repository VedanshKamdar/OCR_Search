const express = require('express');
const {
  signup,
  signin,
  profile,
  forgotPassword,
  resetPassword,
  updatePassword,
} = require('../controllers/auth.controller');
const {
  validateSignup,
  validateSignin,
  validateForgotPassword,
  validateResetPassword,
  validate,
} = require('../validators/auth.validator');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.post('/signup', validateSignup, validate, signup);
router.post('/signin', validateSignin, signin);
router.get('/profile', authMiddleware, profile);
router.post(
  '/forgot-password',
  validateForgotPassword,
  validate,
  forgotPassword
);
router.post(
  '/reset-password/:token',
  validateResetPassword,
  validate,
  resetPassword
);
router.post('/update-password', authMiddleware, updatePassword);

module.exports = router;
