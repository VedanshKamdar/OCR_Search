const multer = require('multer');
const { fork } = require('child_process');

const File = require('../models/file');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage }).single('file');

const uploadFile = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    const file = req.file;
    const newFile = new File({
      filename: file.filename,
      path: file.path,
      user: req.user.id,
    });

    await newFile.save();

    const process = fork('../services/ocrService.js');
    process.send({ fileId: newFile._id });

    res
      .status(201)
      .json({ message: 'File uploaded successfully', file: newFile });
  });
};

//GET API
const getFiles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const files = await File.find({ user: req.user.id })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await File.countDocuments({ user: req.user.id });
    const pages = Math.ceil(total / limit);

    res.status(200).json({
      files,
      total,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

//Search Functionality
const searchFiles = async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: 'Query parameter "q" is required' });
  }

  try {
    const files = await File.find({ text: { $regex: q, $options: 'i' } });

    if (files.length === 0) {
      return res.status(404).json({ message: 'No files found' });
    }
    res.json({ files });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { uploadFile, getFiles, searchFiles };