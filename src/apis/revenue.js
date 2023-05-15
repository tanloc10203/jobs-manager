import instance from "./axios";

const host = "/revenue";

const revenueAPI = {
  getRevenueByRoom: () => {
    return instance.get(`${host}/rooms`);
  },
  getRevenueByDate: () => {
    return instance.get(`${host}/date`);
  },
  getRevenueByMonth: () => {
    return instance.get(`${host}/month`);
  },
  getRevenueByHotels: () => {
    return instance.get(`${host}/hotels`);
  },
  getCountBillCancel: () => {
    return instance.get(`${host}/cancel`);
  },
};

export default revenueAPI;
