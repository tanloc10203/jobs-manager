import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { hotelAPI } from "~/apis";
import { appActions } from "~/features/app/appSlice";
import { hotelActions } from "~/features/hotels/hotelSlice";
import { proviceActions } from "~/features/provices/proviceSlice";
import { hotetAddSchema } from "~/utils";
import { FormAddEditHotel, PageLayoutAddEdit } from "../../components";

function HotelAddEdit(props) {
  const { hotelId } = useParams();

  const isAddMode = !Boolean(hotelId);

  const [selectedHotel, setSelectedHotel] = useState({});

  const dispatch = useDispatch();

  const getHotelById = async (id) => {
    try {
      dispatch(appActions.setOpenOverlay(true));
      const response = await hotelAPI.getById(id);
      if (response.data) {
        setSelectedHotel(response.data);
        dispatch(proviceActions.getDistrictsStart(response.data?.provice_code));
        dispatch(proviceActions.getWardsStart(response.data?.district_code));
      }
      dispatch(appActions.setOpenOverlay(false));
    } catch (error) {
      dispatch(appActions.setOpenOverlay(false));
      console.log("error:::", error);
    }
  };

  useEffect(() => {
    if (!hotelId) return;

    getHotelById(hotelId);
  }, [hotelId]);

  const initialValues = {
    hotel_name: "",
    hotel_desc: "",
    hotel_address: "",
    provice_code: "",
    district_code: "",
    ward_code: "",
    provice_name: "",
    district_name: "",
    ward_name: "",
    tax: 0,
    ...selectedHotel,
  };

  const handleSubmit = (values) => {
    if (!values) return;

    Object.keys(values).map(
      (key) => values[key] === null && delete values[key]
    );

    return new Promise((resolve, reject) => {
      try {
        dispatch(appActions.setOpenOverlay(true));

        setTimeout(() => {
          if (isAddMode) {
            dispatch(hotelActions.createStart(values));
          } else {
            dispatch(hotelActions.updateStart({ id: hotelId, data: values }));
          }
          resolve(true);
        }, 1500);
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <PageLayoutAddEdit
      title={`${isAddMode ? "Thêm" : "Cập nhật"} Khách sạn`}
      backLink="/manager/hotel"
    >
      {(isAddMode || (!isAddMode && !_.isEmpty(selectedHotel))) && (
        <FormAddEditHotel
          onSubmit={handleSubmit}
          initialValues={initialValues}
          schema={hotetAddSchema}
        />
      )}
    </PageLayoutAddEdit>
  );
}

export default HotelAddEdit;
