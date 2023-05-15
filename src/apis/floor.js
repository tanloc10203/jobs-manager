import instance from "./axios";

const host = "/floors";

const floorAPI = {
  create: (data) => {
    return instance.post(host, data);
  },
  getAll: (filters) => {
    return instance.get(host, {
      params: { ...filters },
    });
  },
  update: ({ id, data }) => {
    return instance.patch(`${host}/${id}`, data);
  },
  delete: (id) => {
    return instance.delete(`${host}/${id}`);
  },
  getById: (id) => {
    return instance.get(`${host}/${id}`);
  },
};

export default floorAPI;
