import instance from "./axios";

const url = "/permission";

const permissionAPI = {
  checkFirstStartApp() {
    return instance.get(url);
  },
  createAdmin(data) {
    return instance.post(url, data);
  },
};

export default permissionAPI;
