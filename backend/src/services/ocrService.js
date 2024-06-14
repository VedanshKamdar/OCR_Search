const mongoose = require('mongoose');
const Tesseract = require('tesseract.js');
const File = require('../models/file');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI);

process.on('message', async (message) => {
  const { fileId } = message;

  try {
    const file = await File.findById(fileId);

    const {
      data: { text },
    } = await Tesseract.recognize(file.path, 'eng');

    file.text = text;
    file.status = 'processed';

    const pdfPath = `uploads/${file.filename}.pdf`;
    const doc = new PDFDocument();
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);
    doc.text(text);
    doc.end();

    file.pdfPath = pdfPath;

    await file.save();
    fs.unlinkSync(file.path);
  } catch (err) {
    console.error(err.message);
  }
  process.exit();
});
