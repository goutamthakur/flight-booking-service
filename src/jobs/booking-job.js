const cron = require("node-cron");

const { BookingService } = require("../services");

function cancelOldBookings() {
  // Cancel old bookings every 30 minutes
  // So in every 30 minutes all the bookings which are not booked or cancelled is cancelled
  cron.schedule("*/30 * * * *", async () => {
    await BookingService.cancelOldBooking();
  });
}

module.exports = cancelOldBookings;
