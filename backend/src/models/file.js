const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
    filename: { type: String, required: true },
    path: { type: String, required: true },
    status: { type: String, default: 'uploaded' },
    text: { type: String },
    pdfPath: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});

fileSchema.index({ text: 'text' });

const File = mongoose.model('File', fileSchema);

module.exports = File;