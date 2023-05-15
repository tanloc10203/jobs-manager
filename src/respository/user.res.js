const userModel = require("../models/user.model");

const findUserByEmail = async (email) => {
  return await userModel.findOne({ email }).lean();
};

module.exports = {
  findUserByEmail,
};
