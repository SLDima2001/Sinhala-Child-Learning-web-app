const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ['Report', 'Presentation', 'Charter', 'Checklist'], required: true },
  link: { type: String },
  fileData: { type: Buffer },
  contentType: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
