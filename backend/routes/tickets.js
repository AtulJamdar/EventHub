const express = require('express');
const {
    getUserTickets,
    downloadTicketPDF,
    getTicketById
} = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// User routes (Protected)
router.get('/user/my-tickets', protect, getUserTickets);
router.get('/:ticketId', protect, getTicketById);
router.get('/:ticketId/download', protect, downloadTicketPDF);

module.exports = router;