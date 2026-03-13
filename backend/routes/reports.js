const express = require('express');
const {
    generateEventReport,
    generateBookingReport,
    generateRevenueReport,
    generateUserActivityReport,
    exportReportData
} = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All report routes protected and admin only
router.use(protect, authorize('admin'));

// Report generation endpoints
router.get('/event', generateEventReport);
router.get('/booking', generateBookingReport);
router.get('/revenue', generateRevenueReport);
router.get('/user-activity', generateUserActivityReport);

// Export report data endpoint
router.get('/export', exportReportData);

module.exports = router;