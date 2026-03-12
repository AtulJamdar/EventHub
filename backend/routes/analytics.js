const express = require('express');
const {
    getEventsByCategory,
    getMonthlyBookings,
    getRevenueTrend,
    getTopEvents,
    getDashboardStats,
    getRevenueByCategory,
    getBookingTrends
} = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All analytics routes protected and admin only
router.use(protect, authorize('admin'));

// Chart data endpoints
router.get('/events-by-category', getEventsByCategory);
router.get('/monthly-bookings', getMonthlyBookings);
router.get('/revenue-trend', getRevenueTrend);
router.get('/top-events', getTopEvents);
router.get('/revenue-by-category', getRevenueByCategory);
router.get('/booking-trends', getBookingTrends);

// Dashboard stats endpoint
router.get('/dashboard/stats', getDashboardStats);

module.exports = router;