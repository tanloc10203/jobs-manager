"use strict";

const { Router } = require("express");
const { AppMiddleware } = require("../middleware");
const roleController = require("../controllers/role.controller");
const router = Router();

router.post("/", AppMiddleware.catchErrorHandler(roleController.create));

module.exports = router;
