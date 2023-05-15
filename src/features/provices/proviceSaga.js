import { all, call, put, takeLatest } from "redux-saga/effects";
import provinceApi from "~/apis/provice";
import { proviceActions } from "./proviceSlice";

// * GET PROVINCES
function* getProvices() {
  try {
    const response = yield call(provinceApi.getListProvince);
    yield put(proviceActions.getProvicesSucceed(response.results));
  } catch (error) {
    yield put(proviceActions.getFailed(error.message));
  }
}

function* watchGetProvinces() {
  yield takeLatest(proviceActions.getProvicesStart.type, getProvices);
}

// * GET DISTRICTS
function* getDistricts({ payload }) {
  try {
    const response = yield call(provinceApi.getListDistrict, payload);
    yield put(proviceActions.getDistrictsSucceed(response.results));
  } catch (error) {
    yield put(proviceActions.getFailed(error.message));
  }
}

function* watchGetDistricts() {
  yield takeLatest(proviceActions.getDistrictsStart.type, getDistricts);
}

// * GET WARDS
function* getWards({ payload }) {
  try {
    const response = yield call(provinceApi.getListWard, payload);
    yield put(proviceActions.getWardsSucceed(response.results));
  } catch (error) {
    yield put(proviceActions.getFailed(error.message));
  }
}

function* watchGetWards() {
  yield takeLatest(proviceActions.getWardsStart.type, getWards);
}

function* proviceSaga() {
  yield all([watchGetProvinces(), watchGetDistricts(), watchGetWards()]);
}

export default proviceSaga;
