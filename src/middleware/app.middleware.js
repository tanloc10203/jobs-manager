"use strict";

const corsMiddlware = require("cors");
const compressionMiddleware = require("compression");
const sessionMiddleware = require("express-session");
const MongoStore = require("connect-mongo");
const { Express } = require("express");
const configs = require("../config");
const {
  NotFoundRequestError,
  ErrorResponse,
} = require("../responses/error.response");
const statusCodesCore = require("../core/statusCodes.core");
const reasonPhrasesCore = require("../core/reasonPhrases.core");

class AppMiddleware {
  static cors = () => {
    return corsMiddlware({
      origin: [configs.baseUrlClient, "http://192.168.1.14:3000"],
      credentials: true,
      methods: ["GET", "POST", "PATCH", "DELETE"],
      allowedHeaders: [
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type, Accept,Authorization,Origin",
        "x-client-id",
        "x-api-key",
        "refreshtoken",
        "authorization",
      ],
    });
  };

  static compression = () => {
    return compressionMiddleware({
      level: 6,
      threshold: 100 * 1000,
      filter: (req, res) => {
        if (req.headers["x-no-compression"]) {
          return false;
        }

        return compressionMiddleware.filter(req, res);
      },
    });
  };

  /**
   * @description Session Middleware.
   * @param {Express} app
   * @returns
   */
  static session = (app) => {
    const storeMongo = MongoStore.create({
      mongoUrl: configs.mongoUri,
    });

    let options = {
      secret: configs.cookieSecret,
      store: storeMongo,
      name: "sid",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 3.154e10,
      },
    };

    if (app.get("env") === "production") {
      app.enable("trust proxy");
      options = {
        ...options,
        proxy: true,
        cookie: {
          ...options.cookie,
          secure: true,
          sameSite: "none",
        },
      };
    }

    return sessionMiddleware(options);
  };

  static wrap = (expressMiddleware) => (socket, next) =>
    expressMiddleware(socket.request, {}, next);

  /**
   * @description Catch all endpoint not found
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  static catchNotFoundResourse = (req, res, next) => {
    const error = new NotFoundRequestError("Resource not found!");
    return next(error);
  };

  /**
   *
   * @param {ErrorResponse} error
   * @param {import("express").Request} req
   * @param {import("express").Response} res
   * @param {import("express").NextFunction} next
   */
  static catchInternalServerError = (error, req, res, next) => {
    console.log("ERROR:::", error);
    const statusCode = error.status || statusCodesCore.INTERNAL_SERVER_ERROR;
    const message = error.message || reasonPhrasesCore.INTERNAL_SERVER_ERROR;
    return res.status(statusCode).json({
      status: "error",
      code: statusCode,
      message: message,
      exception: error.stack,
    });
  };

  /**
   *
   * @param {Function} fn
   * @returns {(req, res, next) => void}
   */
  static catchErrorHandler = (fn) => {
    return (req, res, next) => {
      fn(req, res, next).catch(next);
    };
  };
}

module.exports = AppMiddleware;
