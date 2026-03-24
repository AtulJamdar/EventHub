const express = require('express');
const {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getEventsByCategory
} = require('../controllers/eventController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getAllEvents);
router.get('/:id', getEventById);
router.get('/category/:category', getEventsByCategory);

// Protected routes (Admin Only)
router.post('/', protect, authorize('admin'), upload.single('image'), createEvent);
router.put('/:id', protect, authorize('admin'), upload.single('image'), updateEvent);
router.delete('/:id', protect, authorize('admin'), deleteEvent);

module.exports = router;