const { StatusCodes } = require("http-status-codes");

const CrudRepository = require("./crud-repository");

const { booking } = require("../models");
const AppError = require("../utils/errors/app-error");

class BookingRepository extends CrudRepository {
  constructor() {
    super(booking);
  }

  async createBooking(data, transaction) {
    const response = await booking.create(data, { transaction: transaction });
    return response;
  }

  async getBooking(id, transaction) {
    const response = await booking.findByPk(id, {
      transaction: transaction,
    });
    if (!response) {
      throw new AppError("Not able to find the booking", StatusCodes.NOT_FOUND);
    }
    return response;
  }

  async updateBooking(id, data, transaction) {
    const response = await booking.update(data, {
      where: {
        id: id,
      },
      transaction: transaction,
    });
    if (!response) {
      throw new AppError("Not able to find the booking", StatusCodes.NOT_FOUND);
    }
    return response;
  }
}

module.exports = BookingRepository;
