const multer = require('multer');
const { fork } = require('child_process');
const { check, validationResult } = require('express-validator');
const File = require('../models/file');
var azure = require('azure-storage');
const { BlobServiceClient } = require('@azure/storage-blob');
var blobService = azure.createBlobService();
require('dotenv').config();

const blobServiceClient = BlobServiceClient.fromConnectionString(
  process.env.AZURE_STORAGE_CONNECTION_STRING
);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single('file');

const validateFileUpload = [
  check('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('File is required');
    }
    return true;
  }),
];

// Handle file upload
const uploadFile = async (req, res) => {
  console.log('Handling file upload...');
  upload(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err.message);
      return res.status(400).json({ message: err.message });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const file = req.file;
    const newFile = new File({
      filename: file.filename,
      path: file.path,
      user: req.user.id,
    });

    try {
      await newFile.save();

      const process = fork(
        'D:/workspace/OCR_Search/backend/src/services/ocrService.js'
      );
      process.send({ fileId: newFile._id });

      process.on('message', async (message) => {
        newFile.pdfUrl = message.pdfUrl;
        newFile.pdfName = message.pdfName;
        await newFile.save();
        console.log('File processed:', newFile);
      });

      res
        .status(201)
        .json({ message: 'File uploaded successfully', file: newFile });
    } catch (error) {
      console.error('Server error:', error.message);
      res.status(500).json({ message: 'Server error' });
    }
  });
};

// Get uploaded files
const getFiles = async (req, res) => {
  try {
    const files = await File.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    const total = files.length;
    res.status(200).json({ files, total });
  } catch (error) {
    console.error('Server error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Search files by text
const searchFiles = async (req, res) => {
  const { q } = req.query;
  console.log('Searching files with query:', q);

  if (!q) {
    return res.status(400).json({ message: 'Query parameter "q" is required' });
  }

  try {
    const files = await File.find({
      text: { $regex: q, $options: 'i' },
      user: req.user.id,
    });

    if (files.length === 0) {
      return res.status(404).json({ message: 'No files found' });
    }
    res.json({ files });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Handle file deletion
const deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const file = await File.findById(fileId);

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const pdfUrlParts = file.pdfUrl.split('/');
    const blobName = pdfUrlParts[pdfUrlParts.length - 1];
    const containerName = 'ocr-search';

    console.log('Deleting blob:', blobName, 'from container:', containerName);

    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.deleteBlob(blobName);
    // await blobService.deleteBlobIfExists(
    //   containerName,
    //   blobName,
    //   (error, response) => {
    //     if (error) {
    //       console.error('Error deleting blob:', error);
    //       throw error;
    //     }
    //     console.log('Azure Blob Storage response:', response);
    //   }
    // );

    await File.findByIdAndDelete(fileId);

    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

const getFileById = async (req, res) => {
  console.log('Fetching file by ID...');
  try {
    const file = await File.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.json({ file });
  } catch (error) {
    console.error('Error fetching file:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const generateSASUrl = async (req, res) => {
  console.log('Generating SAS URL for file:', req.params.pdfName);
  try {
    const file = await File.findOne({ pdfName: req.params.pdfName });
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const pdfUrlParts = file.pdfUrl.split('/');
    const blobName = pdfUrlParts[pdfUrlParts.length - 1];
    const containerName = 'ocr-search';

    var startDate = new Date();
    var expiryDate = new Date(startDate);
    expiryDate.setMinutes(startDate.getMinutes() + 100);
    startDate.setMinutes(startDate.getMinutes() - 100);

    var sharedAccessPolicy = {
      AccessPolicy: {
        Permissions: azure.BlobUtilities.SharedAccessPermissions.READ,
        Start: startDate,
        Expiry: expiryDate,
      },
    };

    var token = blobService.generateSharedAccessSignature(
      containerName,
      blobName,
      sharedAccessPolicy
    );
    var sasUrl = blobService.getUrl(containerName, blobName, token);

    console.log(`Generated SAS URL: ${sasUrl}`);
    res.status(200).json({ sasUrl });
  } catch (error) {
    console.error('Error generating SAS URL:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  uploadFile,
  getFiles,
  searchFiles,
  deleteFile,
  validateFileUpload,
  getFileById,
  generateSASUrl,
};
