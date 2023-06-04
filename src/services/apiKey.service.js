"use strict";

const { PermissionsApiKey } = require("../const");
const apiKeyModel = require("../models/apiKey.model");
const crypto = require("node:crypto");

class ApiKeyService {
  static createApiKey = async ({
    ipAddress,
    permission = PermissionsApiKey[2],
  }) => {
    const key = crypto.randomBytes(64).toString("hex");

    const keyApiStore = new apiKeyModel({
      key: key,
      permissions: permission,
      status: true,
      ip_address: ipAddress,
    });

    return await keyApiStore.save();
  };

  static findOneApiKey = async (key) => {
    return await apiKeyModel.findOne({ key, status: true }).lean();
  };

  static findAllApiKey = async () => {
    return await apiKeyModel.find().lean();
  };
}

module.exports = ApiKeyService;
