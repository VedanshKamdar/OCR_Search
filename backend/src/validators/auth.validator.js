const { check, validationResult } = require('express-validator');

const validateSignup = [
  check('first_name')
    .not()
    .isEmpty()
    .withMessage('First name is required')
    .matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)
    .withMessage('First name should not contain special characters or spaces'),
  check('last_name')
    .not()
    .isEmpty()
    .withMessage('Last name is required')
    .matches(/^[a-zA-Z]+(?: [a-zA-Z]+)*$/)
    .withMessage('Last name should not contain special characters or spaces'),
  check('email').isEmail().withMessage('Email ID is not valid'),
  check('password')
    .isLength({ min: 8, max: 25 })
    .withMessage(
      'Password must be at least 8 characters long and should not exceed 25 characters'
    )
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.*\s).{8,25}$/)
    .withMessage(
      'Password must be a combination of at least 1 uppercase letter, 1 lowercase letter, 1 special character, and should not contain spaces'
    ),
];

const validateSignin = [
  check('email', 'Enter valid email ID').isEmail(),
  check('password', 'Password field is empty').exists(),
];

const validateForgotPassword = [
  check('email', 'Please include a valid email').isEmail(),
];

const validateResetPassword = [
  check('newPassword')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateSignup,
  validateSignin,
  validateForgotPassword,
  validateResetPassword,
  validate,
};
