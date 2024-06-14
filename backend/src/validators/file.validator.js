const { check, validationResult } = require('express-validator');

const validateFileUpload = [
  check('file')
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error('File is required');
      }
      return true;
    }),
];

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
  validateFileUpload,
  validateSearchQuery,
  validate,
};
