"use strict";

const { Socket } = require("socket.io");
const configs = require("../config");
const { Headers } = require("../const");

class SocketMiddleware {
  /**
   * @description Authencation.
   * @param {Socket} socket
   * @param {import("express").NextFunction} next
   * @returns
   */
  static auth(socket, next) {
    const session = socket.request.session;
    const accessToken = socket.handshake.auth[Headers.ACCESS_TOKEN];
    const clientId = socket.handshake.auth[Headers.CLIENT_ID];

    socket[Headers.ACCESS_TOKEN] = accessToken;
    socket[Headers.CLIENT_ID] = clientId;

    next();
  }
}

module.exports = SocketMiddleware;
