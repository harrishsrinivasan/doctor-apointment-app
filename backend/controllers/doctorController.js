const Doctor = require('../models/Doctor');
const Booking = require('../models/Booking');

// --- HELPER: Strip seconds & milliseconds for perfect matching ---
const cleanDate = (d) => {
    const date = new Date(d);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
};

// @desc    Create a new Doctor Slot (With Strict Time Sanitization)
// @route   POST /api/doctors
exports.createSlot = async (req, res) => {
    try {
        const { doctorName, specialization, startTime } = req.body;

        // 1. Sanitize the incoming time
        const cleanStartTime = cleanDate(startTime);

        // 2. Check for duplicates using the CLEAN time
        const existingSlot = await Doctor.findOne({ 
            doctorName: doctorName, 
            startTime: cleanStartTime 
        });

        if (existingSlot) {
            return res.status(400).json({ 
                success: false, 
                message: 'Slot already exists for this time.' 
            });
        }

        // 3. Create the slot
        const doctor = await Doctor.create({
            doctorName,
            specialization,
            startTime: cleanStartTime, // Save the sanitized time
            totalSlots: 1,
            availableSlots: 1
        });

        res.status(201).json({ success: true, data: doctor });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get Slots (Joined with Booking Details)
// @route   GET /api/doctors
exports.getSlots = async (req, res) => {
    try {
        const { name } = req.query;
        let matchStage = {};
        
        if (name) matchStage.doctorName = name;

        const doctors = await Doctor.aggregate([
            { $match: matchStage },
            { $sort: { startTime: 1 } },
            {
                $lookup: {
                    from: 'bookings', 
                    localField: '_id',
                    foreignField: 'doctorId',
                    as: 'bookingDetails'
                }
            },
            {
                $unwind: {
                    path: '$bookingDetails',
                    preserveNullAndEmptyArrays: true
                }
            }
        ]);
        
        res.status(200).json({ success: true, count: doctors.length, data: doctors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a slot (Hard Delete)
// @route   DELETE /api/doctors/:id
exports.deleteSlot = async (req, res) => {
    try {
        // Find and Delete in one step to avoid race conditions
        const slot = await Doctor.findByIdAndDelete(req.params.id);

        if (!slot) {
            return res.status(404).json({ success: false, message: 'Slot not found (already deleted?)' });
        }

        // Optional: Also delete associated bookings? 
        // await Booking.deleteMany({ doctorId: req.params.id });

        res.status(200).json({ success: true, message: 'Slot deleted successfully' });
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