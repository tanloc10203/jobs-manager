import instance from "./axios";

const url = "/role";

const roleAPI = {
  createRole: (data) => {
    return instance.post(url + "/", data);
  },
  getRole: (filters) => {
    return instance.get(url + "/", filters);
  },
  updateRole: (id, data) => {
    return instance.patch(`${url}/${id}`, data);
  },
  deleteRole: (id) => {
    return instance.delete(`${url}/${id}`);
  },
};

export default roleAPI;
