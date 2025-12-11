const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding...'))
    .catch(err => { console.error(err); process.exit(1); });

const seedDoctors = [
    {
        doctorName: "Dr. Gregory House",
        specialization: "Diagnostics",
        startTime: new Date(new Date().setHours(10, 0, 0, 0) + 86400000), // Tomorrow 10 AM
        totalSlots: 3,
        availableSlots: 3
    },
    {
        doctorName: "Dr. Shaun Murphy",
        specialization: "Surgeon",
        startTime: new Date(new Date().setHours(14, 0, 0, 0) + 86400000), // Tomorrow 2 PM
        totalSlots: 5,
        availableSlots: 5
    },
    {
        doctorName: "Dr. Strange",
        specialization: "Neurosurgeon",
        startTime: new Date(new Date().setHours(16, 30, 0, 0) + 86400000), // Tomorrow 4:30 PM
        totalSlots: 2,
        availableSlots: 2
    },
    {
        doctorName: "Dr. Meredith Grey",
        specialization: "General Surgery",
        startTime: new Date(new Date().setHours(9, 0, 0, 0) + 172800000), // Day after tmrw 9 AM
        totalSlots: 10,
        availableSlots: 10
    },
    {
        doctorName: "Dr. Derek Shepherd",
        specialization: "Neurology",
        startTime: new Date(new Date().setHours(11, 0, 0, 0) + 172800000), 
        totalSlots: 4,
        availableSlots: 4
    },
    {
        doctorName: "Dr. Cristina Yang",
        specialization: "Cardiology",
        startTime: new Date(new Date().setHours(13, 15, 0, 0) + 86400000), 
        totalSlots: 6,
        availableSlots: 6
    }
];

const importData = async () => {
    try {
        await Doctor.deleteMany(); // Clear existing
        await Doctor.insertMany(seedDoctors);
        console.log('Data Imported Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();