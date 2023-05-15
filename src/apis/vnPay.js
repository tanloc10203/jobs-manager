import instance from "./axios";

const host = "/vn-pay";

const vnPayAPI = {
  createPaymentUrl: (data) => {
    return instance.post(host + "/create-payment-url", data);
  },
};

export default vnPayAPI;
