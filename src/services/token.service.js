"use client";

const tokenModel = require("../models/token.model");
const { hashToken, insertToken } = require("../respository/token.res");
const { createOTP } = require("../utils");
const { Types } = require("mongoose");

class TokenService {
  static createToken = async (userId) => {
    const OTP = createOTP();

    const hashOTP = await hashToken(OTP);

    await insertToken({ token: hashOTP, userId });

    return OTP;
  };

  static findTokenByUserId = async (userId) => {
    return await tokenModel
      .findOne({ user_id: new Types.ObjectId(userId) })
      .exec();
  };
}

module.exports = TokenService;
