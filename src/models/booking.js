"use strict";
const { Model } = require("sequelize");
const { Enums } = require("../utils/common");
const { BOOKED, CANCELLED, INITIATED, PENDING } = Enums.BOOKING_STATUS;

module.exports = (sequelize, DataTypes) => {
  class booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  booking.init(
    {
      flightId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      noOfSeats: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      totalCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        values: [BOOKED, CANCELLED, INITIATED, PENDING],
        defaultValue: INITIATED,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "booking",
    }
  );
  return booking;
};
