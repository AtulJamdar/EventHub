const Ticket = require('../models/Ticket');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const User = require('../models/User');
const PDFDocument = require('pdfkit');
const QRCode = require('qrcode');
const crypto = require('crypto');

// Generate Tickets for a Booking
exports.generateTickets = async (bookingId) => {
    try {
        const booking = await Booking.findById(bookingId).populate('userId eventId');
        if (!booking || booking.status !== 'approved') {
            throw new Error('Booking not found or not approved');
        }

        const tickets = [];
        for (let i = 1; i <= booking.tickets; i++) {
            const ticketId = crypto.randomUUID();
            const ticketNumber = `TKT-${bookingId.toString().slice(-6)}-${i.toString().padStart(3, '0')}`;

            // Generate QR Code
            const qrData = JSON.stringify({
                ticketId,
                bookingId: booking._id,
                userId: booking.userId._id,
                eventId: booking.eventId._id,
                ticketNumber
            });
            const qrCode = await QRCode.toDataURL(qrData);

            const ticket = await Ticket.create({
                ticketId,
                bookingId: booking._id,
                userId: booking.userId._id,
                eventId: booking.eventId._id,
                ticketNumber,
                qrCode
            });

            tickets.push(ticket);
        }

        return tickets;
    } catch (error) {
        throw error;
    }
};

// Get User Tickets
exports.getUserTickets = async (req, res) => {
    try {
        const userId = req.user._id;

        const tickets = await Ticket.find({ userId })
            .populate('bookingId', 'tickets totalPrice status bookingDate')
            .populate('eventId', 'title date location price')
            .sort({ issuedDate: -1 });

        res.status(200).json({
            success: true,
            count: tickets.length,
            data: tickets
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching tickets',
            error: error.message
        });
    }
};

// Download Ticket PDF
exports.downloadTicketPDF = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const userId = req.user._id;

        const ticket = await Ticket.findOne({ ticketId, userId })
            .populate('bookingId', 'tickets totalPrice status bookingDate')
            .populate('eventId', 'title date location price organizer')
            .populate('userId', 'name email');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        // Create PDF
        const doc = new PDFDocument({ size: 'A4', margin: 50 });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=ticket-${ticket.ticketNumber}.pdf`);

        // Pipe PDF to response
        doc.pipe(res);

        // Add content to PDF
        doc.fontSize(20).text('Event Ticket', { align: 'center' });
        doc.moveDown();

        doc.fontSize(14).text(`Ticket Number: ${ticket.ticketNumber}`);
        doc.text(`Event: ${ticket.eventId.title}`);
        doc.text(`Date: ${new Date(ticket.eventId.date).toLocaleDateString()}`);
        doc.text(`Location: ${ticket.eventId.location}`);
        doc.text(`Price: $${ticket.eventId.price}`);
        doc.text(`Purchased by: ${ticket.userId.name}`);
        doc.text(`Email: ${ticket.userId.email}`);
        doc.text(`Issued Date: ${new Date(ticket.issuedDate).toLocaleDateString()}`);
        doc.moveDown();

        // Add QR Code if available
        if (ticket.qrCode) {
            const qrBuffer = Buffer.from(ticket.qrCode.split(',')[1], 'base64');
            doc.image(qrBuffer, { width: 100, align: 'center' });
        }

        doc.end();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error generating PDF',
            error: error.message
        });
    }
};

// Get Ticket by ID
exports.getTicketById = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const userId = req.user._id;

        const ticket = await Ticket.findOne({ ticketId, userId })
            .populate('bookingId', 'tickets totalPrice status bookingDate')
            .populate('eventId', 'title date location price organizer')
            .populate('userId', 'name email');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: 'Ticket not found'
            });
        }

        res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching ticket',
            error: error.message
        });
    }
};