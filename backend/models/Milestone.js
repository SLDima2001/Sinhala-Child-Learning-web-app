const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  marksPercentage: { type: Number, required: true },
  status: { type: String, enum: ['Completed', 'Pending', 'Upcoming'], default: 'Upcoming' }
}, { timestamps: true });

module.exports = mongoose.model('Milestone', milestoneSchema);
