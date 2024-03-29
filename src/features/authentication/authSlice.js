import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import config from "~/configs";

const initialState = {
  isLoading: false,
  error: "",
  accessToken: "" || localStorage.getItem("accessToken"),
  user: {},
};

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    // * SIGN IN
    signInStart(state, actions) {
      state.isLoading = true;
    },
    signInSucceed(state, { payload }) {
      state.isLoading = false;
      state.accessToken = payload;
      toast.success("Đăng nhập thành công.");
    },
    signInFailed(state, { payload }) {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload);
    },

    // * SIGN UP
    signUpStart(state, actions) {
      state.isLoading = true;
    },
    signUpSucceed(state) {
      state.isLoading = false;
      Swal.fire({
        title: "Đăng ký thành công.",
        text: "Vui lòng kiểm tra email của bạn để xác thực tài khoản.",
        icon: "success",
      });
    },
    signUpFailed(state, { payload }) {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload);
    },

    // * SIGN UP ADMIN
    signUpAdminStart(state, actions) {
      state.isLoading = true;
    },
    signUpAdminSucceed(state) {
      state.isLoading = false;
      Swal.fire({
        title: "Đăng ký thành công.",
        text: "Vui lòng kiểm tra email của bạn để xác thực tài khoản.",
        icon: "success",
      });
    },
    signUpAdminFailed(state, { payload }) {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload);
    },

    // * SIGN UP HOTEL
    signUpHotelStart(state, actions) {
      state.isLoading = true;
    },
    signUpHotelSucceed(state) {
      state.isLoading = false;
    },

    // * VERIFY SIGN UP
    verifySignUpHotelStart(state, actions) {
      state.isLoading = true;
    },
    verifySignUpHotelSucceed(state) {
      state.isLoading = false;
      toast.success("Đăng ký thành công.");
    },
    verifySignUpHotelFailed(state, { payload }) {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload);
    },

    // * VERIFY SIGN IN ADMIN
    verifySignInAdminStart(state, actions) {
      state.isLoading = true;
    },
    verifySignInAdminSuccess(state, { payload }) {
      state.isLoading = false;
      state.user = payload;
      toast.success("Xác thực thành công.");
    },
    verifySignInAdminFailed(state, { payload }) {
      state.isLoading = false;
      state.error = payload;
      Swal.fire({
        title: "Đã xảy ra lỗi...",
        text: payload,
        icon: "error",
      });
    },

    // * GET CURENT USER
    getCurrentUserStart(state, actions) {
      state.isLoading = true;
    },
    getCurrentUserSucceed(state, { payload }) {
      state.isLoading = false;
      state.user = payload;
    },
    getCurrentUserFailed(state, { payload }) {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload);
    },

    // * getUserSignInWithGoogle
    getUserSignInWithGoogle(state) {
      state.isLoading = true;
    },

    getUserSignInWithGoogleSucceed(state, { payload }) {
      state.isLoading = false;
      state.accessToken = payload;
    },

    // * Sign out
    signOutStart(state) {
      state.isLoading = true;
    },
    signOutSucceed(state) {
      state.isLoading = false;
      state.user = {};
      state.accessToken = "";
      localStorage.removeItem(config.Headers.ACCESSTOKEN);
    },
    signOutFailed(state, { payload }) {
      state.isLoading = false;
      state.error = payload;
      toast.error(payload);
    },
  },
});

const authState = (state) => state.auth;

const authActions = authSlice.actions;

const authReducer = authSlice.reducer;

export { authActions, authState };

export default authReducer;
