import CloseIcon from "@mui/icons-material/Close";
import { Tooltip } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { differenceInDays } from "date-fns";
import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import TextTrucate from "~/components/TextTrucate";
import { calcPriceDiscount } from "~/utils";
import { fPrice } from "~/utils/formatNumber";
import { formatDateVN } from "~/utils/formatTime";
import statuses from "./status";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function BookingDetails({ data, open, onClose }) {
  const resultCountDate = useMemo(() => {
    const result = differenceInDays(
      new Date(data?.end_date),
      new Date(data?.start_date)
    );
    return result === 0 ? 1 : result;
  }, [data]);

  return (
    <div>
      <BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle id="customized-dialog-title" onClose={onClose}>
          Chi tiết đặt phòng của
          <Typography color="blue">{`${data?.last_name || ""} ${
            data?.first_name || ""
          }`}</Typography>
        </BootstrapDialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            Đặt cho:{" "}
            <strong>
              {data.booking_for === "ME" ? "Chính anh ấy" : "Cho người khác"}
            </strong>
          </Typography>
          {data.booking_for !== "ME" && (
            <>
              <Typography gutterBottom>
                Họ tên khách hàng: <strong>{data.customer_fullname}</strong>
              </Typography>
              <Typography gutterBottom>
                E-mail khách hàng: <strong>{data.customer_email}</strong>
              </Typography>
            </>
          )}
          <Typography gutterBottom>
            Đã đặt phòng của khách sạn: <strong>{data.hotel_name}</strong>
          </Typography>
          <Typography gutterBottom>
            Ngày nhận phòng:{" "}
            <strong>{formatDateVN(new Date(data.start_date))}</strong>
          </Typography>
          <Typography gutterBottom>
            Ngày trả phòng:{" "}
            <strong>{formatDateVN(new Date(data.end_date))}</strong>
          </Typography>
          <Typography gutterBottom>
            Tổng giá: <strong>{fPrice(data.total_price)}</strong>{" "}
            <i style={{ color: "red" }}>(* Đã bao gồm thuế)</i>
          </Typography>
          <Typography gutterBottom>
            Hình thức thanh toán: <strong>{data.payment}</strong>
          </Typography>
          <Typography gutterBottom>
            Trạng thái đơn đặt phòng: <strong>{data.status}</strong>{" "}
            <i style={{ color: "red" }}>(* {statuses[data.status].value})</i>
          </Typography>
          <Typography gutterBottom>
            Đã sử dụng voucher:{" "}
            <strong>{data.voucher || "Không có sử dụng"}</strong>
          </Typography>
          <Typography gutterBottom>
            Tổng số đêm nghỉ dưỡng:{" "}
            <i style={{ color: "red" }}>{`${resultCountDate} đêm`}</i>
          </Typography>
          <Typography fontWeight={700}>Ghi chú:</Typography>
          <Typography gutterBottom fontStyle="italic">
            {data.note || "Không có ghi chú"}
          </Typography>
          <Typography fontWeight={700}>Phòng đã đặt</Typography>

          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Mã phòng</TableCell>
                  <TableCell align="right">Tên phòng</TableCell>
                  <TableCell align="right">Số lượng đặt</TableCell>
                  <TableCell align="right">Giá</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.rooms?.length &&
                  data.rooms.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        <Tooltip title={row.room_id}>
                          <div>
                            <TextTrucate text={row.room_id} width={100} />
                          </div>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="right">{row.room_name}</TableCell>
                      <TableCell align="right">{row.room_quantity}</TableCell>
                      <TableCell align="right">{fPrice(row.price)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
      </BootstrapDialog>
    </div>
  );
}

BookingDetails.propTypes = {
  data: PropTypes.object,
};
