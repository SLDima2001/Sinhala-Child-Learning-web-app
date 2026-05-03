const mongoose = require('mongoose');

const projectOverviewSchema = new mongoose.Schema({
  title: { type: String, default: 'EduSinhala' },
  description: { type: String, default: '' },
  highlights: { type: [String], default: [] },
  videoUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('ProjectOverview', projectOverviewSchema);
