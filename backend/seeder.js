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
    { name: "Dr. Meredith Grey", spec: "General Surgery" },
    { name: "Dr. Derek Shepherd", spec: "Neurology" }
];

// Helper to create a specific time on a specific day
const getDateTime = (daysFromNow, hour, minute) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    d.setHours(hour, minute, 0, 0);
    return d;
};

const generateSlots = () => {
    const slots = [];
    
    // Generate slots for Today, Tomorrow, and Day After (3 days)
    for (let day = 0; day < 3; day++) {
        doctorsList.forEach(doc => {
            
            // Loop from 10 AM (10) to 5 PM (17)
            for (let hour = 10; hour <= 17; hour++) {
                
                // 20-minute intervals: 00, 20, 40
                const minutes = [0, 20, 40];

                minutes.forEach(minute => {
                    // Stop if we go past 5:20 PM
                    if (hour === 17 && minute > 20) return;

                    // Randomly decide if this slot is already "booked" (taken)
                    // 80% chance it's free, 20% chance it's taken
                    const isAvailable = Math.random() > 0.2; 

                    slots.push({
                        doctorName: doc.name,
                        specialization: doc.spec,
                        startTime: getDateTime(day, hour, minute),
                        totalSlots: 1,      // It's a single appointment slot
                        availableSlots: isAvailable ? 1 : 0 // 1 = Free, 0 = Booked
                    });
                });
            }
        });
    }
    return slots;
};

const importData = async () => {
    try {
        await Doctor.deleteMany(); // Clear old data
        await Doctor.insertMany(generateSlots());
        console.log('✅ Generated 20-min interval slots for 3 days!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

importData();