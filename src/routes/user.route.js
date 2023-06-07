"use strict";

const { Router } = require("express");
const { AppMiddleware } = require("../middleware");
const userController = require("../controllers/user.controller");
const userModel = require("../models/user.model");
const router = Router();

router.get("/", AppMiddleware.catchErrorHandler(userController.getAll));
router.delete("/:id", async (req, res) => {
  console.log(req.params.id);
  await userModel.findByIdAndDelete(req.params.id);
  res.send("OK");
});

module.exports = router;
