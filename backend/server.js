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

// CORS Configuration - Allow access from frontend URL
// Set FRONTEND_URL environment variable in Vercel to your frontend domain
// Example: https://your-frontend-app.vercel.app
const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:3000',
    'http://localhost:3001'
].filter(Boolean); // Remove undefined values

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);
        
        // In development, allow all origins
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        
        // In production, check against allowed origins
        if (allowedOrigins.length === 0) {
            // If no FRONTEND_URL is set, allow all (less secure but works)
            // TODO: Set FRONTEND_URL in Vercel environment variables for better security
            console.warn('FRONTEND_URL not set. Allowing all origins. Set FRONTEND_URL in Vercel for better security.');
            return callback(null, true);
        }
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked origin: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
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