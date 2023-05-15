import { createSelector, createSlice } from "@reduxjs/toolkit";

const initialState = {
  provices: [],
  districts: [],
  wards: [],
  loading: false,
  error: "",
};

const proviceSlice = createSlice({
  name: "provice",
  initialState,
  reducers: {
    // * PROVINCES
    getProvicesStart: (state) => {
      state.loading = true;
    },
    getProvicesSucceed: (state, { payload }) => {
      state.loading = false;
      state.provices = payload;
    },

    // * DISTRICTS
    getDistrictsStart: (state, actions) => {
      state.loading = true;
    },
    getDistrictsSucceed: (state, { payload }) => {
      state.loading = false;
      state.districts = payload;
    },

    // * WARDS
    getWardsStart: (state, actions) => {
      state.loading = true;
    },
    getWardsSucceed: (state, { payload }) => {
      state.loading = false;
      state.wards = payload;
    },

    // * FAILED
    getFailed: (state, { payload }) => {
      state.error = payload;
      state.loading = false;
    },
  },
});

const proviceState = (state) => state.provice;

const proviceActions = proviceSlice.actions;

const proviceReducer = proviceSlice.reducer;

const selectProvinceOptions = createSelector(proviceState, ({ provices }) => {
  const c = {
    province: "Tỉnh ".length,
    city: "Thành phố ".length,
  };

  if (provices.length) {
    return provices.map((item) => {
      const findCutString = item.province_name?.search("Thành phố");
      let cutString = c.province;

      if (findCutString !== -1) {
        cutString = c.city;
      }

      return {
        ...item,
        province_name: item?.province_name.substring(
          cutString,
          item?.province_name.length
        ),
      };
    });
  }

  return [];
});

export { proviceActions, proviceState, selectProvinceOptions };
export default proviceReducer;
