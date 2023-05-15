import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "~/features/app/appSlice";
import { billActions, billState } from "~/features/bill/billSlice";
import TextTrucate from "../../../../components/TextTrucate";
import { fDateTimeSuffix } from "../../../../utils/formatTime";
import { PageLayoutWithTable } from "../../components";
import DialogConfirm from "../../components/DialogConfim";
import BookingDetails from "./BookingDetails";
import statuses from "./status";

function Booking(props) {
  const { paginations, filters, data, isLoading, details } =
    useSelector(billState);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const dispatch = useDispatch();
  const [selected, setSelectedDelete] = useState({});
  const [selectedDetails, setSelectedDetails] = useState({});

  const dataHead = [
    "Mã hóa đơn",
    "Người đặt",
    "Đặt cho",
    "Phương thức thanh toán",
    "Ngày đặt",
    "Trạng thái",
    "Chức năng",
  ];

  useEffect(() => {
    dispatch(billActions.getAllStart({ ...filters }));
  }, [filters]);

  const handleOpenDialogConfirm = useCallback((bill) => {
    setSelectedDelete(bill);
    setOpen(true);
  }, []);

  const handleOnPageChange = useCallback(
    (page) => {
      dispatch(billActions.setFilter({ ...filters, page }));
    },
    [filters]
  );

  const handleSearchNameFloor = (value) => {
    dispatch(
      billActions.setDebounceName({
        ...filters,
        search: value,
        page: 1,
      })
    );
  };

  const handleOnclickSeeDetails = (data) => {
    setSelectedDetails(data);
    setOpenDialog(true);
    dispatch(billActions.getBillDetailByBillIdStart(data.bill_id));
  };

  const handleOnClickChangeStatus = (bill) => {
    dispatch(appActions.setOpenOverlay(true));
    setTimeout(() => {
      dispatch(
        billActions.changeStatusByBillIdStart({
          billId: bill.bill_id,
          data: { status: bill.status },
        })
      );
    }, 300);
    setOpen(false);
  };

  return (
    <>
      {!_.isEmpty(selected) && (
        <DialogConfirm
          open={open}
          data={{ ...selected }}
          name={`${statuses[selected.status].transform}`}
          onClose={() => setOpen(false)}
          onConfirm={handleOnClickChangeStatus}
          text={`Có chắc chắn rằng ${
            statuses[selected.status].temp
          } và bạn muốn chuyển trạng thái`}
          title="Xác nhận thay đổi trạng thái"
        />
      )}

      {!_.isEmpty(selectedDetails) && !details.isLoading && (
        <BookingDetails
          onClose={() => setOpenDialog(false)}
          data={{ ...selectedDetails, rooms: details.data || [] }}
          open={openDialog}
        />
      )}

      <PageLayoutWithTable
        hidden={true}
        dataHead={dataHead}
        title="Quản lý đặt phòng"
        named="Đặt phòng"
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
                <Tooltip title={row.bill_id} arrow placement="top-start">
                  <div>
                    <TextTrucate text={row.bill_id} width={100} />
                  </div>
                </Tooltip>
              </TableCell>
              <TableCell align="right">{`${row.last_name} ${row.first_name}`}</TableCell>
              <TableCell align="right">
                {row.booking_for === "ME" ? "Chính họ" : "Người khác"}
              </TableCell>
              <TableCell align="right">{row.payment}</TableCell>
              <TableCell align="right">
                {fDateTimeSuffix(row.created_at)}
              </TableCell>
              <TableCell align="right">
                <Typography
                  fontSize={14}
                  color={statuses[row.status].textColor}
                >
                  {statuses[row.status].value}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Tooltip title={statuses[row.status].title}>
                  <Box display="inline-block">
                    <IconButton
                      onClick={() => handleOpenDialogConfirm(row)}
                      size="small"
                      color={statuses[row.status].color}
                      disabled={statuses[row.status].disabled}
                    >
                      {statuses[row.status].icon}
                    </IconButton>
                  </Box>
                </Tooltip>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleOnclickSeeDetails(row)}
                >
                  <Tooltip title="Xem chi tiết">
                    <RemoveRedEyeIcon fontSize="inherit" />
                  </Tooltip>
                </IconButton>
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

Booking.propTypes = {};

export default Booking;
