"use strict";

const { Headers, PermissionsApiKey } = require("../const");
const {
  ForbiddenRequestError,
  UnauthorizedRequestError,
} = require("../responses/error.response");
const ApiKeyService = require("../services/apiKey.service");

/**
 * @description ứng dụng chỉ có duy nhất 3 apikey. Chia quyền như sau: SUPPER_ADMIN, ADMIN, USER
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns
 */
const apiKey = async (req, res, next) => {
  /**
    - Kiểm tra nếu không có api_key.
      - Kiểm tra xem địa chỉ ip request có tồn tại (đã từng sử dụng api_key).
        - Cấp lại api_key
      - Nếu không?.
        - Select trong db với quyền user. Xem có api_key chưa?.
        - Nếu rồi thì kiểm tra địa chỉ ip, đã từng sử dụng chưa.
          - Nếu chưa thì trả về apikey cho người dùng.
        - Nếu chưa tạo apikey user duy nhất.
   */

  const ip = req.ipClient;

  const key = req.headers[Headers.API_KEY]?.toString();

  if (!key) {
    const keyStoreUser = await ApiKeyService.findApiKeyByPermission(); // default permission user.

    if (!keyStoreUser) {
      const keyStoreNew = await ApiKeyService.createApiKey({
        ipAddress: ip,
      });

      req.objectKey = keyStoreNew;
      return next();
    }

    console.log("apikey user::: ", keyStoreUser);

    // Nếu địa chỉ ip đã từng sử dụng thì pass.
    if (keyStoreUser.ip_address_used.includes(ip)) {
      req.objectKey = keyStoreUser;
      return next();
    }

    // Đưa địa chỉ ip này vào.
    keyStoreUser.ip_address_used = [...keyStoreUser.ip_address_used, ip];
    keyStoreUser.save();

    req.objectKey = keyStoreUser;
    return next();
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
