const axios = require("axios");
const { StatusCodes } = require("http-status-codes");

const AppError = require("../utils/errors/app-error");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const { ServerConfig } = require("../config");

const bookingRepository = new BookingRepository();

async function createBooking(data) {
  try {
    // Managed transaction.
    // Rollback is done by manually throwing an error.
    const result = await db.sequelize.transaction(async function booking(t) {
      console.log("Booking transaction starts:", new Date());
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
      // Total payable amount flight ticket price * no. of seats
      const totalCost = data?.noOfSeats * flightData.price;
      // First updating the seats in the fight
      // This update must also be part of this transanction
      console.log("Updating seats in flight starts:", new Date());
      await axios.patch(
        `${ServerConfig.FLIGHT_SERVICE_API_URL}/api/v1/flights/${data?.flightId}/seats`,
        {
          seats: data?.noOfSeats,
        }
      );
      console.log("Updating seats in flight ends:", new Date());
      // Second preparing the payload and creating a booking for a user
      const bookingPayload = { ...data, totalCost };
      const booking = await bookingRepository.createBooking(bookingPayload, t);
      return booking;
    });
    console.log("Booking transaction ends:", new Date());
    return result;
  } catch (error) {
    if (error.statusCode === StatusCodes.BAD_REQUEST) {
      throw error;
    }
    throw new AppError(
      "Something went wrong while booking",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createBooking,
};
