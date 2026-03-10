const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide event title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide event description'],
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    category: {
        type: String,
        required: [true, 'Please provide event category'],
        enum: ['Conference', 'Workshop', 'Seminar', 'Webinar', 'Networking', 'Sports', 'Entertainment', 'Other'],
        default: 'Other'
    },
    date: {
        type: Date,
        required: [true, 'Please provide event date']
    },
    time: {
        type: String,
        required: [true, 'Please provide event time'],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please provide time in HH:MM format']
    },
    location: {
        type: String,
        required: [true, 'Please provide event location'],
        maxlength: [100, 'Location cannot be more than 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide ticket price'],
        min: [0, 'Price cannot be negative']
    },
    maxParticipants: {
        type: Number,
        required: [true, 'Please provide max participants'],
        min: [1, 'Max participants must be at least 1']
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/500x300?text=Event+Image'
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index for faster queries
eventSchema.index({ category: 1 });
eventSchema.index({ createdBy: 1 });
eventSchema.index({ date: 1 });

module.exports = mongoose.model('Event', eventSchema);