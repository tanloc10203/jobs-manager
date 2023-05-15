import { useCallback, useEffect } from "react";
import { PageLayoutWithTable } from "../../components";

import { TableCell, TableRow, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import config from "~/configs";
import { userActions, userState } from "~/features/users/userSlice";

function Floor(props) {
  const { paginations, filters, data, isLoading } = useSelector(userState);
  const dispatch = useDispatch();

  const dataHead = [
    "Ma Người dùng",
    "Họ và tên",
    "E-mail",
    "Số điện thoại",
    "Quyền",
  ];

  useEffect(() => {
    dispatch(userActions.getAllStart({ ...filters }));
  }, [filters]);

  const handleOnPageChange = useCallback(
    (page) => {
      dispatch(userActions.setFilter({ ...filters, page }));
    },
    [filters]
  );

  const handleSearchNameFloor = (value) => {
    dispatch(
      userActions.setDebounceName({
        ...filters,
        search: value,
        page: 1,
      })
    );
  };

  return (
    <>
      <PageLayoutWithTable
        dataHead={dataHead}
        hidden
        title="Quản lý Người dùng"
        named="Người dùng"
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
                {row.user_id}
              </TableCell>
              <TableCell align="right">{`${row.last_name} ${row.first_name}`}</TableCell>
              <TableCell align="right">{row.email}</TableCell>
              <TableCell align="right">
                {row.phone || "Chưa cập nhật"}
              </TableCell>
              <TableCell align="right">
                <Typography
                  color={
                    row.role === config.user.role.USER
                      ? "blue"
                      : row.role === config.user.role.ADMIN
                      ? "red"
                      : "green"
                  }
                >
                  {row.role}
                </Typography>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell>Không có dữ liệu</TableCell>
          </TableRow>
        )}
      </PageLayoutWithTable>
    </>
  );
}

Floor.propTypes = {};

export default Floor;
