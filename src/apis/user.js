import instance from "./axios";

const host = "/users";

const userAPI = {
  create: (data) => {
    return instance.post(host, data);
  },
  getAll: (filters) => {
    return instance.get(host, {
      params: { ...filters },
    });
  },
  update: ({ id, data }) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key]) && key === "picture") {
        data[key].map((newData) => {
          formData.append(key, newData);
        });
      } else {
        formData.append(key, data[key]);
      }
    });

    return instance.patch(`${host}/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  delete: (id) => {
    return instance.delete(`${host}/${id}`);
  },
  getById: (id) => {
    return instance.get(`${host}/${id}`);
  },
};

export default userAPI;
