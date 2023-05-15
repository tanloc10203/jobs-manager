import { all, call, debounce, put, takeLatest } from "redux-saga/effects";
import { billAPI } from "~/apis";
import { history } from "~/utils";
import { appActions } from "../app/appSlice";
import { billActions } from "./billSlice";

// * Create
function* fetchCreate({ payload }) {
  try {
    const response = yield call(billAPI.create, payload);

    if (response) {
      if (response.url) {
        window.location.href = response.url;
        return;
      }

      yield put(billActions.createSucceed());
      yield put(appActions.setOpenOverlay(false));
      yield put(appActions.setText(""));
      history.push("/return");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    yield put(appActions.setText(""));
    if (error.response) {
      yield put(billActions.failed(error.response.data.message));
    } else {
      yield put(billActions.failed(error.message));
    }
  }
}

function* watchFetchCreate() {
  yield takeLatest(billActions.createStart.type, fetchCreate);
}

// * getAll
function* fetchgetAll({ payload }) {
  try {
    const response = yield call(billAPI.getAll, payload);

    if (response) {
      yield put(billActions.getAllSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(billActions.failed(error.response.data.message));
    } else {
      yield put(billActions.failed(error.message));
    }
  }
}

function* watchFetchGetAll() {
  yield takeLatest(billActions.getAllStart.type, fetchgetAll);
}

// * GET ALL Options
function* fetchgetAllOptions() {
  try {
    const response = yield call(billAPI.getAllOptions);

    if (response) {
      yield put(billActions.getAllOptionsSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(billActions.failed(error.response.data.message));
    } else {
      yield put(billActions.failed(error.message));
    }
  }
}

function* watchFetchGetAllOptions() {
  yield takeLatest(billActions.getAllOptionsStart.type, fetchgetAllOptions);
}

// * GET bill details by bill id
function* fetchGetBillDetailByIdBill({ payload }) {
  try {
    const response = yield call(billAPI.getBillDetailsByIdBill, payload);

    if (response) {
      yield put(billActions.getBillDetailByBillIdSucceed(response.data));
    }
  } catch (error) {
    if (error.response) {
      yield put(billActions.failed(error.response.data.message));
    } else {
      yield put(billActions.failed(error.message));
    }
  }
}

function* watchFetchGetBillDetailByIdBill() {
  yield takeLatest(
    billActions.getBillDetailByBillIdStart.type,
    fetchGetBillDetailByIdBill
  );
}

// * Update
function* fetchUpdate({ payload }) {
  try {
    const response = yield call(billAPI.update, payload);

    if (response) {
      yield put(billActions.updateSucceed());
      yield put(appActions.setOpenOverlay(false));
      history.push("/manager/status");
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(billActions.failed(error.response.data.message));
    } else {
      yield put(billActions.failed(error.message));
    }
  }
}

function* watchFetchUpdate() {
  yield takeLatest(billActions.updateStart.type, fetchUpdate);
}

// * change Status By Bill Id
function* fetchChangeStatusByBillId({ payload }) {
  try {
    const { where, ...otherPayload } = payload;

    const response = yield call(billAPI.changeStatusByBillId, otherPayload);

    if (response) {
      yield put(billActions.changeStatusByBillIdSucceed());
      yield put(appActions.setOpenOverlay(false));
      const filters = where
        ? { page: 1, limit: 5, where }
        : { page: 1, limit: 5 };
      yield put(billActions.getAllStart(filters));
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(billActions.failed(error.response.data.message));
    } else {
      yield put(billActions.failed(error.message));
    }
  }
}

function* watchFetchChangeStatusByBillId() {
  yield takeLatest(
    billActions.changeStatusByBillIdStart.type,
    fetchChangeStatusByBillId
  );
}

// * Delete
function* fetchDelete({ payload }) {
  try {
    const response = yield call(billAPI.delete, payload);

    if (response) {
      yield put(billActions.deleteSucceed());
      yield put(appActions.setOpenOverlay(false));
      yield put(billActions.getAllStart({ page: 1, limit: 10 }));
    }
  } catch (error) {
    yield put(appActions.setOpenOverlay(false));
    if (error.response) {
      yield put(billActions.failed(error.response.data.message));
    } else {
      yield put(billActions.failed(error.message));
    }
  }
}

function* watchFetchDelete() {
  yield takeLatest(billActions.deleteStart.type, fetchDelete);
}

// * use debounce
function* handleSearchWithDebounce({ payload }) {
  yield put(billActions.setFilter(payload));
}

function* watchSetFilterWithDebounce() {
  yield debounce(
    500,
    billActions.setDebounceName.type,
    handleSearchWithDebounce
  );
}

function* billSaga() {
  yield all([
    watchFetchGetAll(),
    watchFetchCreate(),
    watchFetchUpdate(),
    watchFetchDelete(),
    watchFetchGetAllOptions(),
    watchSetFilterWithDebounce(),
    watchFetchGetBillDetailByIdBill(),
    watchFetchChangeStatusByBillId(),
  ]);
}

export default billSaga;
