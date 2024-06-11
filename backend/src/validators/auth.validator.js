const { check, validationResult } = require('express-validator');

const validateSignup = [
  check('first_name', 'First name is required').not().isEmpty(),
  check('last_name', 'Last name is required').not().isEmpty(),
  check('email', 'Email ID is not valid').isEmail(),
  check(
    'password',
    'Password must be at least 6 characters long and should not exceed 16 characters'
  ).isLength({ min: 6, max: 16 }),
];

const validateSignin = [
  check('email', 'Enter valid email ID').isEmail(),
  check('password', 'Password field is empty').exists(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validateSignup, validateSignin, validate };
