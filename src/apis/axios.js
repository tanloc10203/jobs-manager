import axios from "axios";
import authAPI from "./auth";

const instance = axios.create({
  baseURL: import.meta.env.VITE_END_POINT + "/api/v1",
  withCredentials: true,
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = "Bearer " + token;
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
