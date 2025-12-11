const cron = require('node-cron');
const Booking = require('../models/Booking');
const Doctor = require('../models/Doctor');

const startCronJobs = () => {
    // Run every minute
    cron.schedule('* * * * *', async () => {
        console.log('Running Cron: Checking for expired pending bookings...');
        
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);

        // Find bookings stuck in PENDING for > 2 mins
        const expiredBookings = await Booking.find({
            status: 'PENDING',
            createdAt: { $lt: twoMinutesAgo }
        });

        for (const booking of expiredBookings) {
            // 1. Mark booking as EXPIRED
            booking.status = 'EXPIRED';
            await booking.save();

            // 2. Release the seat back to the Doctor/Slot
            await Doctor.findByIdAndUpdate(booking.doctorId, {
                $inc: { availableSlots: booking.seatsBooked }
            });

            console.log(`Booking ${booking._id} expired. Seats released.`);
        }
    });
};

module.exports = startCronJobs;