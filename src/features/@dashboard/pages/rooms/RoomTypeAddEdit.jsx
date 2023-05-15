import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { roomTypeAPI } from "~/apis";
import { appActions } from "~/features/app/appSlice";
import { roomTypeActions } from "~/features/room-types/roomTypeSlice";
import { roomTypeAddSchema } from "~/utils";
import { PageLayoutAddEdit } from "../../components";
import FormAddEditRoomType from "../../components/room-type/FormAddEditRoomType";

function RoomTypeAddEdit(props) {
  const { roomTypeId } = useParams();

  const isAddMode = !Boolean(roomTypeId);

  const [selected, setSelected] = useState({});

  const dispatch = useDispatch();

  const initialValues = {
    rt_name: "",
    rt_desc: "",
    rt_type: "",
    ...selected,
  };

  const getById = async (id) => {
    try {
      dispatch(appActions.setOpenOverlay(true));
      const response = await roomTypeAPI.getById(id);
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
    if (!roomTypeId) return;

    getById(roomTypeId);
  }, [roomTypeId]);

  const handleSubmit = (values) => {
    if (!values) return;

    return new Promise((resolve, reject) => {
      try {
        dispatch(appActions.setOpenOverlay(true));

        setTimeout(() => {
          if (isAddMode) {
            dispatch(roomTypeActions.createStart(values));
          } else {
            const { rt_name, rt_desc, rt_type, ...data } = values;
            dispatch(
              roomTypeActions.updateStart({
                id: roomTypeId,
                data: {
                  rt_type,
                  rt_name,
                  rt_desc,
                },
              })
            );
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
      title={`${isAddMode ? "Thêm" : "Cập nhật"} loại phòng`}
      backLink="/manager/room-type"
    >
      {(isAddMode || (!isAddMode && !_.isEmpty(selected))) && (
        <FormAddEditRoomType
          onSubmit={handleSubmit}
          initialValues={initialValues}
          schema={roomTypeAddSchema}
        />
      )}
    </PageLayoutAddEdit>
  );
}

RoomTypeAddEdit.propTypes = {};

export default RoomTypeAddEdit;
