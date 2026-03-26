const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    ticketId: {
        type: String,
        unique: true,
        required: true
    },
    bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },
    ticketNumber: {
        type: String,
        required: true
    },
    qrCode: {
        type: String, // Base64 encoded QR code image
        default: null
    },
    issuedDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['active', 'used', 'cancelled'],
        default: 'active'
    }
}, { timestamps: true });

// Index for faster queries
ticketSchema.index({ userId: 1 });
ticketSchema.index({ bookingId: 1 });
ticketSchema.index({ eventId: 1 });
ticketSchema.index({ ticketId: 1 });

module.exports = mongoose.model('Ticket', ticketSchema);