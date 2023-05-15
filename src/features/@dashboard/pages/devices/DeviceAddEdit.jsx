import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { deviceAPI } from "~/apis";
import { appActions } from "~/features/app/appSlice";
import { authState } from "~/features/authentication/authSlice";
import { deviceActions } from "~/features/devices/deviceSlice";
import { deviceAddSchema } from "~/utils";
import { PageLayoutAddEdit } from "../../components";
import FormAddEditDevice from "../../components/device/FormAddEditDevice";

function DeviceAddEdit(props) {
  const { deviceId } = useParams();

  const isAddMode = !Boolean(deviceId);

  const [selected, setSelected] = useState({});

  const { user } = useSelector(authState);

  const dispatch = useDispatch();

  const initialValues = {
    dt_name: "",
    dt_desc: "",
    ...selected,
  };

  const getFloorById = async (id) => {
    try {
      dispatch(appActions.setOpenOverlay(true));
      const response = await deviceAPI.getById(id);
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
    if (!deviceId) return;

    getFloorById(deviceId);
  }, [deviceId]);

  const handleSubmit = (values) => {
    if (!values || _.isEmpty(user)) return;

    let data = {
      ...values,
      role: user.role,
      user_id: user.user_id,
    };

    return new Promise((resolve, reject) => {
      try {
        dispatch(appActions.setOpenOverlay(true));

        setTimeout(() => {
          if (isAddMode) {
            dispatch(deviceActions.createStart(data));
          } else {
            const { dt_name, dt_desc, ...data } = values;
            dispatch(
              deviceActions.updateStart({
                id: deviceId,
                data: {
                  dt_name,
                  dt_desc,
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
      title={`${isAddMode ? "Thêm" : "Cập nhật"} thiết bị`}
      backLink="/manager/device"
    >
      {(isAddMode || (!isAddMode && !_.isEmpty(selected))) && (
        <FormAddEditDevice
          onSubmit={handleSubmit}
          initialValues={initialValues}
          schema={deviceAddSchema}
        />
      )}
    </PageLayoutAddEdit>
  );
}

DeviceAddEdit.propTypes = {};

export default DeviceAddEdit;
