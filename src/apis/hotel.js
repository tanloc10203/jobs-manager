import instance from "./axios";
import FormData from "form-data";

const host = "/hotels";

const hotelAPI = {
  create: (data) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (Array.isArray(data[key]) && key !== "tags") {
        data[key].map((newData) => {
          formData.append(key, newData);
        });
      } else if (key === "tags") {
        formData.append(key, JSON.stringify(data[key]));
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

  getAllOptions: () => {
    return instance.get(host + "/options");
  },

  getById: (id) => {
    return instance.get(`${host}/${id}`);
  },

  update: ({ id, data }) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      if (
        (Array.isArray(data[key]) && key === "hotel_image") ||
        (Array.isArray(data[key]) && key === "h_image_value")
      ) {
        data[key].map((newData) => {
          formData.append(key, newData);
        });
      } else if (
        key === "img_delete" ||
        key === "tag_delete" ||
        key === "tag_news"
      ) {
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

  deleteById: (id) => {
    return instance.delete(`${host}/${id}`);
  },

  countProvince: () => {
    return instance.get(host + "/counts-province");
  },

  findListHotel: (data) => {
    return instance.get(host + "/list-hotel", {
      params: data,
    });
  },

  getHotelBySlug: (slug) => {
    return instance.get(host + "/slug/" + slug);
  },
};

export default hotelAPI;
