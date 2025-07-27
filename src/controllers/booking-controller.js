const { StatusCodes } = require("http-status-codes");

const { SuccessResponse, ErrorResponse } = require("../utils/common");
const { BookingService } = require("../services");
const AppError = require("../utils/errors/app-error");

async function createBooking(req, res) {
  try {
    const booking = await BookingService.createBooking(req.body);
    SuccessResponse.message = "Successfully created booking";
    SuccessResponse.data = booking;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function makePayment(req, res) {
  try {
    const idempotentKey = req.headers["x-idempotent-key"];
    if (!idempotentKey) {
      throw new AppError(
        "Idempotent key missing in the request",
        StatusCodes.BAD_REQUEST
      );
    }
    // Check if idepontent key is already present in db or cache
    // if present then validate it use some hashing technique to server can know it is valid
    // if invalid return or if already presend in db or cache return
    const booking = await BookingService.makePayment(req.body);
    SuccessResponse.message = "Successfully made payment for booking";
    SuccessResponse.data = booking;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createBooking,
  makePayment,
};
