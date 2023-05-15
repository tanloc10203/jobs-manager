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
  paginations: {
    page: 1,
    limit: 5,
    totalPage: 5,
  },
};

const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    // * Create
    createStart: (state, actions) => {
      state.isLoading = true;
    },
    createSucceed: (state) => {
      toast.success("Thêm trạng thái thành công.");
      state.isLoading = false;
    },
    failed: (state, { payload }) => {
      state.isLoading = false;
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

    // * GET Options ALL
    getAllOptionsStart: (state, actions) => {
      state.isLoading = true;
    },
    getAllOptionsSucceed: (state, { payload }) => {
      state.isLoading = false;
      state.dataOptions = payload;
    },

    // * UPDATE statusE.
    updateStart: (state, actions) => {
      state.isLoading = true;
    },
    updateSucceed: (state) => {
      toast.success("Cập nhật trạng thái thành công.");
      state.isLoading = false;
    },

    // * DELETE statusE.
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

const statusState = (state) => state.status;

const statusActions = statusSlice.actions;

const statusReducer = statusSlice.reducer;

export { statusActions, statusState };
export default statusReducer;
