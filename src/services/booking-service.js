const axios = require("axios");
const { StatusCodes } = require("http-status-codes");

const AppError = require("../utils/errors/app-error");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const { ServerConfig } = require("../config");
const { Enums } = require("../utils/common");
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;
const { Logger } = require("../config");

const bookingRepository = new BookingRepository();

async function createBooking(data) {
  try {
    // Managed transaction.
    // Rollback is done by manually throwing an error.
    const result = await db.sequelize.transaction(async function booking(t) {
      const flight = await axios.get(
        `${ServerConfig.FLIGHT_SERVICE_API_URL}/api/v1/flights/${data?.flightId}`
      );
      const flightData = flight.data.data;
      if (data?.noOfSeats > flightData.totalSeats) {
        throw new AppError(
          "Number of seats more than the available seats",
          StatusCodes.BAD_REQUEST
        );
      }

      // Booking is created with status initiated and seats have been put on hold
      const totalCost = data?.noOfSeats * flightData.price;
      const bookingPayload = { ...data, totalCost };
      const booking = await bookingRepository.createBooking(bookingPayload, t);

      const updateFlightSeats = await axios.patch(
        `${ServerConfig.FLIGHT_SERVICE_API_URL}/api/v1/flights/${data?.flightId}/seats`,
        {
          seats: data?.noOfSeats,
        }
      );

      if (updateFlightSeats.data.success) {
        return booking;
      } else {
        throw new AppError(
          "Error updating flight seats",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    });
    return result;
  } catch (error) {
    if (
      error.statusCode === StatusCodes.BAD_REQUEST ||
      error.statusCode === StatusCodes.INTERNAL_SERVER_ERROR
    ) {
      throw error;
    }
    throw new AppError(
      "Something went wrong while booking",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function makePayment(data) {
  const bookingId = parseInt(data.bookingId);
  const userId = parseInt(data.userId);
  const amount = parseFloat(data.amount);

  const t = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.getBooking(bookingId, t);
    if (bookingDetails.status === CANCELLED) {
      throw new AppError(
        "Booking is already cancelled",
        StatusCodes.BAD_REQUEST
      );
    }
    const bookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date();

    if (currentTime - bookingTime > 600000) {
      // Releasing the seats by the booking
      const updateFlightSeats = await axios.patch(
        `${ServerConfig.FLIGHT_SERVICE_API_URL}/api/v1/flights/${bookingDetails?.flightId}/seats`,
        {
          seats: bookingDetails.noOfSeats,
          dec: false,
        }
      );
      // Updating the status of booking to cancelled
      if (updateFlightSeats.data.success) {
        await bookingRepository.update(bookingId, { status: CANCELLED });
        throw new AppError(
          "Booking cancelled due to late payment request",
          StatusCodes.BAD_REQUEST
        );
      } else {
        throw new AppError(
          "Error updating flight seats",
          StatusCodes.INTERNAL_SERVER_ERROR
        );
      }
    }
    if (userId != bookingDetails.userId) {
      throw new AppError(
        "Booking does not belongs to user id",
        StatusCodes.BAD_REQUEST
      );
    }
    if (amount != bookingDetails.totalCost) {
      throw new AppError(
        "Amount does not match the booking amount",
        StatusCodes.BAD_REQUEST
      );
    }
    // Hitting some third-party payment provider
    // Assuming payment is done
    const updatedBooking = await bookingRepository.updateBooking(
      bookingId,
      { status: BOOKED },
      t
    );
    await t.commit();
    return updatedBooking;
  } catch (error) {
    await t.rollback();
    if (
      error.statusCode === StatusCodes.BAD_REQUEST ||
      error.statusCode === StatusCodes.NOT_FOUND ||
      error.statusCode === StatusCodes.INTERNAL_SERVER_ERROR
    ) {
      throw error;
    }
    throw new AppError(
      "Something went wrong while booking",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function cancelOldBooking() {
  try {
    // time is 10 minutes behind from current time
    // cancel all the bookings which are less than this time
    const time = new Date(Date.now() - 10 * 60 * 1000);
    const response = await bookingRepository.cancelOldBooking(time);
  } catch (error) {
    Logger.error(`booking-service > cancelOldBooking > ${error}`);
  }
}

module.exports = {
  createBooking,
  makePayment,
  cancelOldBooking,
};
