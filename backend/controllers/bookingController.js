const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const { generateTickets } = require('./ticketController');
const mongoose = require('mongoose');

// Create Booking (User Books an Event)
exports.createBooking = async(req, res) => {
    try {
        const { eventId, tickets } = req.body;
        const userId = req.user._id;

        // Validation
        if (!eventId || !tickets) {
            return res.status(400).json({
                success: false,
                message: 'Please provide event ID and number of tickets'
            });
        }

        // Check if event exists
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if event date has passed
        if (new Date(event.date) < new Date()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot book for past events'
            });
        }

        // Check if enough tickets are available
        const bookedTickets = await Booking.aggregate([
            { $match: { eventId: new mongoose.Types.ObjectId(eventId), status: 'approved' } },
            { $group: { _id: null, totalTickets: { $sum: '$tickets' } } }
        ]);

        const totalBookedTickets = bookedTickets.length > 0 ? bookedTickets[0].totalTickets : 0;
        const availableTickets = event.maxParticipants - totalBookedTickets;

        if (tickets > availableTickets) {
            return res.status(400).json({
                success: false,
                message: `Only ${availableTickets} tickets available`
            });
        }

        // Calculate total price
        const totalPrice = event.price * tickets;

        // Create booking
        const booking = await Booking.create({
            userId,
            eventId,
            tickets,
            totalPrice,
            status: 'pending'
        });

        // Populate references
        await booking.populate('userId', 'name email');
        await booking.populate('eventId', 'title date location price');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully. Awaiting admin approval.',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating booking',
            error: error.message
        });
    }
};

// Get All Bookings for Current User
exports.getUserBookings = async(req, res) => {
    try {
        const userId = req.user._id;

        const bookings = await Booking.find({ userId })
            .populate('userId', 'name email')
            .populate('eventId', 'title date location price')
            .sort({ bookingDate: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};

// Get All Bookings (Admin Only)
exports.getAllBookings = async(req, res) => {
    try {
        const { status, eventId } = req.query;

        // Build filter
        let filter = {};

        if (status) {
            filter.status = status;
        }

        if (eventId) {
            filter.eventId = eventId;
        }

        const bookings = await Booking.find(filter)
            .populate('userId', 'name email')
            .populate('eventId', 'title date location price')
            .sort({ bookingDate: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching bookings',
            error: error.message
        });
    }
};

// Get Single Booking by ID
exports.getBookingById = async(req, res) => {
    try {
        const { id } = req.params;

        const booking = await Booking.findById(id)
            .populate('userId', 'name email')
            .populate('eventId', 'title date location price');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user is the booking owner or admin
        if (booking.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this booking'
            });
        }

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking',
            error: error.message
        });
    }
};

// Approve Booking (Admin Only)
exports.approveBooking = async(req, res) => {
    try {
        const { id } = req.params;

        // Check if booking exists
        let booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if already processed
        if (booking.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Booking is already ${booking.status}`
            });
        }

        // Update booking status
        booking = await Booking.findByIdAndUpdate(
                id, {
                    status: 'approved',
                    approvedDate: new Date()
                }, { new: true }
            )
            .populate('userId', 'name email')
            .populate('eventId', 'title date location price');

        // Generate tickets for the booking
        try {
            const tickets = await generateTickets(id);
            console.log(`Generated ${tickets.length} tickets for booking ${id}`);
        } catch (ticketError) {
            console.error('Error generating tickets:', ticketError);
            // Don't fail the approval if ticket generation fails
        }

        res.status(200).json({
            success: true,
            message: 'Booking approved successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error approving booking',
            error: error.message
        });
    }
};

// Reject Booking (Admin Only)
exports.rejectBooking = async(req, res) => {
    try {
        const { id } = req.params;
        const { rejectionReason } = req.body;

        // Check if booking exists
        let booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if already processed
        if (booking.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Booking is already ${booking.status}`
            });
        }

        // Update booking status
        booking = await Booking.findByIdAndUpdate(
                id, {
                    status: 'rejected',
                    rejectionReason: rejectionReason || 'No reason provided',
                    approvedDate: new Date()
                }, { new: true }
            )
            .populate('userId', 'name email')
            .populate('eventId', 'title date location price');

        res.status(200).json({
            success: true,
            message: 'Booking rejected successfully',
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error rejecting booking',
            error: error.message
        });
    }
};

// Cancel Booking (User can cancel only pending bookings)
exports.cancelBooking = async(req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        // Check if booking exists
        const booking = await Booking.findById(id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Check if user is the booking owner
        if (booking.userId.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to cancel this booking'
            });
        }

        // Only allow cancellation of pending bookings
        if (booking.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: `Cannot cancel ${booking.status} bookings`
            });
        }

        // Delete booking
        await Booking.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error cancelling booking',
            error: error.message
        });
    }
};

// Get Booking Statistics (Admin)
exports.getBookingStats = async(req, res) => {
    try {
        const totalBookings = await Booking.countDocuments();
        const pendingBookings = await Booking.countDocuments({ status: 'pending' });
        const approvedBookings = await Booking.countDocuments({ status: 'approved' });
        const rejectedBookings = await Booking.countDocuments({ status: 'rejected' });

        const totalRevenue = await Booking.aggregate([
            { $match: { status: 'approved' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalBookings,
                pendingBookings,
                approvedBookings,
                rejectedBookings,
                totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching booking statistics',
            error: error.message
        });
    }
};