const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const doctorRoutes = require('./routes/doctorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
// const startCronJobs = require('./utils/cronJobs'); // Optional: Cron jobs don't run easily on Vercel free tier

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// CORS Configuration - Allow access from anywhere (or specify your frontend URL)
app.use(cors({
    origin: '*', // CHANGE THIS to your specific frontend URL in production for security
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/bookings', bookingRoutes);

// Basic Route for Testing
app.get('/', (req, res) => {
    res.send('Doctor Appointment API is Running...');
});

// Start Cron Jobs (Optional - Note: serverless functions freeze, so crons might not work as expected)
// startCronJobs(); 

// --- VERCEL DEPLOYMENT CONFIGURATION ---

// 1. Export the app (Vercel requires this to turn it into a serverless function)
module.exports = app;

// 2. Only listen to port if NOT running on Vercel (Local Development)
if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}