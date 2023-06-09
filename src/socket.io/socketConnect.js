import { io } from "socket.io-client";
import config from "~/configs";

const URL = import.meta.env.VITE_END_POINT;

const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
  auth: {
    [config.Headers.ACCESSTOKEN]: localStorage.getItem(
      config.Headers.ACCESSTOKEN
    ),
    [config.Headers.CLIENT_ID]: localStorage.getItem(config.Headers.CLIENT_ID),
  },
});

export default socket;
