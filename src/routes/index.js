"use strict";

const { Router } = require("express");
const router = Router();

router.use("/api/v1/permission", require("./permission.route"));
router.use("/api/v1/auth", require("./auth.route"));
router.use("/api/v1/user", require("./user.route"));

module.exports = router;
