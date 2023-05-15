import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import PropTypes from "prop-types";

export default function AlertDialog({ open, onClose }) {
  const handleClose = () => {
    if (!onClose) return;

    onClose();
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          color="infoText"
          textTransform="uppercase"
        >
          Gửi mail thành công
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            color="#82CD47"
            fontWeight="bold"
          >
            Vui lòng kiểm tra email của bạn để có thể thực hiện thay đổi mật
            khẩu
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="success" onClick={handleClose} autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

AlertDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
