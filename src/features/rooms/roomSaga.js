import { all, call, debounce, put, takeLatest } from "redux-saga/effects";
import { roomAPI } from "~/apis";
import { history } from "~/utils";
import { appActions } from "../app/appSlice";
import { roomActions } from "./roomSlice";

// * Create
function* fetchCreate({ payload }) {
  try {
    const response = yield call(roomAPI.create, payload);

    if (response) {
      yield put(roomActions.createSucceed());
      yield put(appActions.setOpenOverlay(false));
      history.push("/manager/room");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(roomActions.failed(error.response.data.message));
    } else {
      yield put(roomActions.failed(error.message));
    }
  }
}

function* watchFetchCreate() {
  yield takeLatest(roomActions.createStart.type, fetchCreate);
}

// * getAll
function* fetchgetAll({ payload }) {
  try {
    const response = yield call(roomAPI.getAll, payload);

    if (response) {
      yield put(roomActions.getAllSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(roomActions.failed(error.response.data.message));
    } else {
      yield put(roomActions.failed(error.message));
    }
  }
}

function* watchFetchGetAll() {
  yield takeLatest(roomActions.getAllStart.type, fetchgetAll);
}

// * GET ALL Options
function* fetchgetAllOptions() {
  try {
    const response = yield call(roomAPI.getAllOptions);

    if (response) {
      yield put(roomActions.getAllOptionsSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(roomActions.failed(error.response.data.message));
    } else {
      yield put(roomActions.failed(error.message));
    }
  }
}

function* watchFetchGetAllOptions() {
  yield takeLatest(roomActions.getAllOptionsStart.type, fetchgetAllOptions);
}

// * Update
function* fetchUpdate({ payload }) {
  try {
    const response = yield call(roomAPI.update, payload);

    if (response) {
      yield put(roomActions.updateSucceed());
      yield put(appActions.setOpenOverlay(false));
      history.push("/manager/room");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(roomActions.failed(error.response.data.message));
    } else {
      yield put(roomActions.failed(error.message));
    }
  }
}

function* watchFetchUpdate() {
  yield takeLatest(roomActions.updateStart.type, fetchUpdate);
}

// * Delete
function* fetchDelete({ payload }) {
  try {
    const response = yield call(roomAPI.delete, payload);

    if (response) {
      yield put(roomActions.deleteSucceed());
      yield put(appActions.setOpenOverlay(false));
      yield put(roomActions.getAllStart({ page: 1, limit: 10 }));
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(roomActions.failed(error.response.data.message));
    } else {
      yield put(roomActions.failed(error.message));
    }
  }
}

function* watchFetchDelete() {
  yield takeLatest(roomActions.deleteStart.type, fetchDelete);
}

// * use debounce
function* handleSearchWithDebounce({ payload }) {
  yield put(roomActions.setFilter(payload));
}

function* watchSetFilterWithDebounce() {
  yield debounce(
    500,
    roomActions.setDebounceName.type,
    handleSearchWithDebounce
  );
}

function* roomSaga() {
  yield all([
    watchFetchGetAll(),
    watchFetchCreate(),
    watchFetchUpdate(),
    watchFetchDelete(),
    watchFetchGetAllOptions(),
    watchSetFilterWithDebounce(),
  ]);
}

export default roomSaga;
