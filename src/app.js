const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { AppMiddleware } = require("./middleware");
const { ipAddress, deviceUserAgent } = require("./auth/ipAddress");
const { SocketInit } = require("./socket.io");
const configs = require("./config");
const requestIp = require("request-ip");

require("./database/init.mongodb");

const app = express();

app.use(AppMiddleware.cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(AppMiddleware.compression());
app.use(AppMiddleware.session(app));

app.use(requestIp.mw());
app.use(ipAddress);
app.use(deviceUserAgent);
app.use("/", require("./routes"));
app.use(AppMiddleware.catchNotFoundResourse);
app.use(AppMiddleware.catchInternalServerError);

const { httpServer, io } = SocketInit.run(app);

app.set(configs.socketIO.key, io);

module.exports = httpServer;
