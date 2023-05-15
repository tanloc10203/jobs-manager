"use strict";

const { Roles } = require("../const");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const { Types } = require("mongoose");

class UserService {
  static getAll = async () => {
    return await userModel.find().select("-password -__v").lean();
  };

  static create = async ({
    fullName,
    password,
    email,
    role = [Roles.USER],
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

  static findUserById = async (userId) => {
    return await userModel.findById(new Types.ObjectId(userId));
  };

  static findUserByEmail = async (email) => {
    return await userModel.findOne({ email }).exec();
  };
}

module.exports = UserService;
