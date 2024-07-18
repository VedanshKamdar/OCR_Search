const mongoose = require('mongoose');
const Tesseract = require('tesseract.js');
const File = require('../models/file');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const dotenv = require('dotenv');
const { uploadFile } = require('./azureBlobService');

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

process.on('message', async (message) => {
  const { fileId } = message;

  try {
    const file = await File.findById(fileId);

    const {
      data: { text },
    } = await Tesseract.recognize(file.path, 'eng');

    const existingFile = await File.findOne({ text });

    const pdfBlobName = await generateUniqueFilename(
      file.filename,
      text,
      existingFile
    );
    const pdfStream = await generatePDFStream(text);

    await uploadFile(process.env.CONTAINER_NAME, pdfBlobName, pdfStream);

    file.text = text;
    file.status = 'processed';
    file.pdfUrl = `${process.env.BLOB_PDF_URL}/${pdfBlobName}`;
    file.pdfName = pdfBlobName;
    await file.save();

    fs.unlinkSync(file.path);
  } catch (err) {
    console.error(err.message);
  }
  process.exit();
});

async function generatePDFStream(text) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const chunks = [];

    doc.on('data', (chunk) => {
      chunks.push(chunk);
    });

    doc.on('end', () => {
      resolve(Buffer.concat(chunks));
    });

    doc.on('error', (err) => {
      reject(err);
    });

    doc.text(text);
    doc.end();
  });
}

async function generateUniqueFilename(originalFilename, text, existingFile) {
  const baseName = path.parse(originalFilename).name;
  let filename = `${baseName}.pdf`;

  if (existingFile) {
    let suffix = 1;
    while (true) {
      const potentialFilename = `${baseName}(${suffix}).pdf`;
      const fileExists = await File.exists({ pdfUrl: potentialFilename });
      if (!fileExists) {
        filename = potentialFilename;
        break;
      }
      suffix++;
    }
  }

  return filename;
}
