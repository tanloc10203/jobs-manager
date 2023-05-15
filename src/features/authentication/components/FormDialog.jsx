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
import { toast } from "react-toastify";
import * as Yup from "yup";
import { authAPI } from "~/apis";
import AlertDialog from "~/components/AlertDialog";
import { appActions } from "~/features/app/appSlice";

export default function FormDialog({ open, onClose, onOpen }) {
  const ForgotPwdSchema = Yup.object().shape({
    username: Yup.string().required("Tài khoản là trường bắt buộc."),
    email: Yup.string()
      .email("Vui lòng điền email hợp lệ")
      .required("Email là trường  bắt buộc."),
  });
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const dispatch = useDispatch();

  const handleFetchForgotPwd = async (data) => {
    try {
      const response = await authAPI.forgotPwd(data);

      if (response && response.isValid) {
        setLoading(false);
        handleClose();
        setOpenDialog(true);
        dispatch(appActions.setOpenOverlay(false));
      }
    } catch (error) {
      onOpen();
      setLoading(false);
      dispatch(appActions.setOpenOverlay(false));

      let message = error.message;

      if (error?.response && error.response.data) {
        message = error.response.data.message;
      }

      return toast.error(message);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
    },
    validationSchema: ForgotPwdSchema,
    onSubmit: (values) => {
      return new Promise(async (resolve, reject) => {
        dispatch(appActions.setOpenOverlay(true));
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
      <AlertDialog open={openDialog} onClose={() => setOpenDialog(false)} />

      <FormikProvider value={formik}>
        <Dialog open={open} onClose={handleClose}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>Quên mật khẩu</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Vui lòng điền chính xác thông tin.
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

              <TextField
                variant="standard"
                fullWidth
                autoComplete="username"
                label="Tài khoản"
                margin="dense"
                {...getFieldProps("username")}
                error={Boolean(touched.username && errors.username)}
                helperText={touched.username && errors.username}
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
