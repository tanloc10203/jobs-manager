"use strict";

const { roles } = require("../const");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");

class UserService {
  static getAll = async () => {
    return await userModel.find().select("-password -__v").lean();
  };

  static create = async ({
    fullName,
    password,
    email,
    role = [roles.USER],
  }) => {
    const passwordHash = await bcrypt.hash(password, 10);

    const userInsert = new userModel({
      full_name: fullName,
      password: passwordHash,
      email: email,
      roles: role,
    });

    return await userInsert.save();
  };
}

module.exports = UserService;
