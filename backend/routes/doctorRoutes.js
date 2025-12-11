const express = require('express');
const router = express.Router();
const { createSlot, getSlots, deleteSlot, getSlotBookings } = require('../controllers/doctorController');

router.post('/', createSlot);
router.get('/', getSlots);
router.delete('/:id', deleteSlot);            // New Delete Route
router.get('/:id/bookings', getSlotBookings); // New View Bookings Route

module.exports = router;