const express = require('express');
const {
    createBooking,
    getUserBookings,
    getAllBookings,
    getBookingById,
    approveBooking,
    rejectBooking,
    cancelBooking,
    getBookingStats
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// User routes (Protected)
router.post('/', protect, createBooking);
router.get('/user/my-bookings', protect, getUserBookings);
router.get('/:id', protect, getBookingById);
router.delete('/:id', protect, cancelBooking);

// Admin routes (Protected & Admin Only)
router.get('/', protect, authorize('admin'), getAllBookings);
router.put('/:id/approve', protect, authorize('admin'), approveBooking);
router.put('/:id/reject', protect, authorize('admin'), rejectBooking);
router.get('/admin/stats', protect, authorize('admin'), getBookingStats);

module.exports = router;