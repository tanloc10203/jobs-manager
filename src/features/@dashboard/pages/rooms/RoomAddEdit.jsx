import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { roomAPI } from "~/apis";
import { appActions } from "~/features/app/appSlice";
import { floorActions } from "~/features/floors/floorSlice";
import { hotelActions } from "~/features/hotels/hotelSlice";
import { roomTypeActions } from "~/features/room-types/roomTypeSlice";
import { roomActions } from "~/features/rooms/roomSlice";
import { statusActions } from "~/features/status/statusSlice";
import { roomAddSchema } from "~/utils";
import { PageLayoutAddEdit } from "../../components";
import FormAddEditRoom from "../../components/room/FormAddEditRoom";

function RoomAddEdit(props) {
  const { roomId } = useParams();

  const isAddMode = !Boolean(roomId);

  const [selected, setSelected] = useState({});

  const dispatch = useDispatch();

  const initialValues = {
    room_name: "",
    room_desc: "",
    max_people: "",
    hotel_id: "",
    rt_id: "",
    floor_id: "",
    status_id: "",
    price: 0,
    discount: false,
    percent_discount: 0,
    room_quantity: 0,
    ...selected,
  };

  const getById = async (id) => {
    try {
      dispatch(appActions.setOpenOverlay(true));
      const response = await roomAPI.getById(id);
      if (response.data) {
        setSelected(response.data);
        dispatch(
          floorActions.getAllStart({
            where: `hotel_id,${response.data?.hotel_id}`,
          })
        );
      }
      dispatch(appActions.setOpenOverlay(false));
    } catch (error) {
      dispatch(appActions.setOpenOverlay(false));
      console.log("error:::", error);
    }
  };

  useEffect(() => {
    if (!roomId) return;
    getById(roomId);
  }, [roomId]);

  useEffect(() => {
    dispatch(hotelActions.getAllOptionsStart());
    dispatch(statusActions.getAllStart({ where: "type,KH" }));
    dispatch(roomTypeActions.getAllStart({ limit: 50 }));
  });

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
            dispatch(roomActions.createStart(values));
          } else {
            const { rt_name, rt_desc, rt_type, ...data } = values;
            dispatch(
              roomActions.updateStart({
                id: roomId,
                data: values,
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
      title={`${isAddMode ? "Thêm" : "Cập nhật"} phòng`}
      backLink="/manager/room"
    >
      {(isAddMode || (!isAddMode && !_.isEmpty(selected))) && (
        <FormAddEditRoom
          onSubmit={handleSubmit}
          initialValues={initialValues}
          schema={roomAddSchema}
        />
      )}
    </PageLayoutAddEdit>
  );
}

RoomAddEdit.propTypes = {};

export default RoomAddEdit;
