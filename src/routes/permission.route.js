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

router.get(
  "/all",
  AppMiddleware.catchErrorHandler(permissController.getAllPermission)
);
router.post(
  "/add",
  AppMiddleware.catchErrorHandler(permissController.createPermission)
);
router.patch(
  "/:id",
  AppMiddleware.catchErrorHandler(permissController.updatePermission)
);

module.exports = router;
