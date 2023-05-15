import { all, call, debounce, put, takeLatest } from "redux-saga/effects";
import { statusAPI } from "~/apis";
import { history } from "~/utils";
import { appActions } from "../app/appSlice";
import { statusActions } from "./statusSlice";

// * Create
function* fetchCreate({ payload }) {
  try {
    const response = yield call(statusAPI.create, payload);

    if (response) {
      yield put(statusActions.createSucceed());
      yield put(appActions.setOpenOverlay(false));
      history.push("/manager/status");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(statusActions.failed(error.response.data.message));
    } else {
      yield put(statusActions.failed(error.message));
    }
  }
}

function* watchFetchCreate() {
  yield takeLatest(statusActions.createStart.type, fetchCreate);
}

// * getAll
function* fetchgetAll({ payload }) {
  try {
    const response = yield call(statusAPI.getAll, payload);

    if (response) {
      yield put(statusActions.getAllSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(statusActions.failed(error.response.data.message));
    } else {
      yield put(statusActions.failed(error.message));
    }
  }
}

function* watchFetchGetAll() {
  yield takeLatest(statusActions.getAllStart.type, fetchgetAll);
}

// * GET ALL Options
function* fetchgetAllOptions() {
  try {
    const response = yield call(statusAPI.getAllOptions);

    if (response) {
      yield put(statusActions.getAllOptionsSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(statusActions.failed(error.response.data.message));
    } else {
      yield put(statusActions.failed(error.message));
    }
  }
}

function* watchFetchGetAllOptions() {
  yield takeLatest(statusActions.getAllOptionsStart.type, fetchgetAllOptions);
}

// * Update
function* fetchUpdate({ payload }) {
  try {
    const response = yield call(statusAPI.update, payload);

    if (response) {
      yield put(statusActions.updateSucceed());
      yield put(appActions.setOpenOverlay(false));
      history.push("/manager/status");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(statusActions.failed(error.response.data.message));
    } else {
      yield put(statusActions.failed(error.message));
    }
  }
}

function* watchFetchUpdate() {
  yield takeLatest(statusActions.updateStart.type, fetchUpdate);
}

// * Delete
function* fetchDelete({ payload }) {
  try {
    const response = yield call(statusAPI.delete, payload);

    if (response) {
      yield put(statusActions.deleteSucceed());
      yield put(appActions.setOpenOverlay(false));
      yield put(statusActions.getAllStart({ page: 1, limit: 10 }));
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(statusActions.failed(error.response.data.message));
    } else {
      yield put(statusActions.failed(error.message));
    }
  }
}

function* watchFetchDelete() {
  yield takeLatest(statusActions.deleteStart.type, fetchDelete);
}

// * use debounce
function* handleSearchWithDebounce({ payload }) {
  yield put(statusActions.setFilter(payload));
}

function* watchSetFilterWithDebounce() {
  yield debounce(
    500,
    statusActions.setDebounceName.type,
    handleSearchWithDebounce
  );
}

function* statusSaga() {
  yield all([
    watchFetchGetAll(),
    watchFetchCreate(),
    watchFetchUpdate(),
    watchFetchDelete(),
    watchFetchGetAllOptions(),
    watchSetFilterWithDebounce(),
  ]);
}

export default statusSaga;
