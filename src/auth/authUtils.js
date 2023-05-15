"use strict";

const JWT = require("jsonwebtoken");
const {
  ForbiddenRequestError,
  NotFoundRequestError,
} = require("../responses/error.response");
const { Headers } = require("../const");
const KeyTokenService = require("../services/keyToken.service");

const createTokenPair = (payload, publicKey, privateKey) => {
  const accessToken = JWT.sign(payload, publicKey, {
    expiresIn: "2d",
  });

  const refreshToken = JWT.sign(payload, privateKey, {
    expiresIn: "2d",
  });

  return { accessToken, refreshToken };
};

const verifyToken = (token, key) => {
  try {
    const decode = JWT.verify(token, key);

    return decode;
  } catch (error) {
    throw new ForbiddenRequestError(error.message);
  }
};

const authentication = async (req, res, next) => {
  /**
   * 1 - Check userId missing?
   * 2 - get accessToken
   * 3 - verify Token
   * 4 - check user in dbs?
   * 5 - check keyStore with this userId?
   * 6 - Ok all => return next().
   */

  const userId = req.headers[Headers.CLIENT_ID]?.toString();

  if (!userId) {
    throw new ForbiddenRequestError("Missing `x-client-id` Request Header...");
  }

  // 2 - get accessToken
  const keyStore = await KeyTokenService.findByUserId(userId);

  if (!keyStore) {
    throw new NotFoundRequestError("Key Store Not Found!");
  }

  const refreshToken = req.headers[Headers.REFRESH_TOKEN]?.toString();

  if (refreshToken) {
    const decode = verifyToken(refreshToken, keyStore.private_key);

    if (userId !== decode?.userId) {
      throw new ForbiddenRequestError("Invalid UserId");
    }

    req.keyStore = keyStore;
    req.user = decode;
    req.refreshToken = refreshToken;

    return next();
  }

  const accessToken = req.headers[Headers.AUTHORIZATION]?.toString();

  if (!accessToken) {
    throw new ForbiddenRequestError(
      "Missing `authorization` Request Header..."
    );
  }

  // 3 - verify Token
  const decode = verifyToken(accessToken, keyStore.public_key);

  // 5 - check keyStore with this userId?
  if (userId !== decode?.userId) {
    throw new ForbiddenRequestError("Invalid UserId");
  }

  // 6 - Ok all => return next().
  req.keyStore = keyStore;
  return next();
};

module.exports = {
  createTokenPair,
  verifyToken,
  authentication,
};
