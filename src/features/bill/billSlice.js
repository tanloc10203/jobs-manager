import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  data: [],
  error: "",
  filters: {
    page: 0,
    limit: 5,
  },
  details: {
    isLoading: false,
    data: [],
  },
  paginations: {
    page: 1,
    limit: 5,
    totalPage: 5,
  },
};

const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    // * Create
    createStart: (state, actions) => {
      state.isLoading = true;
    },
    createSucceed: (state) => {
      state.isLoading = false;
    },
    failed: (state, { payload }) => {
      state.isLoading = false;
      state.details.isLoading = false;
      state.error = payload;
      toast.error(state.error);
    },

    // * GET ALL
    getAllStart: (state, actions) => {
      state.isLoading = true;
    },
    getAllSucceed: (state, { payload }) => {
      state.isLoading = false;
      state.data = payload.result;
      state.paginations = {
        ...state.paginations,
        ...payload.paginations,
      };
    },

    // * GET bill details by billid
    getBillDetailByBillIdStart: (state, actions) => {
      state.details.isLoading = true;
    },
    getBillDetailByBillIdSucceed: (state, { payload }) => {
      state.details.isLoading = false;
      state.details.data = payload;
    },

    // * GET Options ALL
    getAllOptionsStart: (state, actions) => {
      state.isLoading = true;
    },
    getAllOptionsSucceed: (state, { payload }) => {
      state.isLoading = false;
      state.dataOptions = payload;
    },

    // * UPDATE billE.
    updateStart: (state, actions) => {
      state.isLoading = true;
    },
    updateSucceed: (state) => {
      toast.success("Cập nhật trạng thái thành công.");
      state.isLoading = false;
    },

    // * change Status By Bill Id
    changeStatusByBillIdStart: (state, actions) => {
      state.isLoading = true;
    },
    changeStatusByBillIdSucceed: (state) => {
      toast.success("Cập nhật trạng thái thành công.");
      state.isLoading = false;
    },

    // * DELETE billE.
    deleteStart: (state, actions) => {
      state.isLoading = true;
    },
    deleteSucceed: (state) => {
      toast.success("Xoá trạng thái thành công.");
      state.isLoading = false;
    },

    // * SET FILTER
    setFilter: (state, { payload }) => {
      state.filters = {
        ...state.filters,
        ...payload,
      };
    },

    // * Use debounce search name
    setDebounceName: (state, actions) => {},
  },
});

const billState = (state) => state.bill;

const billActions = billSlice.actions;

const billReducer = billSlice.reducer;

export { billActions, billState };
export default billReducer;
