const Doctor = require('../models/Doctor');
const Booking = require('../models/Booking');

exports.bookSlot = async (req, res) => {
    // Destructure new fields
    const { doctorId, patientName, patientEmail, patientAge, patientGender, reasonForVisit } = req.body;
    const seatsToBook = 1;

    try {
        // 1. Atomic Check & Update for Slot Availability
        const updatedSlot = await Doctor.findOneAndUpdate(
            { _id: doctorId, availableSlots: { $gte: seatsToBook } },
            { $inc: { availableSlots: -seatsToBook } },
            { new: true }
        );

        if (!updatedSlot) {
            return res.status(400).json({
                success: false,
                message: 'Booking Failed: Slot full or unavailable'
            });
        }

        // 2. Create Booking with Patient Details
        const booking = await Booking.create({
            doctorId,
            patientName,
            patientEmail,
            patientAge,
            patientGender,
            reasonForVisit,
            status: 'CONFIRMED'
        });

        res.status(201).json({
            success: true,
            message: 'Appointment Confirmed',
            bookingId: booking._id
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};