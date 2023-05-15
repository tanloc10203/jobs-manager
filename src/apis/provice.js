import axios from "axios";

const instance = axios.create({
  baseURL: "https://vapi.vnappmob.com/api/province",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use(
  function (config) {
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
    return Promise.reject(error);
  }
);

const provinceApi = {
  getListProvince() {
    return instance.get("/");
  },

  getListDistrict(province_id) {
    return instance.get(`/district/${province_id}`);
  },

  getListWard(district_id) {
    return instance.get(`/ward/${district_id}`);
  },
};

export async function getProvince() {
  try {
    const response = await provinceApi.getListProvince();
    return response.results;
  } catch (error) {
    console.log("getProvince error::", error);
  }
}

export async function getDistrict(provinceId) {
  try {
    const response = await provinceApi.getListDistrict(provinceId);
    return response.results;
  } catch (error) {
    console.log("getDistrict error::", error);
  }
}

export async function getWard(districtId) {
  try {
    const response = await provinceApi.getListWard(districtId);
    return response.results;
  } catch (error) {
    console.log("getWard error::", error);
  }
}

export default provinceApi;
