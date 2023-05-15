import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

const initialState = {
  isLoading: false,
  data: [],
  dataOptions: [],
  hotel: {
    data: {},
    rooms: {},
    images: [],
    tags: [],
  },
  counts: {
    areas: {
      data: [],
      isLoading: false,
      error: "",
    },
  },
  error: "",
  filters: {
    page: 1,
    limit: 10,
  },
  paginations: {
    page: 1,
    limit: 10,
    totalPage: 5,
  },
};

const hotelSlice = createSlice({
  name: "hotel",
  initialState,
  reducers: {
    // * Create
    createStart: (state, actions) => {
      state.isLoading = true;
    },
    createSucceed: (state) => {
      toast.success("Thêm khách sạn thành công.");
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

    // * UPDATE HOTELE.
    updateStart: (state, actions) => {
      state.isLoading = true;
    },
    updateSucceed: (state) => {
      toast.success("Cập nhật khách sạn thành công.");
      state.isLoading = false;
    },

    // * DELETE HOTELE.
    deleteStart: (state, actions) => {
      state.isLoading = true;
    },
    deleteSucceed: (state) => {
      toast.success("Xoá khách sạn thành công.");
      state.isLoading = false;
    },

    // * COUNT AREA
    countAreaStart: (state) => {
      state.counts.areas.isLoading = true;
    },
    countAreaSucceed: (state, { payload }) => {
      state.counts.areas.isLoading = true;
      state.counts.areas.data = payload;
    },
    countAreaFailed: (state, { payload }) => {
      state.counts.areas.isLoading = false;
      state.counts.areas.error = payload;
      toast.error(payload);
    },

    // * FIND HOTEL.
    findHotelsStart: (state, actions) => {
      state.isLoading = true;
    },
    findHotelsSucceed: (state, { payload }) => {
      state.isLoading = false;
      state.data = payload;
    },

    // * FIND HOTEL BY SLUG.
    getHotelBySlugStart: (state, actions) => {
      state.isLoading = true;
    },
    getHotelBySlugSucceed: (state, { payload }) => {
      state.isLoading = false;
      state.hotel.data = payload.hotel;
      state.hotel.rooms = payload.rooms;
      state.hotel.images = payload.images;
      state.hotel.tags = payload.hotelTags;
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

const hotelState = (state) => state.hotel;

const dataAreaCountSelect = (state) => state.hotel.counts.areas;
const hotelSelect = (state) => state.hotel.hotel;

const hotelActions = hotelSlice.actions;

const hotelReducer = hotelSlice.reducer;

export { hotelActions, hotelState, dataAreaCountSelect, hotelSelect };
export default hotelReducer;
