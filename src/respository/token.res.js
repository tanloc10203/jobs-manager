"use strict";

const bcrypt = require("bcrypt");
const tokenModel = require("../models/token.model");

const hashToken = async (token) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(token, salt);
};

const compareToken = async ({ token, hashToken }) => {
  return await bcrypt.compare(token, hashToken);
};

const insertToken = async ({ token, userId }) => {
  const tokenInsert = new tokenModel({
    token: token,
    user_id: userId,
  });

  return await tokenInsert.save();
};

module.exports = {
  hashToken,
  compareToken,
  insertToken,
};
