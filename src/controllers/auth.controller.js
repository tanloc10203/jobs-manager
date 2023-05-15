"use strict";

const { refreshTokenCookieOptions } = require("../const");
const { BadRequestError } = require("../responses/error.response");
const { Created, Ok } = require("../responses/success.response");
const AuthService = require("../services/auth.service");

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
}

module.exports = new AuthController();
