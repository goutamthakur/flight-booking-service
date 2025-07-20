const express = require("express");

const router = express.Router();

const { BookingController } = require("../../controllers");

// POST /api/v1/bookings
router.post(
  "/",
  BookingController.createBooking,
);

// POST /api/v1/bookings/payment
router.post(
  "/payment",
  BookingController.makePayment,
);


module.exports = router;