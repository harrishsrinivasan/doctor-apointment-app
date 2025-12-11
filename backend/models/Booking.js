const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    // Changed from just email to full patient details
    patientName: { type: String, required: true },
    patientEmail: { type: String, required: true },
    patientAge: { type: Number, required: true },
    patientGender: { type: String, required: true },
    reasonForVisit: { type: String },
    
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