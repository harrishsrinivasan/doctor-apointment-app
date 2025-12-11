const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const doctorRoutes = require('./routes/doctorRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const startCronJobs = require('./utils/cronJobs');

// Load env vars
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/doctors', doctorRoutes);
app.use('/api/bookings', bookingRoutes);

// Start Bonus Cron Jobs
startCronJobs();

// Basic Route
app.get('/', (req, res) => {
    res.send('Doctor Appointment API Running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});