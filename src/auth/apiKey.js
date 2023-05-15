"use strict";

const { Headers } = require("../const");
const {
  ForbiddenRequestError,
  UnauthorizedRequestError,
} = require("../responses/error.response");
const ApiKeyService = require("../services/apiKey.service");

const apiKey = async (req, res, next) => {
  const key = req.headers[Headers.API_KEY]?.toString();

  console.log("key:::", key);

  // await ApiKeyService.createApiKey();

  if (!key) {
    throw new ForbiddenRequestError("Missing `x-api-key` Request Header...");
  }

  const objectKey = await ApiKeyService.findOneApiKey(key);

  if (!objectKey) {
    throw new UnauthorizedRequestError("Key Invalid...");
  }

  req.objectKey = objectKey;

  return next();
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objectKey.permissions) {
      throw new ForbiddenRequestError("Permission denied!");
    }

    const validPermission = req.objectKey.permissions.includes(permission);

    if (!validPermission) {
      throw new ForbiddenRequestError("Permisson invalid!");
    }

    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
