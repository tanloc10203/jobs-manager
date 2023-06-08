"use strict";

const { refreshTokenCookieOptions } = require("../const");
const { BadRequestError } = require("../responses/error.response");
const { Created, Ok } = require("../responses/success.response");
const AuthService = require("../services/auth.service");
const { validateObjectId } = require("../utils");

class AuthController {
  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  signUp = async (req, res) => {
    const body = req.body;

    if (!body.fullName || !body.password || !body.email) {
      throw new BadRequestError("Thiếu trường `fullName`, `password`, `email`");
    }

    return new Created({
      message: "Register success.",
      metadata: await AuthService.signUp({
        fullName: body.fullName,
        password: body.password,
        email: body.email,
      }),
    }).send(res);
  };

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  signIn = async (req, res) => {
    const body = req.body;

    if (!body.password || !body.email) {
      throw new BadRequestError("Missing body `email`, `password`");
    }

    const response = await AuthService.signIn({
      password: body.password,
      email: body.email,
      ip: req.ipClient,
      device: req.device,
    });

    res.cookie(
      "refreshToken",
      response.tokens.refreshToken,
      refreshTokenCookieOptions
    );

    req.session.token = {
      refreshToken: response.tokens.refreshToken,
    };

    return new Ok({
      message: "Login success.",
      metadata: response,
    }).send(res);
  };

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  logout = async (req, res) => {
    res.clearCookie();
    req.session.destroy();
    return new Ok({
      message: "Logout success.",
      metadata: await AuthService.logout(req.keyStore),
    }).send(res);
  };

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  refreshToken = async (req, res) => {
    return new Ok({
      message: "RefreshToken success.",
      metadata: await AuthService.refreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  verifyAccout = async (req, res) => {
    const body = req.body;

    if (!body.userId || !body.token) {
      throw new BadRequestError("Missing body `userId`, `token`");
    }

    validateObjectId({
      id: body.userId,
      message: `\`userId\` = ${body.userId} không hợp lệ`,
    });

    return new Ok({
      message: "Verify Account success.",
      metadata: await AuthService.verifyAccout({
        userId: body.userId,
        token: body.token,
      }),
    }).send(res);
  };

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  resendVerifyAccount = async (req, res) => {
    const body = req.body;

    if (!body.userId) {
      throw new BadRequestError("Missing body `userId`");
    }

    validateObjectId({
      id: body.userId,
      message: `\`userId\` = ${body.userId} không hợp lệ`,
    });

    return new Ok({
      message: "Resend Verify Account Success.",
      metadata: await AuthService.resendEmailVerifyAccount(body.userId),
    }).send(res);
  };

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  forgotPassword = async (req, res) => {
    const body = req.body;

    if (!body.email) {
      throw new BadRequestError("Missing body `email`");
    }

    return new Ok({
      message: "Send Email Success.",
      metadata: await AuthService.forgotPassword(body.email),
    }).send(res);
  };

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  changePassword = async (req, res) => {
    const body = req.body;

    if (!body.userId || !body.password || !body.token) {
      throw new BadRequestError("Missing body `email`, `password`, `token`");
    }

    validateObjectId({
      id: body.userId,
      message: `\`userId\` = ${body.userId} không hợp lệ`,
    });

    return new Ok({
      message: "Change Password Success.",
      metadata: await AuthService.changePassword({
        userId: body.userId,
        password: body.password,
        token: body.token,
      }),
    }).send(res);
  };

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  getCurrentUserSignIn = async (req, res) => {
    const keyStore = req.keyStore;

    validateObjectId({
      id: keyStore.user,
      message: `\`_id\` = ${keyStore.user} không hợp lệ`,
    });

    return new Ok({
      message: "Get Current User Sign In Success.",
      metadata: await AuthService.getCurrentUserSignIn(keyStore.user),
    }).send(res);
  };

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  verifyAdmin = async (req, res) => {
    const keyStore = req.keyStore;
    const codeAdmin = req.body.code;
    const ip = req.ipClient;
    const device = req.device;

    if (!codeAdmin) {
      throw new BadRequestError("Missing body code...");
    }

    validateObjectId({
      id: keyStore.user,
      message: `\`_id\` = ${keyStore.user} không hợp lệ`,
    });

    return new Ok({
      message: "Verify Admin Success.",
      metadata: await AuthService.verifyAdmin({
        id: keyStore.user,
        code: codeAdmin,
        ip: "192.168.1.2",
        device,
      }),
    }).send(res);
  };

  /**
   *
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   */
  verifyAdminDevice = async (req, res) => {
    const userId = req.body.userId;

    if (!userId) {
      throw new BadRequestError("Missing body userId...");
    }

    return new Ok({
      message: "Verify Admin Device Success.",
      metadata: await AuthService.verifyAdminDevice(userId),
    }).send(res);
  };
}

module.exports = new AuthController();
