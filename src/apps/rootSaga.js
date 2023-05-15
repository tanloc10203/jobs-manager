import { all } from "redux-saga/effects";
import billSaga from "~/features/bill/billSaga";
import deviceSaga from "~/features/devices/deviceSaga";
import floorSaga from "~/features/floors/floorSaga";
import hotelSaga from "~/features/hotels/hotelSaga";
import proviceSaga from "~/features/provices/proviceSaga";
import roomTypeSaga from "~/features/room-types/roomTypeSaga";
import roomSaga from "~/features/rooms/roomSaga";
import statusSaga from "~/features/status/statusSaga";
import userSaga from "~/features/users/userSaga";
import authSaga from "../features/authentication/authSaga";
import revenueSaga from "~/features/revenue/revenueSaga";

function* rootSaga() {
  yield all([
    authSaga(),
    hotelSaga(),
    proviceSaga(),
    floorSaga(),
    deviceSaga(),
    roomTypeSaga(),
    statusSaga(),
    roomSaga(),
    billSaga(),
    userSaga(),
    revenueSaga(),
  ]);
}

export default rootSaga;
