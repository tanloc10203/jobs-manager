import { all, call, debounce, put, takeLatest } from "redux-saga/effects";
import { deviceAPI } from "~/apis";
import { history } from "~/utils";
import { appActions } from "../app/appSlice";
import { deviceActions } from "./deviceSlice";

// * Create
function* fetchCreate({ payload }) {
  try {
    const response = yield call(deviceAPI.create, payload);

    if (response) {
      yield put(deviceActions.createSucceed());
      yield put(appActions.setOpenOverlay(false));
      history.push("/manager/device");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(deviceActions.failed(error.response.data.message));
    } else {
      yield put(deviceActions.failed(error.message));
    }
  }
}

function* watchFetchCreate() {
  yield takeLatest(deviceActions.createStart.type, fetchCreate);
}

// * getAll
function* fetchgetAll({ payload }) {
  try {
    const response = yield call(deviceAPI.getAll, payload);

    if (response) {
      yield put(deviceActions.getAllSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(deviceActions.failed(error.response.data.message));
    } else {
      yield put(deviceActions.failed(error.message));
    }
  }
}

function* watchFetchGetAll() {
  yield takeLatest(deviceActions.getAllStart.type, fetchgetAll);
}

// * GET ALL Options
function* fetchgetAllOptions() {
  try {
    const response = yield call(deviceAPI.getAllOptions);

    if (response) {
      yield put(deviceActions.getAllOptionsSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(deviceActions.failed(error.response.data.message));
    } else {
      yield put(deviceActions.failed(error.message));
    }
  }
}

function* watchFetchGetAllOptions() {
  yield takeLatest(deviceActions.getAllOptionsStart.type, fetchgetAllOptions);
}

// * Update
function* fetchUpdate({ payload }) {
  try {
    const response = yield call(deviceAPI.update, payload);

    if (response) {
      yield put(deviceActions.updateSucceed());
      yield put(appActions.setOpenOverlay(false));
      history.push("/manager/device");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(deviceActions.failed(error.response.data.message));
    } else {
      yield put(deviceActions.failed(error.message));
    }
  }
}

function* watchFetchUpdate() {
  yield takeLatest(deviceActions.updateStart.type, fetchUpdate);
}

// * Delete
function* fetchDelete({ payload }) {
  try {
    const response = yield call(deviceAPI.delete, payload);

    if (response) {
      yield put(deviceActions.deleteSucceed());
      yield put(appActions.setOpenOverlay(false));
      yield put(deviceActions.getAllStart({ page: 1, limit: 10 }));
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(deviceActions.failed(error.response.data.message));
    } else {
      yield put(deviceActions.failed(error.message));
    }
  }
}

function* watchFetchDelete() {
  yield takeLatest(deviceActions.deleteStart.type, fetchDelete);
}

// * use debounce
function* handleSearchWithDebounce({ payload }) {
  yield put(deviceActions.setFilter(payload));
}

function* watchSetFilterWithDebounce() {
  yield debounce(
    500,
    deviceActions.setDebounceName.type,
    handleSearchWithDebounce
  );
}

function* deviceSaga() {
  yield all([
    watchFetchGetAll(),
    watchFetchCreate(),
    watchFetchUpdate(),
    watchFetchDelete(),
    watchFetchGetAllOptions(),
    watchSetFilterWithDebounce(),
  ]);
}

export default deviceSaga;
