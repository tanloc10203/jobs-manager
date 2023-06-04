import instance from "./axios";

const url = "/permission";

const permissionAPI = {
  checkFirstStartApp() {
    return instance.get(url);
  },
};

export default permissionAPI;
