"use strict";

const { Router } = require("express");
const { AppMiddleware } = require("../../middleware");
const authController = require("../../controllers/auth.controller");
const { authentication } = require("../../auth/authUtils");
const router = Router();

router.get("/");
router.post("/sign-up", AppMiddleware.catchErrorHandler(authController.signUp));
router.post("/sign-in", AppMiddleware.catchErrorHandler(authController.signIn));
router.post(
  "/verify/account",
  AppMiddleware.catchErrorHandler(authController.verifyAccout)
);
router.post(
  "/resend/verify/account",
  AppMiddleware.catchErrorHandler(authController.resendVerifyAccount)
);
router.post(
  "/forgot-password",
  AppMiddleware.catchErrorHandler(authController.forgotPassword)
);
router.post(
  "/change-password",
  AppMiddleware.catchErrorHandler(authController.changePassword)
);

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
