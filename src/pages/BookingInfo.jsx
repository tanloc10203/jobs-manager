import React, { useCallback, useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import CancelIcon from "@mui/icons-material/Cancel";
import Page from "~/components/Page";
import { Footer, MailList, NavBar } from "~/components/home";
import { Container } from "@mui/system";
import TableInfo from "~/components/booking/TableInfo";
import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import TextTrucate from "~/components/TextTrucate";
import { fDateTimeSuffix } from "~/utils/formatTime";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import statuses from "~/features/@dashboard/pages/booking/status";
import { billActions, billState } from "~/features/bill/billSlice";
import { useDispatch, useSelector } from "react-redux";
import BookingDetails from "~/features/@dashboard/pages/booking/BookingDetails";
import _ from "lodash";
import { authState } from "~/features/authentication/authSlice";
import { differenceInDays } from "date-fns";
import DialogConfirm from "~/features/@dashboard/components/DialogConfim";
import { appActions } from "~/features/app/appSlice";

function BookingInfo(props) {
  const { paginations, filters, data, isLoading, details } =
    useSelector(billState);
  const [selectedDetails, setSelectedDetails] = useState({});
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useSelector(authState);
  const [open, setOpen] = useState(false);
  const [selected, setSelectedDelete] = useState({});

  useEffect(() => {
    if (_.isEmpty(user)) return;

    dispatch(
      billActions.getAllStart({
        ...filters,
        where: "b.user_id," + user.user_id,
      })
    );
  }, [filters, user]);

  const dataHead = [
    "Mã hóa đơn",
    "Người đặt",
    "Đặt cho",
    "Phương thức thanh toán",
    "Ngày đặt",
    "Trạng thái",
    "Chức năng",
  ];

  const handleOnclickSeeDetails = (data) => {
    setSelectedDetails(data);
    setOpenDialog(true);
    dispatch(billActions.getBillDetailByBillIdStart(data.bill_id));
  };

  const handleOpenDialogConfirm = useCallback((bill) => {
    setSelectedDelete(bill);
    setOpen(true);
  }, []);

  const handleOnClickChangeStatus = (bill) => {
    dispatch(appActions.setOpenOverlay(true));
    setTimeout(() => {
      dispatch(
        billActions.changeStatusByBillIdStart({
          billId: bill.bill_id,
          data: { status: "CANCEL" },
          where: "b.user_id," + user.user_id,
        })
      );
    }, 300);
    setOpen(false);
  };

  return (
    <Page title="Thông tin đặt phòng">
      <NavBar />

      <Container sx={{ p: 6 }} maxWidth="lg">
        {!_.isEmpty(selected) && (
          <DialogConfirm
            open={open}
            data={{ ...selected }}
            name={`${selected.bill_id}`}
            onClose={() => setOpen(false)}
            onConfirm={handleOnClickChangeStatus}
            text={`Có chắc chắn rằng bạn muốn huỷ đặt phòng`}
            title="Huỷ đặt phòng"
          />
        )}

        {!_.isEmpty(selectedDetails) && !details.isLoading && (
          <BookingDetails
            onClose={() => setOpenDialog(false)}
            data={{ ...selectedDetails, rooms: details.data || [] }}
            open={openDialog}
          />
        )}

        <TableInfo dataHead={dataHead}>
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
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleOnclickSeeDetails(row)}
                  >
                    <Tooltip title="Xem chi tiết">
                      <RemoveRedEyeIcon fontSize="inherit" />
                    </Tooltip>
                  </IconButton>
                  <Tooltip
                    title={
                      row.status === statuses.ENDED_USE.key
                        ? "Bạn đã kết thúc kì nghỉ"
                        : row.status === statuses.CANCEL.key
                        ? "Bạn đã hủy đặt phòng"
                        : row.date_count_cancel >= 1
                        ? "Thời gian huỷ vượt quá 1 ngày"
                        : "Bạn chỉ được huỷ trong khoảng thời gian 1 ngày"
                    }
                  >
                    <Box display="inline-block">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleOpenDialogConfirm(row)}
                        disabled={
                          row.status === statuses.ENDED_USE.key ||
                          row.status === statuses.CANCEL.key ||
                          row.date_count_cancel >= 1
                        }
                      >
                        <CancelIcon fontSize="inherit" />
                      </IconButton>
                    </Box>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell>Không có đơn đặt phòng nào!</TableCell>
            </TableRow>
          )}
        </TableInfo>
      </Container>

      <MailList />
      <Footer />
    </Page>
  );
}

BookingInfo.propTypes = {};

export default BookingInfo;
