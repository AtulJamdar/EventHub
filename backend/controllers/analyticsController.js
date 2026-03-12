const Booking = require('../models/Booking');
const Event = require('../models/Event');
const mongoose = require('mongoose');

// Get Events by Category
exports.getEventsByCategory = async(req, res) => {
    try {
        const eventsByCategory = await Event.aggregate([{
                $group: {
                    _id: '$category',
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 }
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    count: 1
                }
            }
        ]);

        // Format for pie chart
        const chartData = eventsByCategory.map(item => ({
            name: item.category,
            value: item.count
        }));

        res.status(200).json({
            success: true,
            data: chartData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching events by category',
            error: error.message
        });
    }
};

// Get Monthly Bookings
exports.getMonthlyBookings = async(req, res) => {
    try {
        const monthlyBookings = await Booking.aggregate([{
                $match: { status: 'approved' }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$bookingDate' },
                        month: { $month: '$bookingDate' }
                    },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        // Format for bar chart
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const chartData = monthlyBookings.map(item => ({
            month: monthNames[item._id.month - 1],
            bookings: item.count,
            revenue: item.revenue
        }));

        res.status(200).json({
            success: true,
            data: chartData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching monthly bookings',
            error: error.message
        });
    }
};

// Get Revenue Trend (Last 12 months)
exports.getRevenueTrend = async(req, res) => {
    try {
        const today = new Date();
        const last12Months = new Date(today.setMonth(today.getMonth() - 12));

        const revenueTrend = await Booking.aggregate([{
                $match: {
                    status: 'approved',
                    bookingDate: { $gte: last12Months }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$bookingDate' },
                        month: { $month: '$bookingDate' }
                    },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            }
        ]);

        // Format for line chart
        const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ];

        const chartData = revenueTrend.map(item => ({
            month: monthNames[item._id.month - 1],
            revenue: item.revenue
        }));

        res.status(200).json({
            success: true,
            data: chartData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching revenue trend',
            error: error.message
        });
    }
};

// Get Top Events by Bookings
exports.getTopEvents = async(req, res) => {
    try {
        const topEvents = await Booking.aggregate([{
                $match: { status: 'approved' }
            },
            {
                $group: {
                    _id: '$eventId',
                    totalBookings: { $sum: '$tickets' },
                    bookingCount: { $sum: 1 },
                    totalRevenue: { $sum: '$totalPrice' }
                }
            },
            {
                $sort: { totalBookings: -1 }
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: 'events',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'eventDetails'
                }
            },
            {
                $unwind: '$eventDetails'
            },
            {
                $project: {
                    _id: 0,
                    eventId: '$_id',
                    eventName: '$eventDetails.title',
                    totalBookings: 1,
                    bookingCount: 1,
                    totalRevenue: 1,
                    price: '$eventDetails.price'
                }
            }
        ]);

        // Format for horizontal bar chart
        const chartData = topEvents.map(item => ({
            name: item.eventName,
            bookings: item.totalBookings,
            revenue: item.totalRevenue
        }));

        res.status(200).json({
            success: true,
            data: chartData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching top events',
            error: error.message
        });
    }
};

// Get Overall Statistics Dashboard
exports.getDashboardStats = async(req, res) => {
    try {
        // Total Events
        const totalEvents = await Event.countDocuments();

        // Total Bookings
        const totalBookings = await Booking.countDocuments();

        // Total Users
        const totalUsers = await require('../models/User').countDocuments();

        // Total Revenue (from approved bookings)
        const revenueData = await Booking.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        const totalRevenue = revenueData.length > 0 ? revenueData[0].total : 0;

        // Booking Status Summary
        const bookingStatusSummary = await Booking.aggregate([{
            $group: {
                _id: '$status',
                count: { $sum: 1 }
            }
        }]);

        const statusSummary = {};
        bookingStatusSummary.forEach(item => {
            statusSummary[item._id] = item.count;
        });

        // Events by Category
        const eventsByCategory = await Event.aggregate([{
            $group: {
                _id: '$category',
                count: { $sum: 1 }
            }
        }]);

        // Top 5 Events
        const topEvents = await Booking.aggregate([{
                $match: { status: 'approved' }
            },
            {
                $group: {
                    _id: '$eventId',
                    totalBookings: { $sum: '$tickets' }
                }
            },
            {
                $sort: { totalBookings: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: 'events',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'eventDetails'
                }
            },
            {
                $unwind: '$eventDetails'
            },
            {
                $project: {
                    eventName: '$eventDetails.title',
                    bookings: '$totalBookings'
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalEvents,
                totalBookings,
                totalUsers,
                totalRevenue,
                bookingStatusSummary: statusSummary,
                eventsByCategory,
                topEvents
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching dashboard statistics',
            error: error.message
        });
    }
};

// Get Revenue by Event Category
exports.getRevenueByCategory = async(req, res) => {
    try {
        const revenueByCategory = await Booking.aggregate([{
                $match: { status: 'approved' }
            },
            {
                $lookup: {
                    from: 'events',
                    localField: 'eventId',
                    foreignField: '_id',
                    as: 'eventDetails'
                }
            },
            {
                $unwind: '$eventDetails'
            },
            {
                $group: {
                    _id: '$eventDetails.category',
                    totalRevenue: { $sum: '$totalPrice' },
                    bookingCount: { $sum: 1 }
                }
            },
            {
                $sort: { totalRevenue: -1 }
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    revenue: '$totalRevenue',
                    bookings: '$bookingCount'
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: revenueByCategory
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching revenue by category',
            error: error.message
        });
    }
};

// Get Booking Trends (Last 30 days)
exports.getBookingTrends = async(req, res) => {
    try {
        const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

        const bookingTrends = await Booking.aggregate([{
                $match: {
                    bookingDate: { $gte: last30Days },
                    status: 'approved'
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: '%Y-%m-%d',
                            date: '$bookingDate'
                        }
                    },
                    bookings: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' }
                }
            },
            {
                $sort: { '_id': 1 }
            },
            {
                $project: {
                    _id: 0,
                    date: '$_id',
                    bookings: 1,
                    revenue: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: bookingTrends
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking trends',
            error: error.message
        });
    }
};