"use strict";

const { cleanupAddress } = require("../utils");

/**
 * @description Lấy địa chỉ ip của người dùng.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const ipAddress = (req, res, next) => {
  const ip =
    req.headers["X-Client-IP"] ||
    req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress;

  req.ipClient = cleanupAddress(ip);

  return next();
};

/**
 * @description Lấy địa user agent (device) của người dùng.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const deviceUserAgent = (req, res, next) => {
  const device = req.headers["user-agent"];

  console.log("[device request] => ", device);

  req.device = device;

  return next();
};

module.exports = {
  ipAddress,
  deviceUserAgent,
};
