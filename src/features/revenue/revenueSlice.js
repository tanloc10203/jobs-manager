import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  totalRevueByRooms: 0,
  totalBillCancel: 0,
  totalRevueByDate: 0,
  totalRevueByMonth: 0,
  error: "",
};

const revenueSlice = createSlice({
  name: "revenue",
  initialState,
  reducers: {
    fetchAllRevueStart: (state) => {
      state.isLoading = true;
    },
    fetchAllRevueSuccess: (state, { payload }) => {
      state.isLoading = false;
      state.totalRevueByDate = payload.totalRevueByDate;
      state.totalBillCancel = payload.totalBillCancel;
      state.totalRevueByRooms = payload.totalRevueByRooms;
      state.totalRevueByMonth = payload.totalRevueByMonth;
    },
    fetchAllRevueFailed: (state, { payload }) => {
      state.error = payload;
      state.isLoading = false;
    },
  },
});

const revenueState = (state) => state.revenue;

const revenueActions = revenueSlice.actions;

const revenueReducer = revenueSlice.reducer;

export { revenueActions, revenueState };
export default revenueReducer;
