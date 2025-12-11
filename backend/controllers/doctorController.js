const Doctor = require('../models/Doctor');

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
            availableSlots: totalSlots // Initially, available = total
        });

        res.status(201).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all available slots
// @route   GET /api/doctors
exports.getSlots = async (req, res) => {
    try {
        const doctors = await Doctor.find({});
        res.status(200).json({ success: true, count: doctors.length, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};