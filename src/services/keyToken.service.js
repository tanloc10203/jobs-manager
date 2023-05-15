"use strict";

const mongoose = require("mongoose");
const keyTokenModel = require("../models/keyToken.model");

class KeyTokenService {
  /**
   *
   * @param {{ userId: import("mongoose").ObjectId, publicKey: String, privateKey: String, refreshToken: String}} param0
   */
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    await keyTokenModel
      .findOneAndUpdate(
        { user: userId },
        {
          $set: {
            public_key: publicKey,
            private_key: privateKey,
            refresh_token: refreshToken,
          },
        },
        {
          upsert: true,
          new: true,
        }
      )
      .lean()
      .exec();

    return true;
  };

  static findByUserId = async (userId) => {
    return await keyTokenModel.findOne({
      user: new mongoose.Types.ObjectId(userId),
    });
  };

  static removeById = async (id) => {
    return await keyTokenModel.findByIdAndRemove(id);
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refresh_tokens_used: refreshToken })
      .lean();
  };

  static deleteByUserId = async (userId) => {
    return await keyTokenModel.findOneAndRemove({
      user: new mongoose.Types.ObjectId(userId),
    });
  };

  static findByRefreshToken = async (refreshToken) => {
    const result = await keyTokenModel.findOne({
      refresh_token: refreshToken,
    });

    return result;
  };
}

module.exports = KeyTokenService;
