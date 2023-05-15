import { all, call, put, takeLatest } from "redux-saga/effects";
import { revenueActions } from "./revenueSlice";
import revenueAPI from "~/apis/revenue";

function* fetchAllRevue() {
  try {
    const [dates, billCancel, month, rooms] = yield all([
      yield call(revenueAPI.getRevenueByDate),
      yield call(revenueAPI.getCountBillCancel),
      yield call(revenueAPI.getRevenueByMonth),
      yield call(revenueAPI.getRevenueByRoom),
    ]);

    const totalRevueByDate = dates.data.revenue;
    const totalBillCancel = billCancel.data;
    const totalRevueByRooms = rooms.data?.reduce(
      (total, value) => (total += value.revenue),
      0
    );
    const totalRevueByMonth = month.data.revenue;

    yield put(
      revenueActions.fetchAllRevueSuccess({
        totalBillCancel,
        totalRevueByDate,
        totalRevueByMonth,
        totalRevueByRooms,
      })
    );
  } catch (error) {
    console.log("fetchAllRevue saga failed!", error);

    if (error.response) {
      yield put(
        revenueActions.fetchAllRevueFailed(error.response.data.message)
      );
    } else {
      yield put(revenueActions.fetchAllRevueFailed(error.message));
    }
  }
}

function* watchFetchAllRevenue() {
  yield takeLatest(revenueActions.fetchAllRevueStart.type, fetchAllRevue);
}

function* revenueSaga() {
  yield all([watchFetchAllRevenue()]);
}

export default revenueSaga;
