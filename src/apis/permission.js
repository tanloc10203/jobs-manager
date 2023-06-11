import instance from "./axios";

const url = "/permission";

const permissionAPI = {
  checkFirstStartApp() {
    return instance.get(url);
  },
  createAdmin(data) {
    return instance.post(url, data);
  },
  createPermission: (data) => {
    return instance.post(url + "/add", data);
  },
  getPermission: (filters) => {
    return instance.get(url + "/all", filters);
  },
  updatePermission: (id, data) => {
    return instance.patch(`${url}/${id}`, data);
  },
  deletePermission: (id) => {
    return instance.delete(`${url}/${id}`);
  },
};

export default permissionAPI;
