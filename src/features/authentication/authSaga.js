import { toast } from "react-toastify";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { authAPI } from "~/apis";
import config from "~/configs";
import { history } from "~/utils";
import { appActions } from "../app/appSlice";
import { authActions } from "./authSlice";
import permissionAPI from "~/apis/permission";
import instance from "~/apis/axios";

// * Sign UP
function* fetchSignUp({ payload }) {
  try {
    const response = yield call(authAPI.signUp, payload);

    if (response) {
      yield put(authActions.signUpSucceed());
      yield put(appActions.setOpenOverlay(false));
      yield put(appActions.setText(""));
      history.push("/sign-in");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    yield put(appActions.setText(""));
    if (error.response) {
      yield put(authActions.signUpFailed(error.response.data.message));
    } else {
      yield put(authActions.signUpFailed(error.message));
    }
  }
}

function* watchFetchSignUp() {
  yield takeLatest(authActions.signUpStart.type, fetchSignUp);
}

// * Sign UP ADMIN
function* fetchSignUpAdmin({ payload }) {
  try {
    const response = yield call(permissionAPI.createAdmin, payload);

    console.log("response register admin:::", response);

    if (response) {
      localStorage.setItem(config.Headers.API_KEY, response.metadata.apiKey);

      yield put(authActions.signUpAdminSucceed());
      yield put(appActions.setOpenOverlay(false));
      yield put(appActions.setText(""));
      history.push("/sign-in");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    yield put(appActions.setText(""));
    if (error.response) {
      yield put(authActions.signUpAdminFailed(error.response.data.message));
    } else {
      yield put(authActions.signUpAdminFailed(error.message));
    }
  }
}

function* watchFetchSignUpAdmin() {
  yield takeLatest(authActions.signUpAdminStart.type, fetchSignUpAdmin);
}

// * verify Sign UP HOTEL
function* fetchVerifySignUpHotel({ payload }) {
  try {
    const response = yield call(authAPI.verifySignUpHotel, payload);

    if (response) {
      yield put(authActions.verifySignUpHotelSucceed());
      yield put(appActions.setOpenOverlay(false));
      yield put(appActions.setText(""));
      history.push(`/sign-up`);
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    yield put(appActions.setText(""));
    if (error.response) {
      yield put(
        authActions.verifySignUpHotelFailed(error.response.data.message)
      );
    } else {
      yield put(authActions.verifySignUpHotelFailed(error.message));
    }
  }
}

function* watchFetchVerifySignUpHotel() {
  yield takeLatest(
    authActions.verifySignUpHotelStart.type,
    fetchVerifySignUpHotel
  );
}

// * verify Sign In admin
function* fetchVerifySignInAdmin({ payload }) {
  try {
    const response = yield call(authAPI.verifyadmin, payload);

    console.log(response);

    if (response) {
      yield put(authActions.verifySignInAdminSuccess(response.metadata));
      yield put(appActions.setOpenOverlay(false));
      yield put(appActions.setText(""));
      history.push(`/manager/app`);
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    yield put(appActions.setText(""));
    if (error.response) {
      yield put(
        authActions.verifySignInAdminFailed(error.response.data.message)
      );
    } else {
      yield put(authActions.verifySignInAdminFailed(error.message));
    }
  }
}

function* watchFetchVerifySignInAdmin() {
  yield takeLatest(
    authActions.verifySignInAdminStart.type,
    fetchVerifySignInAdmin
  );
}

// * Sign In
function* fetchSignIn({ payload }) {
  try {
    const response = yield call(authAPI.signIn, payload);

    if (response) {
      const { tokens, user } = response.metadata;

      localStorage.setItem(config.Headers.ACCESSTOKEN, tokens.accessToken);
      localStorage.setItem(config.Headers.CLIENT_ID, user._id);

      if (user.isAdmin) {
        yield call([history, history.push], "/verify-admin");
      } else {
        yield call([history, history.push], "/");
      }

      yield put(appActions.setOpenOverlay(false));
      yield put(appActions.setText(""));
      yield put(authActions.signInSucceed(tokens.accessToken));
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    yield put(appActions.setText(""));
    if (error.response) {
      yield put(authActions.signInFailed(error.response.data.message));
    } else {
      yield put(authActions.signInFailed(error.message));
    }
  }
}

function* watchFetchSignIn() {
  yield takeLatest(authActions.signInStart.type, fetchSignIn);
}

// * Get curent user.
function* getCurrentUser({ payload }) {
  try {
    const response = yield authAPI.getCurrentUser(payload.accessToken);

    yield put(authActions.getCurrentUserSucceed(response.metadata));
  } catch (error) {
    if (error.response) {
      if (error.response.data.message === "jwt refreshToken expired") {
        toast.info("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        yield put(authActions.signOutStart());
        return;
      }

      yield put(authActions.getCurrentUserFailed(error.response.data.message));
    } else {
      yield put(authActions.getCurrentUserFailed(error.message));
    }
  }
}

function* watchFetchCurentUser() {
  yield takeLatest(authActions.getCurrentUserStart.type, getCurrentUser);
}

// * Sign out
function* fetchSignOut() {
  try {
    const response = yield authAPI.signOut();

    if (response) {
      yield put(authActions.signOutSucceed());
      yield put(appActions.setOpenOverlay(false));
      yield put(appActions.setText(""));
      history.push("/sign-in");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    yield put(appActions.setText(""));
    if (error.response) {
      yield put(authActions.signOutFailed(error.response.data.message));
    } else {
      yield put(authActions.signOutFailed(error.message));
    }
  }
}

function* watchSignOut() {
  yield takeLatest(authActions.signOutStart.type, fetchSignOut);
}

// * Get user sign in with google
function* getUserSignInWithGoogle() {
  try {
    const response = yield authAPI.getUserSignInWithGoogle();

    if (response) {
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.removeItem(config.localStorage.signInWithGoole);
      yield put(authActions.getUserSignInWithGoogleSucceed(response.data));
      yield put(authActions.getCurrentUserSucceed(response.data));
      yield put(appActions.setOpenOverlay(false));
      toast.success("Đăng nhập với google thành công.");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      if (error.response.data.message === "jwt refreshToken expired") {
        toast.info("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        yield put(authActions.signOutStart());
        return;
      }

      yield put(authActions.getCurrentUserFailed(error.response.data.message));
    } else {
      yield put(authActions.getCurrentUserFailed(error.message));
    }
  }
}

function* watchFetchGetUserSignInWithGoogle() {
  yield takeLatest(
    authActions.getUserSignInWithGoogle.type,
    getUserSignInWithGoogle
  );
}

function* authSaga() {
  yield all([
    watchFetchSignUp(),
    watchFetchSignIn(),
    watchFetchCurentUser(),
    watchSignOut(),
    watchFetchGetUserSignInWithGoogle(),
    watchFetchVerifySignUpHotel(),
    watchFetchSignUpAdmin(),
    watchFetchVerifySignInAdmin(),
  ]);
}

export default authSaga;
