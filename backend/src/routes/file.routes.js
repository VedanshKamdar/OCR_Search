const express = require('express');

const {
  uploadFile,
  getFiles,
  searchFiles,
  deleteFile,
  getFileById,
  generateSASUrl,
  validateFileUpload,
} = require('../controllers/file.controller');
const authMiddleware = require('../middleware/auth');
const {
  validateSearchQuery,
  validateFileId,
  validatePdfName,
  validate,
} = require('../validators/file.validator');

const router = express.Router();

router.post('/', authMiddleware, validate, uploadFile, validateFileUpload);
router.get('/', authMiddleware, getFiles);
router.get(
  '/search',
  authMiddleware,
  validateSearchQuery,
  validate,
  searchFiles
);
router.delete('/:id', authMiddleware, deleteFile, validateFileId, validate);
router.get('/:id', authMiddleware, getFileById, validateFileId, validate);
router.get(
  '/sas/:pdfName',
  authMiddleware,
  generateSASUrl,
  validatePdfName,
  validate
);

module.exports = router;
