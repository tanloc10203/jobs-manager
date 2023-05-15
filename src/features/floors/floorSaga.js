import { all, call, debounce, put, takeLatest } from "redux-saga/effects";
import { floorAPI } from "~/apis";
import { history } from "~/utils";
import { appActions } from "../app/appSlice";
import { floorActions } from "./floorSlice";

// * Create
function* fetchCreate({ payload }) {
  try {
    const response = yield call(floorAPI.create, payload);

    if (response) {
      yield put(floorActions.createSucceed());
      yield put(appActions.setOpenOverlay(false));
      history.push("/manager/floor");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(floorActions.failed(error.response.data.message));
    } else {
      yield put(floorActions.failed(error.message));
    }
  }
}

function* watchFetchCreate() {
  yield takeLatest(floorActions.createStart.type, fetchCreate);
}

// * getAll
function* fetchgetAll({ payload }) {
  try {
    const response = yield call(floorAPI.getAll, payload);

    if (response) {
      yield put(floorActions.getAllSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(floorActions.failed(error.response.data.message));
    } else {
      yield put(floorActions.failed(error.message));
    }
  }
}

function* watchFetchGetAll() {
  yield takeLatest(floorActions.getAllStart.type, fetchgetAll);
}

// * GET ALL Options
function* fetchgetAllOptions() {
  try {
    const response = yield call(floorAPI.getAllOptions);

    if (response) {
      yield put(floorActions.getAllOptionsSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(floorActions.failed(error.response.data.message));
    } else {
      yield put(floorActions.failed(error.message));
    }
  }
}

function* watchFetchGetAllOptions() {
  yield takeLatest(floorActions.getAllOptionsStart.type, fetchgetAllOptions);
}

// * Update
function* fetchUpdate({ payload }) {
  try {
    const response = yield call(floorAPI.update, payload);

    if (response) {
      yield put(floorActions.updateSucceed());
      yield put(appActions.setOpenOverlay(false));
      history.push("/manager/floor");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(floorActions.failed(error.response.data.message));
    } else {
      yield put(floorActions.failed(error.message));
    }
  }
}

function* watchFetchUpdate() {
  yield takeLatest(floorActions.updateStart.type, fetchUpdate);
}

// * Delete
function* fetchDelete({ payload }) {
  try {
    const response = yield call(floorAPI.delete, payload);

    if (response) {
      yield put(floorActions.deleteSucceed());
      yield put(appActions.setOpenOverlay(false));
      yield put(floorActions.getAllStart({ page: 1, limit: 10 }));
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(floorActions.failed(error.response.data.message));
    } else {
      yield put(floorActions.failed(error.message));
    }
  }
}

function* watchFetchDelete() {
  yield takeLatest(floorActions.deleteStart.type, fetchDelete);
}

// * use debounce
function* handleSearchWithDebounce({ payload }) {
  yield put(floorActions.setFilter(payload));
}

function* watchSetFilterWithDebounce() {
  yield debounce(
    500,
    floorActions.setDebounceName.type,
    handleSearchWithDebounce
  );
}

function* floorSaga() {
  yield all([
    watchFetchGetAll(),
    watchFetchCreate(),
    watchFetchUpdate(),
    watchFetchDelete(),
    watchFetchGetAllOptions(),
    watchSetFilterWithDebounce(),
  ]);
}

export default floorSaga;
