import { all, call, debounce, put, takeLatest } from "redux-saga/effects";
import { userAPI } from "~/apis";
import { history } from "~/utils";
import { appActions } from "../app/appSlice";
import { userActions } from "./userSlice";

// * Create
function* fetchCreate({ payload }) {
  try {
    const response = yield call(userAPI.create, payload);

    if (response) {
      yield put(userActions.createSucceed());
      yield put(appActions.setOpenOverlay(false));
      history.push("/manager/floor");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(userActions.failed(error.response.data.message));
    } else {
      yield put(userActions.failed(error.message));
    }
  }
}

function* watchFetchCreate() {
  yield takeLatest(userActions.createStart.type, fetchCreate);
}

// * getAll
function* fetchgetAll({ payload }) {
  try {
    const response = yield call(userAPI.getAll, payload);

    if (response) {
      yield put(userActions.getAllSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(userActions.failed(error.response.data.message));
    } else {
      yield put(userActions.failed(error.message));
    }
  }
}

function* watchFetchGetAll() {
  yield takeLatest(userActions.getAllStart.type, fetchgetAll);
}

// * GET ALL Options
function* fetchgetAllOptions() {
  try {
    const response = yield call(userAPI.getAllOptions);

    if (response) {
      yield put(userActions.getAllOptionsSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(userActions.failed(error.response.data.message));
    } else {
      yield put(userActions.failed(error.message));
    }
  }
}

function* watchFetchGetAllOptions() {
  yield takeLatest(userActions.getAllOptionsStart.type, fetchgetAllOptions);
}

// * Update
function* fetchUpdate({ payload }) {
  try {
    const response = yield call(userAPI.update, payload);

    if (response) {
      yield put(userActions.updateSucceed());
      yield put(appActions.setOpenOverlay(false));
      yield put(appActions.setText(""));
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    yield put(appActions.setText(""));
    if (error.response) {
      yield put(userActions.failed(error.response.data.message));
    } else {
      yield put(userActions.failed(error.message));
    }
  }
}

function* watchFetchUpdate() {
  yield takeLatest(userActions.updateStart.type, fetchUpdate);
}

// * Delete
function* fetchDelete({ payload }) {
  try {
    const response = yield call(userAPI.delete, payload);

    if (response) {
      yield put(userActions.deleteSucceed());
      yield put(appActions.setOpenOverlay(false));
      yield put(userActions.getAllStart({ page: 1, limit: 10 }));
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(userActions.failed(error.response.data.message));
    } else {
      yield put(userActions.failed(error.message));
    }
  }
}

function* watchFetchDelete() {
  yield takeLatest(userActions.deleteStart.type, fetchDelete);
}

// * use debounce
function* handleSearchWithDebounce({ payload }) {
  yield put(userActions.setFilter(payload));
}

function* watchSetFilterWithDebounce() {
  yield debounce(
    500,
    userActions.setDebounceName.type,
    handleSearchWithDebounce
  );
}

function* userSaga() {
  yield all([
    watchFetchGetAll(),
    watchFetchCreate(),
    watchFetchUpdate(),
    watchFetchDelete(),
    watchFetchGetAllOptions(),
    watchSetFilterWithDebounce(),
  ]);
}

export default userSaga;
