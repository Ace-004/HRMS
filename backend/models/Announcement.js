const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  targetRole: {
    type: String,
    enum: ['all', 'admin', 'hr', 'employee'],
    default: 'all',
  }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
