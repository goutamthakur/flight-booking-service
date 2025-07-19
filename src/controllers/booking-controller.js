const { StatusCodes } = require("http-status-codes");

const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { BookingService } = require("../services");

async function createBooking(req, res) {
  try {
    console.log("req.body", req.body);
    const booking = await BookingService.createBooking(req.body);
    SuccessResponse.message = "Successfully created booking";
    SuccessResponse.data = booking;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createBooking,
};
