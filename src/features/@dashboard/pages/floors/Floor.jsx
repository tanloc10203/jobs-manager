import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { PageLayoutWithTable } from "../../components";
import { floorActions, floorState } from "~/features/floors/floorSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link as RouterLink } from "react-router-dom";
import DialogConfirm from "../../components/DialogConfim";
import _ from "lodash";
import { appActions } from "~/features/app/appSlice";

function Floor(props) {
  const { paginations, filters, data, isLoading } = useSelector(floorState);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const [selectedDelete, setSelectedDelete] = useState({});

  const dataHead = [
    "Khách sạn",
    "Mã tầng",
    "Tên tầng",
    "Loại tầng",
    "Hành động",
  ];

  useEffect(() => {
    dispatch(floorActions.getAllStart({ ...filters, order: "floor_name" }));
  }, [filters]);

  const handleOpenDialogConfirm = useCallback((floor) => {
    setSelectedDelete(floor);
    setOpen(true);
  }, []);

  const handleDeleteFloor = useCallback((floor) => {
    if (!floor) return;
    dispatch(appActions.setOpenOverlay(true));
    dispatch(floorActions.deleteStart(floor.floor_id));
    setSelectedDelete({});
    setOpen(false);
  }, []);

  const handleOnPageChange = useCallback(
    (page) => {
      dispatch(floorActions.setFilter({ ...filters, page }));
    },
    [filters]
  );

  const handleSearchNameFloor = (value) => {
    dispatch(
      floorActions.setDebounceName({
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
        title="Quản lý Tầng"
        named="Tầng"
        linkToAdd="/manager/floor/add"
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
                {row.hotel_name}
              </TableCell>
              <TableCell align="right">{row.floor_id}</TableCell>
              <TableCell align="right">{row.floor_name}</TableCell>
              <TableCell align="right">{row.floor_type}</TableCell>
              <TableCell align="right">
                <Tooltip title="Chỉnh sửa">
                  <IconButton
                    size="small"
                    component={RouterLink}
                    to={`/manager/floor/update/${row.floor_id}`}
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
            <TableCell>
              Không có dữ liệu{" "}
              <i style={{ color: "red" }}>
                (* Vui lòng thêm khách sạn trước khi thêm tầng!)
              </i>
            </TableCell>
          </TableRow>
        )}
      </PageLayoutWithTable>
    </>
  );
}

Floor.propTypes = {};

export default Floor;
