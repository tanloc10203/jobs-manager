"use strict";

const { Router } = require("express");
const { AppMiddleware } = require("../../middleware");
const userController = require("../../controllers/user.controller");
const router = Router();

router.get("/", AppMiddleware.catchErrorHandler(userController.getAll));

module.exports = router;
