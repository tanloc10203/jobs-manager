import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { floorAPI } from "~/apis";
import { appActions } from "~/features/app/appSlice";
import { floorActions } from "~/features/floors/floorSlice";
import { hotelActions } from "~/features/hotels/hotelSlice";
import { florAddSchema } from "~/utils";
import { PageLayoutAddEdit } from "../../components";
import FormAddEditFloor from "../../components/floors/FormAddEditFloor";

function FloorAddEdit(props) {
  const { floorId } = useParams();

  const isAddMode = !Boolean(floorId);

  const [selected, setSelected] = useState({});

  const dispatch = useDispatch();

  const initialValues = {
    floor_name: "",
    floor_type: "",
    hotel_id: "",
    ...selected,
  };

  const getFloorById = async (id) => {
    try {
      dispatch(appActions.setOpenOverlay(true));
      const response = await floorAPI.getById(id);
      if (response.data) {
        setSelected(response.data);
      }
      dispatch(appActions.setOpenOverlay(false));
    } catch (error) {
      dispatch(appActions.setOpenOverlay(false));
      console.log("error:::", error);
    }
  };

  useEffect(() => {
    dispatch(hotelActions.getAllOptionsStart());
  }, []);

  useEffect(() => {
    if (!floorId) return;

    getFloorById(floorId);
  }, [floorId]);

  const handleSubmit = (values) => {
    if (!values) return;

    return new Promise((resolve, reject) => {
      try {
        dispatch(appActions.setOpenOverlay(true));

        setTimeout(() => {
          if (isAddMode) {
            dispatch(floorActions.createStart(values));
          } else {
            const { hotel_name, ...data } = values;
            dispatch(floorActions.updateStart({ id: floorId, data }));
          }
          resolve(true);
        }, 500);
      } catch (error) {
        reject(error);
      }
    });
  };

  return (
    <PageLayoutAddEdit
      title={`${isAddMode ? "Thêm" : "Cập nhật"} tầng`}
      backLink="/manager/floor"
    >
      {(isAddMode || (!isAddMode && !_.isEmpty(selected))) && (
        <FormAddEditFloor
          onSubmit={handleSubmit}
          initialValues={initialValues}
          schema={florAddSchema}
        />
      )}
    </PageLayoutAddEdit>
  );
}

FloorAddEdit.propTypes = {};

export default FloorAddEdit;
