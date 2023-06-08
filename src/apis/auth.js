import instance from "./axios";

const url = "/auth";

const authAPI = {
  signIn(data) {
    return instance.post(url + "/sign-in", data);
  },

  signUp(data) {
    return instance.post(url + "/sign-up", data);
  },

  verifyAccount(data) {
    return instance.post(url + "/verify/account", data);
  },

  resendVerifyAccount(data) {
    return instance.post(url + "/resend/verify/account", data);
  },

  signUpHotel(data) {
    return instance.post(url + "/register-hotel", data);
  },

  verifySignUpHotel(data) {
    return instance.post(url + "/verify-register-hotel", data);
  },

  signOut() {
    return instance.post(url + "/sign-out");
  },

  refreshToken() {
    return instance.get(url + "/refresh-token");
  },

  getUserSignInWithGoogle() {
    return instance.get(url + "/get/oauth2/google");
  },

  forgotPwd(body) {
    return instance.post(url + "/forgot-password", body);
  },

  changePwd(body) {
    return instance.post(url + "/change-password", body);
  },

  getCurrentUser(accessToken) {
    return instance.get(url + "/sign-in", {
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    });
  },

  verifyadmin(data) {
    return instance.post(url + "/verify-admin", data);
  },

  verifyAdminDevice(data) {
    return instance.post(url + "/verify-admin-device", data);
  },
};

export default authAPI;
