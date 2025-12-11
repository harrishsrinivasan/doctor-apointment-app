const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    userEmail: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'CONFIRMED', 'FAILED', 'EXPIRED'],
        default: 'PENDING'
    },
    seatsBooked: {
        type: Number,
        default: 1
    }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);