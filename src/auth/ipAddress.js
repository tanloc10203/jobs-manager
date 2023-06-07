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

module.exports = {
  ipAddress,
};
