"use strict";

const { Socket } = require("socket.io");

class SocketMiddleware {
  /**
   * @description Authencation.
   * @param {Socket} socket
   * @param {import("express").NextFunction} next
   * @returns
   */
  static auth(socket, next) {}
}

module.exports = SocketMiddleware;
