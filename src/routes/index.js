"use strict";

const { Router } = require("express");
const router = Router();

router.use("/api/v1/auth", require("./auth"));
router.use("/api/v1/user", require("./user"));

module.exports = router;
