const config = {
  server: {
    url: import.meta.env.VITE_END_POINT,
  },
  google: {
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    urlRedirect: import.meta.env.VITE_END_POINT + "/api/v1/auth/oauth2/google",
  },
  localStorage: {
    signInWithGoole: "signInWithGoole",
  },
  app: {
    key: {
      manageAdmin: "ADMIN",
    },
  },
  user: {
    role: {
      ADMIN: "ADMIN",
      USER: "USER",
      HOTEL: "HOTEL",
    },
  },
  Headers: {
    API_KEY: "x-api-key",
    AUTHORIZATION: "authorization",
    CLIENT_ID: "x-client-id",
    REFRESH_TOKEN: "refreshtoken",
    ACCESSTOKEN: "accessToken",
  },
};

export default config;
