const Event = require('../models/Event');

// Create Event (Admin Only)
exports.createEvent = async(req, res) => {
    try {
        const { title, description, category, date, time, location, price, maxParticipants, image } = req.body;

        // Validation
        if (!title || !description || !category || !date || !time || !location || !price || !maxParticipants) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Create event
        const event = await Event.create({
            title,
            description,
            category,
            date,
            time,
            location,
            price,
            maxParticipants,
            image: image || 'https://via.placeholder.com/500x300?text=Event+Image',
            createdBy: req.user._id
        });

        // Populate createdBy field
        await event.populate('createdBy', 'name email');

        res.status(201).json({
            success: true,
            message: 'Event created successfully',
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating event',
            error: error.message
        });
    }
};

// Get All Events
exports.getAllEvents = async(req, res) => {
    try {
        const { category, search } = req.query;

        // Build filter
        let filter = {};

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } }
            ];
        }

        const events = await Event.find(filter)
            .populate('createdBy', 'name email')
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
};

// Get Single Event by ID
exports.getEventById = async(req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id).populate('createdBy', 'name email');

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        res.status(200).json({
            success: true,
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching event',
            error: error.message
        });
    }
};

// Update Event (Admin Only)
exports.updateEvent = async(req, res) => {
    try {
        const { id } = req.params;
        const { title, description, category, date, time, location, price, maxParticipants, image } = req.body;

        // Check if event exists
        let event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is the creator or admin
        if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this event'
            });
        }

        // Update event
        event = await Event.findByIdAndUpdate(
            id, {
                title: title || event.title,
                description: description || event.description,
                category: category || event.category,
                date: date || event.date,
                time: time || event.time,
                location: location || event.location,
                price: price !== undefined ? price : event.price,
                maxParticipants: maxParticipants || event.maxParticipants,
                image: image || event.image
            }, { new: true, runValidators: true }
        ).populate('createdBy', 'name email');

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            data: event
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating event',
            error: error.message
        });
    }
};

// Delete Event (Admin Only)
exports.deleteEvent = async(req, res) => {
    try {
        const { id } = req.params;

        // Check if event exists
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({
                success: false,
                message: 'Event not found'
            });
        }

        // Check if user is the creator or admin
        if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this event'
            });
        }

        // Delete event
        await Event.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Event deleted successfully',
            data: {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting event',
            error: error.message
        });
    }
};

// Get Events by Category
exports.getEventsByCategory = async(req, res) => {
    try {
        const { category } = req.params;

        const events = await Event.find({ category })
            .populate('createdBy', 'name email')
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: events.length,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching events',
            error: error.message
        });
    }
};