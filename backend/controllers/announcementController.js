const Announcement = require('../models/Announcement');

const createAnnouncement = async (req, res) => {
  const { title, content, targetRole } = req.body;
  try {
    const announcement = new Announcement({
      title,
      content,
      targetRole,
      postedBy: req.user
    });
    await announcement.save();
    res.status(201).json({ success: true, data: announcement });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getAllAnnouncements = async (req, res) => {
  try {
    // In a real app, you might filter by targetRole based on req.userRole
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: announcements });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createAnnouncement,
  getAllAnnouncements,
  deleteAnnouncement
};
