"use strict";

const { Ok } = require("../responses/success.response");
const UserService = require("../services/user.service");

class UserController {
  getAll = async (req, res) => {
    return new Ok({
      message: "Get all user success.",
      metadata: await UserService.getAll(),
    }).send(res);
  };
}

module.exports = new UserController();
