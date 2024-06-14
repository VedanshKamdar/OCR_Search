const express = require('express');

const {
  uploadFile,
  getFiles,
  searchFiles,
} = require('../controllers/file.controller');
const authMiddleware = require('../middleware/auth');
const {
  validateFileUpload,
  validateSearchQuery,
  validate
} = require('../validators/file.validator');

const router = express.Router();

router.post('/', authMiddleware, validateFileUpload, validate, uploadFile);
router.get('/', authMiddleware, getFiles);
router.get('/search', authMiddleware, validateSearchQuery, validate, searchFiles);

module.exports = router;
