"use strict";

const { Router } = require("express");
const { AppMiddleware } = require("../middleware");
const apiKeyModel = require("../models/apiKey.model");
const { formatTimeMoongoes } = require("../helpers/format.helper");
const router = Router();

router.get(
  "/",
  AppMiddleware.catchErrorHandler(async (req, res) => {
    return res.json({
      data: (await apiKeyModel.find().lean()).map((item) => ({
        ...item,
        created_at: formatTimeMoongoes(item.createdAt),
      })),
    });
  })
);

module.exports = router;
