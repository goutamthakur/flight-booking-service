const express = require("express");

const router = express.Router();

const { BookingController } = require("../../controllers");

// POST /api/v1/bookings
router.post(
  "/",
  BookingController.createBooking,
);


module.exports = router;