const express = require('express');
const router = express.Router();
const { bookSlot } = require('../controllers/bookingController');

router.post('/', bookSlot);

module.exports = router;