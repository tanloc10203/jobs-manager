import axios from "axios";
import { default as configApp } from "~/configs";

const instance = axios.create({
  baseURL: import.meta.env.VITE_END_POINT + "/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem(configApp.Headers.ACCESSTOKEN);
    const apiKey = localStorage.getItem(configApp.Headers.API_KEY);
    const clientId = localStorage.getItem(configApp.Headers.CLIENT_ID);

    if (token) {
      config.headers.Authorization = token;
    }

    if (apiKey) {
      config.headers[configApp.Headers.API_KEY] = apiKey;
    }

    if (clientId) {
      config.headers[configApp.Headers.CLIENT_ID] = clientId;
    }

    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  async function (error) {
    // const config = error.config;
    // const response = error?.response;

    // if (
    //   response &&
    //   response.status === 403 &&
    //   config.url === "/auth/refresh-token"
    // ) {
    //   return Promise.reject(error);
    // }

    // if (
    //   response &&
    //   response.status === 403 &&
    //   response.data &&
    //   response.data.message === "jwt expired"
    // ) {
    //   const response = await authAPI.refreshToken();

    //   if (response) {
    //     localStorage.setItem("accessToken", response.accessToken);

    //     instance.defaults.headers.common.Authorization =
    //       "Bearer " + response.accessToken;

    //     return instance(config);
    //   }
    // }
    return Promise.reject(error);
  }
);

export default instance;
