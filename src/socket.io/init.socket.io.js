"use strict";

const { createServer } = require("http");
const { Server } = require("socket.io");
const configs = require("../config");
const { Express } = require("express");
const SocketMiddleware = require("../middleware/socket.middleware");
const { AppMiddleware } = require("../middleware");
const { Headers } = require("../const");

class SocketInit {
  /**
   * @description Start init socket.io
   * @param {Express} app
   */
  static run(app) {
    const httpServer = createServer(app);

    const socketIO = new Server(httpServer, {
      cors: {
        origin: configs.baseUrlClient,
        credentials: true,
      },
    });

    socketIO.use(AppMiddleware.wrap(AppMiddleware.session(app)));
    socketIO.use(SocketMiddleware.auth);

    socketIO.on("connect", (socket) => {
      socket.join(socket[Headers.CLIENT_ID]);
      console.log("user id: ", socket[Headers.CLIENT_ID]);
    });

    return {
      io: socketIO,
      httpServer,
    };
  }
}

module.exports = SocketInit;
