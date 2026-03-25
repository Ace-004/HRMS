const express = require('express');
const announcementController = require('../controllers/announcementController');
const protected = require('../middleware/authMiddleware');
const verifyRole = require('../middleware/roleMiddleware');

const router = express.Router();

// Everyone logged in can see announcements
router.get('/', protected, announcementController.getAllAnnouncements);

// Only Admin/HR can post or delete
router.post('/create', protected, verifyRole(['admin', 'hr']), announcementController.createAnnouncement);
router.delete('/:id', protected, verifyRole(['admin', 'hr']), announcementController.deleteAnnouncement);

module.exports = router;
