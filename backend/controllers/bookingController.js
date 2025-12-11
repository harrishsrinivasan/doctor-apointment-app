const Doctor = require('../models/Doctor');
const Booking = require('../models/Booking');

// @desc    Book a slot
// @route   POST /api/bookings
exports.bookSlot = async (req, res) => {
    const { doctorId, userEmail } = req.body;
    const seatsToBook = 1; // Default 1 seat per request

    try {
        /* CONCURRENCY HANDLING STRATEGY:
           We use 'findOneAndUpdate' with a query filter that checks 
           if 'availableSlots' is greater than 0.
           
           This is an Atomic Operation in MongoDB. 
           If two users hit this endpoint at the exact same time for the last seat:
           - User A's query matches (slots > 0) -> decrements slot -> returns document.
           - User B's query fails (slots is now 0) -> returns null.
        */

        const updatedSlot = await Doctor.findOneAndUpdate(
            { 
                _id: doctorId, 
                availableSlots: { $gte: seatsToBook } // Condition: Must have enough seats
            },
            { 
                $inc: { availableSlots: -seatsToBook } // Atomic Decrement
            },
            { new: true } // Return the updated document
        );

        // If no document was returned, it means overbooking occurred or ID is invalid
        if (!updatedSlot) {
            return res.status(400).json({
                success: false,
                message: 'Booking Failed: Slot full or unavailable',
                status: 'FAILED'
            });
        }

        // 2. Create the Booking Record (PENDING)
        // In a real payment flow, this stays PENDING until payment webhook
        // For this simulation, we mark it CONFIRMED immediately or PENDING if simulating payment
        const booking = await Booking.create({
            doctorId,
            userEmail,
            seatsBooked: seatsToBook,
            status: 'CONFIRMED' // Changed to confirmed as seat is secured
        });

        res.status(201).json({
            success: true,
            message: 'Booking Confirmed',
            bookingId: booking._id,
            remainingSlots: updatedSlot.availableSlots
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};