import { all, call, debounce, put, takeLatest } from "redux-saga/effects";
import { roomTypeAPI } from "~/apis";
import { history } from "~/utils";
import { appActions } from "../app/appSlice";
import { roomTypeActions } from "./roomTypeSlice";

// * Create
function* fetchCreate({ payload }) {
  try {
    const response = yield call(roomTypeAPI.create, payload);

    if (response) {
      yield put(roomTypeActions.createSucceed());
      yield put(appActions.setOpenOverlay(false));
      history.push("/manager/room-type");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(roomTypeActions.failed(error.response.data.message));
    } else {
      yield put(roomTypeActions.failed(error.message));
    }
  }
}

function* watchFetchCreate() {
  yield takeLatest(roomTypeActions.createStart.type, fetchCreate);
}

// * getAll
function* fetchgetAll({ payload }) {
  try {
    const response = yield call(roomTypeAPI.getAll, payload);

    if (response) {
      yield put(roomTypeActions.getAllSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(roomTypeActions.failed(error.response.data.message));
    } else {
      yield put(roomTypeActions.failed(error.message));
    }
  }
}

function* watchFetchGetAll() {
  yield takeLatest(roomTypeActions.getAllStart.type, fetchgetAll);
}

// * GET ALL Options
function* fetchgetAllOptions() {
  try {
    const response = yield call(roomTypeAPI.getAllOptions);

    if (response) {
      yield put(roomTypeActions.getAllOptionsSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(roomTypeActions.failed(error.response.data.message));
    } else {
      yield put(roomTypeActions.failed(error.message));
    }
  }
}

function* watchFetchGetAllOptions() {
  yield takeLatest(roomTypeActions.getAllOptionsStart.type, fetchgetAllOptions);
}

// * Update
function* fetchUpdate({ payload }) {
  try {
    const response = yield call(roomTypeAPI.update, payload);

    if (response) {
      yield put(roomTypeActions.updateSucceed());
      yield put(appActions.setOpenOverlay(false));
      history.push("/manager/room-type");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(roomTypeActions.failed(error.response.data.message));
    } else {
      yield put(roomTypeActions.failed(error.message));
    }
  }
}

function* watchFetchUpdate() {
  yield takeLatest(roomTypeActions.updateStart.type, fetchUpdate);
}

// * Delete
function* fetchDelete({ payload }) {
  try {
    const response = yield call(roomTypeAPI.delete, payload);

    if (response) {
      yield put(roomTypeActions.deleteSucceed());
      yield put(appActions.setOpenOverlay(false));
      yield put(roomTypeActions.getAllStart({ page: 1, limit: 10 }));
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(roomTypeActions.failed(error.response.data.message));
    } else {
      yield put(roomTypeActions.failed(error.message));
    }
  }
}

function* watchFetchDelete() {
  yield takeLatest(roomTypeActions.deleteStart.type, fetchDelete);
}

// * use debounce
function* handleSearchWithDebounce({ payload }) {
  yield put(roomTypeActions.setFilter(payload));
}

function* watchSetFilterWithDebounce() {
  yield debounce(
    500,
    roomTypeActions.setDebounceName.type,
    handleSearchWithDebounce
  );
}

function* roomTypeSaga() {
  yield all([
    watchFetchGetAll(),
    watchFetchCreate(),
    watchFetchUpdate(),
    watchFetchDelete(),
    watchFetchGetAllOptions(),
    watchSetFilterWithDebounce(),
  ]);
}

export default roomTypeSaga;
