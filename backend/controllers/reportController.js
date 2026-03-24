const Event = require('../models/Event');
const Booking = require('../models/Booking');
const User = require('../models/User');
const mongoose = require('mongoose');

// Generate Event Report
exports.generateEventReport = async(req, res) => {
    try {
        const { startDate, endDate, category, eventId } = req.query;

        // Build filter
        let filter = {};

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (category) {
            filter.category = category;
        }

        if (eventId) {
            filter._id = mongoose.Types.ObjectId(eventId);
        }

        // Get events with booking details
        const events = await Event.find(filter).populate('createdBy', 'name email');

        // Enrich with booking data
        const eventReportData = await Promise.all(
            events.map(async(event) => {
                const bookings = await Booking.find({
                    eventId: event._id,
                    status: 'approved'
                });

                const totalBookings = bookings.length;
                const totalTickets = bookings.reduce((sum, booking) => sum + booking.tickets, 0);
                const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalPrice, 0);

                return {
                    eventId: event._id,
                    eventName: event.title,
                    category: event.category,
                    date: event.date,
                    location: event.location,
                    price: event.price,
                    maxParticipants: event.maxParticipants,
                    occupancy: ((totalTickets / event.maxParticipants) * 100).toFixed(2),
                    totalBookings,
                    totalTickets,
                    totalRevenue,
                    createdBy: event.createdBy.name,
                    createdAt: event.createdAt
                };
            })
        );

        // Calculate summary
        const totalEvents = eventReportData.length;
        const totalBookingsSum = eventReportData.reduce((sum, event) => sum + event.totalBookings, 0);
        const totalTicketsSum = eventReportData.reduce((sum, event) => sum + event.totalTickets, 0);
        const totalRevenueSum = eventReportData.reduce((sum, event) => sum + event.totalRevenue, 0);
        const averageOccupancy = (
            eventReportData.reduce((sum, event) => sum + parseFloat(event.occupancy), 0) / totalEvents || 0
        ).toFixed(2);

        res.status(200).json({
            success: true,
            reportType: 'Event Report',
            reportDate: new Date().toISOString(),
            summary: {
                totalEvents,
                totalBookings: totalBookingsSum,
                totalTickets: totalTicketsSum,
                totalRevenue: totalRevenueSum,
                averageOccupancy: `${averageOccupancy}%`
            },
            data: eventReportData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating event report',
            error: error.message
        });
    }
};

// Generate Booking Report
exports.generateBookingReport = async(req, res) => {
    try {
        const { startDate, endDate, status, eventId, userId } = req.query;

        // Build filter
        let filter = {};

        if (startDate && endDate) {
            filter.bookingDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        if (status) {
            filter.status = status;
        }

        if (eventId) {
            filter.eventId = mongoose.Types.ObjectId(eventId);
        }

        if (userId) {
            filter.userId = mongoose.Types.ObjectId(userId);
        }

        // Get bookings with details
        const bookings = await Booking.find(filter)
            .populate('userId', 'name email')
            .populate('eventId', 'title date location price category');

        // Format booking data (defensive for missing references)
        const bookingReportData = bookings.map(booking => ({
            bookingId: booking._id,
            userName: booking.userId?.name || 'Unknown User',
            userEmail: booking.userId?.email || 'unknown@example.com',
            eventName: booking.eventId?.title || 'Deleted Event',
            eventCategory: booking.eventId?.category || 'N/A',
            eventDate: booking.eventId?.date || booking.bookingDate,
            location: booking.eventId?.location || 'Unknown Location',
            ticketsBooked: booking.tickets || 0,
            pricePerTicket: booking.eventId?.price || 0,
            totalPrice: booking.totalPrice || 0,
            status: booking.status || 'unknown',
            bookingDate: booking.bookingDate,
            approvedDate: booking.approvedDate
        }));

        // Calculate summary
        const totalBookings = bookingReportData.length;
        const approvedBookings = bookingReportData.filter(b => b.status === 'approved').length;
        const pendingBookings = bookingReportData.filter(b => b.status === 'pending').length;
        const rejectedBookings = bookingReportData.filter(b => b.status === 'rejected').length;
        const totalTickets = bookingReportData.reduce((sum, b) => sum + b.ticketsBooked, 0);
        const totalRevenue = bookingReportData
            .filter(b => b.status === 'approved')
            .reduce((sum, b) => sum + b.totalPrice, 0);

        res.status(200).json({
            success: true,
            reportType: 'Booking Report',
            reportDate: new Date().toISOString(),
            summary: {
                totalBookings,
                approvedBookings,
                pendingBookings,
                rejectedBookings,
                totalTickets,
                totalRevenue,
                conversionRate: totalBookings > 0 ? ((approvedBookings / totalBookings) * 100).toFixed(2) + '%' : '0%'
            },
            data: bookingReportData
        });
    } catch (error) {
        console.error('Booking report generation error', error);
        res.status(500).json({
            success: false,
            message: 'Error generating booking report',
            error: error.message,
            stack: error.stack
        });
    }
};

// Generate Revenue Report
exports.generateRevenueReport = async(req, res) => {
    try {
        const { startDate, endDate, category } = req.query;

        // Build filter for bookings
        let bookingFilter = { status: 'approved' };

        if (startDate && endDate) {
            bookingFilter.bookingDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Get revenue data by event
        const revenueByEvent = await Booking.aggregate([
            { $match: bookingFilter },
            {
                $lookup: {
                    from: 'events',
                    localField: 'eventId',
                    foreignField: '_id',
                    as: 'eventDetails'
                }
            },
            { $unwind: '$eventDetails' },
            {
                $group: {
                    _id: {
                        eventId: '$eventId',
                        eventName: '$eventDetails.title',
                        category: '$eventDetails.category'
                    },
                    totalTickets: { $sum: '$tickets' },
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
                    eventId: '$_id.eventId',
                    eventName: '$_id.eventName',
                    category: '$_id.category',
                    totalTickets: 1,
                    bookingCount: 1,
                    totalRevenue: 1
                }
            }
        ]);

        // Get revenue data by category
        const revenueByCategory = await Booking.aggregate([
            { $match: bookingFilter },
            {
                $lookup: {
                    from: 'events',
                    localField: 'eventId',
                    foreignField: '_id',
                    as: 'eventDetails'
                }
            },
            { $unwind: '$eventDetails' },
            {
                $group: {
                    _id: '$eventDetails.category',
                    totalRevenue: { $sum: '$totalPrice' },
                    bookingCount: { $sum: 1 },
                    totalTickets: { $sum: '$tickets' }
                }
            },
            {
                $sort: { totalRevenue: -1 }
            },
            {
                $project: {
                    _id: 0,
                    category: '$_id',
                    totalRevenue: 1,
                    bookingCount: 1,
                    totalTickets: 1
                }
            }
        ]);

        // Get monthly revenue trend
        const monthlyRevenue = await Booking.aggregate([
            { $match: bookingFilter },
            {
                $group: {
                    _id: {
                        year: { $year: '$bookingDate' },
                        month: { $month: '$bookingDate' }
                    },
                    revenue: { $sum: '$totalPrice' },
                    bookingCount: { $sum: 1 }
                }
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $arrayElemAt: [
                            [
                                'January', 'February', 'March', 'April', 'May', 'June',
                                'July', 'August', 'September', 'October', 'November', 'December'
                            ],
                            { $subtract: ['$_id.month', 1] }
                        ]
                    },
                    revenue: 1,
                    bookingCount: 1
                }
            }
        ]);

        // Calculate summary
        const totalRevenue = revenueByEvent.reduce((sum, e) => sum + e.totalRevenue, 0);
        const totalBookings = revenueByEvent.reduce((sum, e) => sum + e.bookingCount, 0);
        const totalTickets = revenueByEvent.reduce((sum, e) => sum + e.totalTickets, 0);
        const averageRevenuePerEvent = totalRevenue / revenueByEvent.length || 0;
        const averageRevenuePerBooking = totalRevenue / totalBookings || 0;

        res.status(200).json({
            success: true,
            reportType: 'Revenue Report',
            reportDate: new Date().toISOString(),
            summary: {
                totalRevenue: totalRevenue.toFixed(2),
                totalBookings,
                totalTickets,
                averageRevenuePerEvent: averageRevenuePerEvent.toFixed(2),
                averageRevenuePerBooking: averageRevenuePerBooking.toFixed(2),
                topCategory: revenueByCategory.length > 0 ? revenueByCategory[0].category : 'N/A'
            },
            data: revenueByEvent,
            revenueByEvent,
            revenueByCategory,
            monthlyRevenue
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating revenue report',
            error: error.message
        });
    }
};

// Generate User Activity Report
exports.generateUserActivityReport = async(req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build filter
        let filter = {};

        if (startDate && endDate) {
            filter.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        // Get user booking activity
        const userActivity = await Booking.aggregate([
            { $match: { bookingDate: filter.createdAt || {} } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $group: {
                    _id: {
                        userId: '$userId',
                        userName: '$userDetails.name',
                        email: '$userDetails.email'
                    },
                    totalBookings: { $sum: 1 },
                    approvedBookings: {
                        $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] }
                    },
                    totalSpent: {
                        $sum: { $cond: [{ $eq: ['$status', 'approved'] }, '$totalPrice', 0] }
                    },
                    totalTickets: { $sum: '$tickets' }
                }
            },
            {
                $sort: { totalSpent: -1 }
            },
            {
                $project: {
                    _id: 0,
                    userId: '$_id.userId',
                    userName: '$_id.userName',
                    email: '$_id.email',
                    totalBookings: 1,
                    approvedBookings: 1,
                    totalSpent: 1,
                    totalTickets: 1
                }
            }
        ]);

        // Summary
        const totalUsers = userActivity.length;
        const totalBookings = userActivity.reduce((sum, u) => sum + u.totalBookings, 0);
        const totalApprovedBookings = userActivity.reduce((sum, u) => sum + u.approvedBookings, 0);
        const totalSpent = userActivity.reduce((sum, u) => sum + u.totalSpent, 0);

        res.status(200).json({
            success: true,
            reportType: 'User Activity Report',
            reportDate: new Date().toISOString(),
            summary: {
                totalUsers,
                totalBookings,
                totalApprovedBookings,
                totalSpent,
                averageSpentPerUser: (totalSpent / totalUsers || 0).toFixed(2)
            },
            data: userActivity
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating user activity report',
            error: error.message
        });
    }
};

// Export Report Data (Generic endpoint to export any report)
exports.exportReportData = async(req, res) => {
    try {
        const { reportType, startDate, endDate, category, eventId, status, userId } = req.query;

        let reportData = {};

        switch (reportType) {
            case 'event':
                // Get event report data
                const eventFilter = {};
                if (startDate && endDate) {
                    eventFilter.createdAt = {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    };
                }
                if (category) eventFilter.category = category;
                if (eventId) eventFilter._id = mongoose.Types.ObjectId(eventId);

                const events = await Event.find(eventFilter);
                reportData = await Promise.all(
                    events.map(async(event) => {
                        const bookings = await Booking.find({
                            eventId: event._id,
                            status: 'approved'
                        });
                        return {
                            eventName: event.title,
                            date: event.date,
                            location: event.location,
                            totalBookings: bookings.length,
                            totalRevenue: bookings.reduce((sum, b) => sum + b.totalPrice, 0)
                        };
                    })
                );
                break;

            case 'booking':
                const bookingFilter = {};
                if (startDate && endDate) {
                    bookingFilter.bookingDate = {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    };
                }
                if (status) bookingFilter.status = status;
                if (eventId) bookingFilter.eventId = mongoose.Types.ObjectId(eventId);
                if (userId) bookingFilter.userId = mongoose.Types.ObjectId(userId);

                reportData = await Booking.find(bookingFilter)
                    .populate('userId', 'name email')
                    .populate('eventId', 'title date price');
                break;

            case 'revenue':
                const revenueFilter = { status: 'approved' };
                if (startDate && endDate) {
                    revenueFilter.bookingDate = {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    };
                }

                reportData = await Booking.find(revenueFilter)
                    .populate('eventId', 'title category price')
                    .select('eventId totalPrice status bookingDate');
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid report type. Use: event, booking, or revenue'
                });
        }

        res.status(200).json({
            success: true,
            reportType,
            exportDate: new Date().toISOString(),
            data: reportData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error exporting report data',
            error: error.message
        });
    }
};