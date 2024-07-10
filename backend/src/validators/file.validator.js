const { check, validationResult } = require('express-validator');

const validateSearchQuery = [
  check('q', 'Query parameter is required').not().isEmpty(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateSearchQuery,
  validate,
};
