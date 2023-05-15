"use strict";

const { Router } = require("express");
const { AppMiddleware } = require("../../middleware");
const authController = require("../../controllers/auth.controller");
const { authentication } = require("../../auth/authUtils");
const router = Router();

router.get("/");
router.post("/sign-up", AppMiddleware.catchErrorHandler(authController.signUp));
router.post("/sign-in", AppMiddleware.catchErrorHandler(authController.signIn));

// authentication //
router.use(AppMiddleware.catchErrorHandler(authentication));

router.post(
  "/sign-out",
  AppMiddleware.catchErrorHandler(authController.logout)
);
router.post(
  "/refresh-token",
  AppMiddleware.catchErrorHandler(authController.refreshToken)
);

module.exports = router;
