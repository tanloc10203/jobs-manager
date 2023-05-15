import instance from "./axios";

const host = "/rooms";

const roomAPI = {
  create: (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key])) {
        data[key].map((newData) => {
          formData.append(key, newData);
        });
      } else {
        formData.append(key, data[key]);
      }
    });

    return instance.post(host, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  getAll: (filters) => {
    return instance.get(host, {
      params: { ...filters },
    });
  },
  update: ({ id, data }) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (
        (Array.isArray(data[key]) && key === "room_thumb") ||
        (Array.isArray(data[key]) && key === "r_image_value")
      ) {
        data[key].map((newData) => {
          formData.append(key, newData);
        });
      } else if (key === "img_delete") {
        formData.append(key, JSON.stringify(data[key]));
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

export default roomAPI;
