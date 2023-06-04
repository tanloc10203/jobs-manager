"use strict";

const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const {
  ConflictRequestError,
  NotFoundRequestError,
  BadRequestError,
  ForbiddenRequestError,
  RequestTimeoutError,
} = require("../responses/error.response");
const crypto = require("node:crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { checkEmail } = require("../respository/email.res");
const EmailService = require("./email.service");
const {
  findUserByEmail,
  generateKeyChangePwd,
} = require("../respository/user.res");
const UserService = require("./user.service");
const configs = require("../config");
const TokenService = require("../services/token.service");
const { compareToken } = require("../respository/token.res");

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

    await EmailService.sendEmailAccount({
      userId: userInsert._id,
      toEmail: email,
      fullName,
    });

    return getInfoData({
      fileds: ["_id", "full_name", "email"],
      object: userInsert,
    });
  };

  static verifyAccout = async ({ userId, token }) => {
    const userHolder = await UserService.findUserById(userId);

    if (!userHolder) {
      throw new NotFoundRequestError(
        "Chúng tôi không thể tìm thấy người dùng cho xác minh này. Vui lòng Đăng ký!"
      );
    }

    if (userHolder.verify) {
      return {
        verify: true,
      };
    }

    const tokenStore = await TokenService.findTokenByUserId(userId);

    if (!tokenStore) {
      throw new RequestTimeoutError(
        "Xác thực của bạn đã hết hạn. Vui lòng click vào gửi lại xác thực"
      );
    }

    const tokenValid = await compareToken({
      token: token,
      hashToken: tokenStore.token,
    });

    if (!tokenValid) {
      throw new BadRequestError("Token không hợp lệ. Vui lòng thử lại");
    }

    userHolder.verify = true;

    await userHolder.save();
    await tokenStore.deleteOne();

    return {
      verify: true,
    };
  };

  static resendEmailVerifyAccount = async (userId) => {
    const userHolder = await UserService.findUserById(userId);

    if (!userHolder) {
      throw new NotFoundRequestError(
        "Chúng tôi không tìm thấy tài khoản. Hãy chắc chắn rằng bạn đã đăng ký!"
      );
    }

    if (userHolder.verify) {
      return {
        verify: true,
      };
    }

    await EmailService.sendEmailAccount({
      userId: userHolder._id,
      toEmail: userHolder.email,
      fullName: userHolder.full_name,
    });

    return {
      resend: true,
    };
  };

  static forgotPassword = async (email) => {
    const userHolder = await UserService.findUserByEmail(email);

    if (!userHolder) {
      throw new BadRequestError(
        `Email \`${email}\` này chưa đăng ký trong hệ thống.`
      );
    }

    if (!userHolder.verify) {
      throw new ForbiddenRequestError(`Bạn chưa xác thực tài khoản.`);
    }

    if (userHolder.key_reset_pwd) {
      throw new BadRequestError(`Email đã được gửi. Vui lòng kiểm tra email`);
    }

    const { token, tokenHash } = await generateKeyChangePwd();

    userHolder.key_reset_pwd = tokenHash;

    await userHolder.save();

    await EmailService.sendEmailForgotPwd({
      userId: userHolder._id,
      toEmail: userHolder.email,
      fullName: userHolder.full_name,
      token: token,
    });

    return true;
  };

  static changePassword = async ({ password, userId, token }) => {
    const userHolder = await UserService.findUserById(userId);

    if (!userHolder) {
      throw new ForbiddenRequestError("Tài khoản không tồn tại!");
    }

    const tokenCompare = await compareToken({
      token: token,
      hashToken: userHolder.key_reset_pwd,
    });

    if (!tokenCompare) {
      throw new BadRequestError("Token không hợp lệ");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    userHolder.password = passwordHash;
    userHolder.key_reset_pwd = "";
    userHolder.save();

    return {
      reset_password: true,
    };
  };

  static signIn = async ({ email, password }) => {
    const user = await UserService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundRequestError("Tài khoản không tồn tại!");
    }

    if (!user.verify) {
      throw new ForbiddenRequestError(
        "Bạn chưa xác thực tài khoản. Hãy kiểm tra email!"
      );
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

  static getCurrentUserSignIn = async (userId) => {
    return await UserService.findUserById(userId, "-password");
  };
}

module.exports = AuthService;
