const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Doctor = require('./models/Doctor');

dotenv.config();

// Connect to MongoDB Atlas with proper configuration
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'doctor_appointment_db', // Use the same database name as the main app
            // MongoDB Atlas connection options
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
            socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
        });
        console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
        console.log(`📊 Database: ${conn.connection.name}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB connection error: ${error.message}`);
        console.error('Make sure your MONGO_URI is correct and your IP is whitelisted in Atlas.');
        process.exit(1);
    }
};

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
        console.log('🗑️  Clearing existing doctor slots...');
        const deleteResult = await Doctor.deleteMany({});
        console.log(`   Deleted ${deleteResult.deletedCount} existing slots`);
        
        console.log('📝 Generating new slots...');
        const slots = generateSlots();
        console.log(`   Generated ${slots.length} slots`);
        
        console.log('💾 Inserting slots into database...');
        const result = await Doctor.insertMany(slots);
        console.log(`✅ Successfully inserted ${result.length} slots!`);
        console.log('✅ Generated 20-min interval slots for 3 days!');
        
        // Close the connection
        await mongoose.connection.close();
        console.log('🔌 MongoDB connection closed.');
        process.exit(0);
    } catch (error) {
        console.error(`❌ Error during seeding: ${error.message}`);
        if (error.name === 'BulkWriteError') {
            console.error('   Some documents may have failed to insert. Check for duplicates.');
        }
        // Close connection even on error
        await mongoose.connection.close().catch(() => {});
        process.exit(1);
    }
};

// Run the seeder
(async () => {
    await connectDB();
    await importData();
})();