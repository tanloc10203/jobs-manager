import { combineReducers } from "@reduxjs/toolkit";
import appReducer from "~/features/app/appSlice";
import authReducer from "~/features/authentication/authSlice";
import billReducer from "~/features/bill/billSlice";
import deviceReducer from "~/features/devices/deviceSlice";
import floorReducer from "~/features/floors/floorSlice";
import hotelReducer from "~/features/hotels/hotelSlice";
import proviceReducer from "~/features/provices/proviceSlice";
import revenueReducer from "~/features/revenue/revenueSlice";
import roomTypeReducer from "~/features/room-types/roomTypeSlice";
import roomReducer from "~/features/rooms/roomSlice";
import statusReducer from "~/features/status/statusSlice";
import userReducer from "~/features/users/userSlice";

const rootReducers = combineReducers({
  auth: authReducer,
  app: appReducer,
  hotel: hotelReducer,
  provice: proviceReducer,
  floor: floorReducer,
  device: deviceReducer,
  roomType: roomTypeReducer,
  status: statusReducer,
  room: roomReducer,
  bill: billReducer,
  user: userReducer,
  revenue: revenueReducer,
});

export default rootReducers;
