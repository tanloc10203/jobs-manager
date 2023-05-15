"use strict";

const { PermissionsApiKey } = require("../const");
const apiKeyModel = require("../models/apiKey.model");
const crypto = require("node:crypto");

class ApiKeyService {
  static createApiKey = async () => {
    const key = crypto.randomBytes(64).toString("hex");

    const keyApiStore = new apiKeyModel({
      key: key,
      permissions: PermissionsApiKey[0],
      status: true,
    });

    return await keyApiStore.save();
  };

  static findOneApiKey = async (key) => {
    return await apiKeyModel.findOne({ key, status: true }).lean();
  };
}

module.exports = ApiKeyService;
