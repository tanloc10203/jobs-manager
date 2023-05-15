const roles = {
  USER: "01",
  WRITER: "02",
  EDITOR: "03",
  ADMIN: "00",
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
  0: ["0000"],
  1: ["1111"],
  2: ["2222"],
};

module.exports = {
  roles,
  refreshTokenCookieOptions,
  Headers,
  PermissionsApiKey,
};
