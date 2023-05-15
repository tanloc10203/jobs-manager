import _ from "lodash";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { statusAPI } from "~/apis";
import { appActions } from "~/features/app/appSlice";
import { statusActions } from "~/features/status/statusSlice";
import { getFieldOfObject, statusAddSchema } from "~/utils";
import { PageLayoutAddEdit } from "../../components";
import FormAddEditStatus from "../../components/status/FormAddEditStatus";

function StatusAddEdit(props) {
  const { statusId } = useParams();

  const isAddMode = !Boolean(statusId);

  const [selected, setSelected] = useState({});

  const dispatch = useDispatch();

  const initialValues = {
    type: "",
    desc: "",
    key: "",
    value: "",
    ...selected,
  };

  const getFloorById = async (id) => {
    try {
      dispatch(appActions.setOpenOverlay(true));
      const response = await statusAPI.getById(id);
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
    if (!statusId) return;

    getFloorById(statusId);
  }, [statusId]);

  const handleSubmit = (values) => {
    if (!values) return;

    return new Promise((resolve, reject) => {
      try {
        dispatch(appActions.setOpenOverlay(true));

        setTimeout(() => {
          if (isAddMode) {
            dispatch(statusActions.createStart(values));
          } else {
            dispatch(
              statusActions.updateStart({
                id: statusId,
                data: getFieldOfObject({
                  fileds: ["type", "desc", "key", "value"],
                  object: values,
                }),
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
        <FormAddEditStatus
          onSubmit={handleSubmit}
          initialValues={initialValues}
          schema={statusAddSchema}
        />
      )}
    </PageLayoutAddEdit>
  );
}

StatusAddEdit.propTypes = {};

export default StatusAddEdit;
