const { check, param, validationResult } = require('express-validator');

const validateSearchQuery = [
  check('q', 'Query parameter is required').not().isEmpty(),
];

const validateFileId = [param('id', 'Invalid file ID').isMongoId()];

const validatePdfName = [
  param('pdfName', 'PDF name is required').not().isEmpty(),
  param('pdfName').custom(async (pdfName) => {
    const file = await File.findOne({ pdfName });
    if (!file) {
      throw new Error('PDF name does not match any existing file');
    }
    return true;
  }),
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
  validateFileId,
  validatePdfName,
  validate,
};
