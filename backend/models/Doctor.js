const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    doctorName: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    totalSlots: {
        type: Number,
        required: true
    },
    availableSlots: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Optimistic locking version key (optional but good for consistency)
doctorSchema.set('versionKey', 'version');

module.exports = mongoose.model('Doctor', doctorSchema);