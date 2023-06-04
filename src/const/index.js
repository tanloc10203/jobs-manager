const Roles = {
  USER: "01",
  WRITER: "02",
  EDITOR: "03",
  ADMIN: "00",
  SUPPER_ADMIN: "xx",
};

const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV !== "production" ? false : true,
  path: "/",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  maxAge: 3.154e10, // 1 year
};

const Headers = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
  CLIENT_ID: "x-client-id",
  REFRESH_TOKEN: "refreshtoken",
};

const PermissionsApiKey = {
  0: ["0000"], // SUPPER_ADMIN
  1: ["1111"], // ADMIN
  2: ["2222"], // USER
};

module.exports = {
  Roles,
  refreshTokenCookieOptions,
  Headers,
  PermissionsApiKey,
};
