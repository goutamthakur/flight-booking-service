const { StatusCodes } = require("http-status-codes");
const { SuccessResponse } = require("../utils/common");

const info = (req, res) => {
  SuccessResponse.message = "API is live";
  return res.status(StatusCodes.OK).json(SuccessResponse);
};

module.exports = {
  info,
};
