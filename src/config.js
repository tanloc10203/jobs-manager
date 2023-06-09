const configs = {
  baseUrlClient: process.env.BASE_URL_CLIENT || "http://localhost:3000",
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/socialDEV",
  port: process.env.PORT || 8888,
  cookieSecret: process.env.COOKIE_SECRET || "private_cookies",
  email: {
    username: process.env.EMAIL_APP_USERNAME || "example@gmail.com",
    password: process.env.EMAIL_APP_PASSWORD || "example",
  },
  expired: {
    refreshToken: process.env.EXPIRED_REFRESH_TOKEN || "1w",
    accessToken: process.env.EXPIRED_ACCESS_TOKEN || "2d",
  },
  kixbox: {
    key:
      process.env.KIXBOX_KEY ||
      "live_73006b9ba90fc062b1b180e198f122c04ec9afe164c41a378231aa411f52432f",
  },
  socketIO: {
    key: "socketIO",
  },
};

module.exports = configs;
