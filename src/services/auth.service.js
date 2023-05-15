"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const {
  ConflictRequestError,
  NotFoundRequestError,
  BadRequestError,
  ForbiddenRequestError,
} = require("../responses/error.response");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { checkEmail } = require("../respository/email.res");
const EmailService = require("./email.service");
const { findUserByEmail } = require("../respository/user.res");
const UserService = require("./user.service");
const configs = require("../config");
const TokenService = require("../services/token.service");

class AuthService {
  static refreshToken = async ({ refreshToken, user, keyStore }) => {
    const { userId, username } = user;

    if (keyStore.refresh_tokens_used.includes(refreshToken)) {
      await KeyTokenService.deleteByUserId(userId);
      throw new ForbiddenRequestError(
        "Something wrong happend! Pls relogin..."
      );
    }

    if (keyStore.refresh_token !== refreshToken) {
      throw new ForbiddenRequestError("User not registered...");
    }

    const foundUser = await userModel.findOne({ username: username }).lean();

    if (!foundUser) {
      throw new NotFoundRequestError("User not found...");
    }

    const tokens = createTokenPair(
      {
        userId,
        username,
      },
      keyStore.public_key,
      keyStore.private_key
    );

    await keyStore.updateOne({
      $set: {
        refresh_token: tokens.refreshToken,
      },
      $addToSet: {
        refresh_tokens_used: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };

  static signUp = async ({ fullName, password, email }) => {
    const emailValid = await checkEmail(email);

    if (!emailValid) {
      throw new BadRequestError("Vui lòng cung cấp địa chỉ email hợp lệ");
    }

    const userExists = await findUserByEmail(email);

    if (userExists) {
      throw new ConflictRequestError("Tài khoản đã tồn tại!");
    }

    const userInsert = await UserService.create({
      fullName,
      password,
      email,
    });

    const token = await TokenService.createToken(userInsert._id);

    const urlVerify = `${configs.baseUrlClient}/confirm/account/${userInsert._id}?token=${token}`;

    await EmailService.verifyRegister({ toEmail: email, fullName, urlVerify });

    return getInfoData({
      fileds: ["_id", "full_name", "email"],
      object: userInsert,
    });
  };

  static signIn = async ({ email, password }) => {
    const user = await userModel
      .findOne({
        email: email,
      })
      .lean()
      .exec();

    if (!user) {
      throw new NotFoundRequestError("Tài khoản không tồn tại!");
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      throw new BadRequestError("Sai mật khẩu!");
    }

    const tokens = await AuthService.generateKeyPairSyncLv2(user);

    return {
      user: getInfoData({ fileds: ["_id", "full_name"], object: user }),
      tokens,
    };
  };

  static logout = async (keyStore) => {
    return await KeyTokenService.removeById(keyStore._id);
  };

  /**
   * @description RS256
   * @param {Object} user
   * @returns
   */
  static generateKeyPairSync = async (user) => {
    // create publicKey, privateKey
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "spki",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs8",
        format: "pem",
      },
    });

    console.log({ privateKey, publicKey });

    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: user._id,
      publicKey: publicKey,
    });

    if (!publicKeyString) {
      throw new BadRequestError("Public key string error");
    }

    const pbulicKeyObject = crypto.createPublicKey(publicKeyString);

    const tokens = createTokenPair(
      {
        userId: user._id,
        username: user.username,
      },
      pbulicKeyObject,
      privateKey
    );

    return tokens;
  };

  /**
   * @description Simple
   * @param {Object} user
   */
  static generateKeyPairSyncLv2 = async (user) => {
    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const tokens = createTokenPair(
      {
        userId: user._id,
        username: user.username,
      },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      userId: user._id,
      publicKey,
      privateKey,
      refreshToken: tokens.refreshToken,
    });

    return tokens;
  };
}

module.exports = AuthService;
