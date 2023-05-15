import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

export default function DialogConfirm({
  open,
  data,
  name,
  onClose,
  onConfirm,
  title = "Xác nhận trước khi bạn muốn xoá.",
  text = "Bạn có chắc chắn muốn xoá",
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {text + " "}
          <strong style={{ color: "red" }}>{name} ?</strong>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="error" autoFocus>
          Huỷ bỏ
        </Button>
        <Button onClick={() => onConfirm(data)} color="success">
          Đồng ý.
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DialogConfirm.propTypes = {
  open: PropTypes.bool.isRequired,
  data: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  onConfirm: PropTypes.func,
  text: PropTypes.string,
  title: PropTypes.string,
};
