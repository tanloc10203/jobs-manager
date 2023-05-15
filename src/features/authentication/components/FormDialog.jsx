import { LoadingButton } from "@mui/lab";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { authAPI } from "~/apis";
import { appActions } from "~/features/app/appSlice";

export default function FormDialog({ open, onClose, onOpen }) {
  const ForgotPwdSchema = Yup.object().shape({
    email: Yup.string()
      .email("Vui lòng điền email hợp lệ")
      .required("Email là trường  bắt buộc."),
  });
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const handleFetchForgotPwd = async (data) => {
    try {
      const response = await authAPI.forgotPwd(data);

      if (response) {
        setLoading(false);
        dispatch(appActions.setOpenOverlay(false));
        dispatch(appActions.setText(""));

        Swal.fire({
          title: "Gửi e-mail thành công.",
          text: "Vui lòng kiểm tra email của bạn để có thể thực hiện thay đổi mật khẩu",
          icon: "success",
        });

        handleClose();
      }
    } catch (error) {
      onOpen();
      setLoading(false);
      dispatch(appActions.setOpenOverlay(false));
      dispatch(appActions.setText(""));

      let message = error.message;

      if (error?.response && error.response.data) {
        message = error.response.data.message;
      }

      return Swal.fire({
        icon: "error",
        title: "Đã xảy ra lỗi...",
        text: `${message}`,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgotPwdSchema,
    onSubmit: (values) => {
      return new Promise(async (resolve, reject) => {
        dispatch(appActions.setOpenOverlay(true));
        dispatch(appActions.setText("Đang thực hiện..."));
        setLoading(true);
        onClose();

        setTimeout(() => {
          handleFetchForgotPwd(values);
          resolve(true);
        }, 2000);
      });
    },
  });

  const { errors, touched, handleSubmit, getFieldProps, resetForm } = formik;

  const handleClose = () => {
    if (!onClose) return;

    resetForm();

    onClose();
  };

  return (
    <>
      <FormikProvider value={formik}>
        <Dialog open={open} onClose={handleClose}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>Quên mật khẩu</DialogTitle>
            <DialogContent sx={{ minWidth: { md: 500, sm: 200 } }}>
              <DialogContentText>
                Vui lòng điền chính xác email đã đăng ký.
              </DialogContentText>

              <TextField
                variant="standard"
                fullWidth
                autoComplete="email"
                type="email"
                label="E-mail"
                margin="dense"
                {...getFieldProps("email")}
                error={Boolean(touched.email && errors.email)}
                helperText={touched.email && errors.email}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="error">
                Huỷ bỏ
              </Button>
              <LoadingButton type="submit" loading={loading}>
                Gửi
              </LoadingButton>
            </DialogActions>
          </Form>
        </Dialog>
      </FormikProvider>
    </>
  );
}

FormDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func,
};
