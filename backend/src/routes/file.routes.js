const express = require('express');

const {
  uploadFile,
  getFiles,
  searchFiles,
  deleteFile,
  getFileById,
  generateSASUrl,
} = require('../controllers/file.controller');
const authMiddleware = require('../middleware/auth');
const {
  validateSearchQuery,
  validate
} = require('../validators/file.validator');

const router = express.Router();

router.post('/', authMiddleware, validate, uploadFile);
router.get('/', authMiddleware, getFiles);
router.get('/search', authMiddleware, validateSearchQuery, validate, searchFiles);
router.delete('/:id', authMiddleware, deleteFile);
router.get('/:id', authMiddleware, getFileById);
router.get('/sas/:pdfName',authMiddleware, generateSASUrl);

module.exports = router;