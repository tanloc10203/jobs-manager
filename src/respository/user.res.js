const userModel = require("../models/user.model");
const { createOTP } = require("../utils");
const { hashToken } = require("./token.res");

const findUserByEmail = async (email) => {
  return await userModel.findOne({ email }).lean();
};

const generateKeyChangePwd = async () => {
  const OTP = createOTP();
  const hashOTP = await hashToken(OTP);
  return { token: OTP, tokenHash: hashOTP };
};

const findUserIsAdmin = async () => {
  return await userModel.find({ api_key_admin: { $ne: null } }).lean();
};

module.exports = {
  findUserByEmail,
  findUserIsAdmin,
  generateKeyChangePwd,
};
