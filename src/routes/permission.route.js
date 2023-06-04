"use strict";

const { Router } = require("express");
const { AppMiddleware } = require("../middleware");
const permissController = require("../controllers/permiss.controller");
const router = Router();

router.get("/", AppMiddleware.catchErrorHandler(permissController.checkAPIKey));
router.post(
  "/",
  AppMiddleware.catchErrorHandler(permissController.createAdmin)
);

module.exports = router;
