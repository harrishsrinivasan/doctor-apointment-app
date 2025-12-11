const Doctor = require('../models/Doctor');
const Booking = require('../models/Booking');

// @desc    Create a new Doctor Slot/Trip
// @route   POST /api/doctors
exports.createSlot = async (req, res) => {
    try {
        const { doctorName, specialization, startTime, totalSlots } = req.body;

        const doctor = await Doctor.create({
            doctorName,
            specialization,
            startTime,
            totalSlots,
            availableSlots: totalSlots
        });

        res.status(201).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all slots (Optional: Filter by name)
// @route   GET /api/doctors
exports.getSlots = async (req, res) => {
    try {
        const { name } = req.query;
        let query = {};
        
        if (name) {
            query.doctorName = name;
        }

        // Sort by time
        const doctors = await Doctor.find(query).sort({ startTime: 1 });
        
        res.status(200).json({ success: true, count: doctors.length, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a slot
// @route   DELETE /api/doctors/:id
exports.deleteSlot = async (req, res) => {
    try {
        const slot = await Doctor.findById(req.params.id);
        if (!slot) return res.status(404).json({ success: false, message: 'Slot not found' });

        await slot.deleteOne();
        res.status(200).json({ success: true, message: 'Slot deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get bookings for a specific slot
// @route   GET /api/doctors/:id/bookings
exports.getSlotBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ doctorId: req.params.id });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};