import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

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
      toast.success("Đăng ký thành công.");
    },
    signUpFailed(state, { payload }) {
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

    // * SIGN UP
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
      localStorage.removeItem("accessToken");
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
