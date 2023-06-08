"use strict";

const { Router } = require("express");
const { AppMiddleware } = require("../middleware");
const { apiKey } = require("../auth/apiKey");
const router = Router();

router.use(AppMiddleware.catchErrorHandler(apiKey));

router.use("/api/v1/permission", require("./permission.route"));
router.use("/api/v1/api-key", require("./apiKey.route"));
router.use("/api/v1/auth", require("./auth.route"));
router.use("/api/v1/user", require("./user.route"));

module.exports = router;
