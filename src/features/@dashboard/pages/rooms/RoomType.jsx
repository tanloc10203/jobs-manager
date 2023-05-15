import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton, TableCell, TableRow, Tooltip } from "@mui/material";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { appActions } from "~/features/app/appSlice";
import {
  roomTypeActions,
  roomTypeState,
} from "~/features/room-types/roomTypeSlice";
import { PageLayoutWithTable } from "../../components";
import DialogConfirm from "../../components/DialogConfim";

function RoomType(props) {
  const { paginations, filters, data, isLoading } = useSelector(roomTypeState);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [selectedDelete, setSelectedDelete] = useState({});

  const dataHead = [
    "Mã loại phòng",
    "Tên loại phòng",
    "Kí hiệu",
    "Mô tả",
    "Hành động",
  ];

  useEffect(() => {
    dispatch(roomTypeActions.getAllStart({ ...filters, order: "rt_name" }));
  }, [filters]);

  const handleOpenDialogConfirm = useCallback((roomType) => {
    setSelectedDelete(roomType);
    setOpen(true);
  }, []);

  const handleDeleteFloor = useCallback((roomType) => {
    if (!roomType) return;
    dispatch(appActions.setOpenOverlay(true));
    dispatch(roomTypeActions.deleteStart(roomType.rt_id));
    setSelectedDelete({});
    setOpen(false);
  }, []);

  const handleOnPageChange = useCallback(
    (page) => {
      dispatch(roomTypeActions.setFilter({ ...filters, page }));
    },
    [filters]
  );

  const handleSearchNameFloor = (value) => {
    dispatch(
      roomTypeActions.setDebounceName({
        ...filters,
        search: value,
        page: 1,
      })
    );
  };

  return (
    <>
      {!_.isEmpty(selectedDelete) && (
        <DialogConfirm
          open={open}
          data={selectedDelete}
          name={selectedDelete.floor_name}
          onClose={() => setOpen(false)}
          onConfirm={handleDeleteFloor}
        />
      )}

      <PageLayoutWithTable
        dataHead={dataHead}
        title="Quản lý loại phòng"
        named="Loại phòng"
        linkToAdd="/manager/room-type/add"
        loading={isLoading}
        pagination={paginations}
        onPageChange={handleOnPageChange}
        onInputSearchChange={handleSearchNameFloor}
      >
        {data && data.length ? (
          data.map((row, index) => (
            <TableRow
              key={index}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.rt_id}
              </TableCell>
              <TableCell align="right">{row.rt_name}</TableCell>
              <TableCell align="right">{row.rt_type}</TableCell>
              <TableCell align="right">{row.rt_desc}</TableCell>
              <TableCell align="right">
                <Tooltip title="Chỉnh sửa">
                  <IconButton
                    size="small"
                    component={RouterLink}
                    to={`/manager/room-type/update/${row.rt_id}`}
                  >
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Xoá">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleOpenDialogConfirm(row)}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell>Không có dữ liệu!</TableCell>
          </TableRow>
        )}
      </PageLayoutWithTable>
    </>
  );
}

RoomType.propTypes = {};

export default RoomType;
