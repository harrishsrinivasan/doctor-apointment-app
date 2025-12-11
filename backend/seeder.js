const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding...'))
    .catch(err => { console.error(err); process.exit(1); });

const doctorsList = [
    { name: "Dr. Gregory House", spec: "Diagnostics" },
    { name: "Dr. Shaun Murphy", spec: "General Surgeon" },
    { name: "Dr. Stephen Strange", spec: "Neurosurgeon" },
    { name: "Dr. Meredith Grey", spec: "General Surgery" }
];

// Helper to create dates
const getDate = (daysFromNow, hour) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hour, 0, 0, 0);
    return d;
};

const generateSlots = () => {
    const slots = [];
    doctorsList.forEach(doc => {
        // Create 3 days of slots for each doctor
        for (let day = 0; day < 3; day++) {
            // Morning Slot (10 AM)
            slots.push({
                doctorName: doc.name,
                specialization: doc.spec,
                startTime: getDate(day, 10),
                totalSlots: 5,
                availableSlots: 5
            });
            // Afternoon Slot (2 PM)
            slots.push({
                doctorName: doc.name,
                specialization: doc.spec,
                startTime: getDate(day, 14),
                totalSlots: 5,
                availableSlots: Math.floor(Math.random() * 5) // Random availability
            });
            // Evening Slot (5 PM)
            slots.push({
                doctorName: doc.name,
                specialization: doc.spec,
                startTime: getDate(day, 17),
                totalSlots: 5,
                availableSlots: 5
            });
        }
    });
    return slots;
};

const importData = async () => {
    try {
        await Doctor.deleteMany(); // Clear old data
        await Doctor.insertMany(generateSlots());
        console.log('✅ Doctors & Slots Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();