import { Form, FormikProvider, useFormik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
// material
import { LoadingButton } from "@mui/lab";
import {
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";
import Iconify from "~/components/Iconify";
import { appActions } from "~/features/app/appSlice";
import { authActions } from "~/features/authentication/authSlice";
import FormDialog from "~/features/authentication/components/FormDialog";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required("Tài khoản là trường bắt buộc."),
    password: Yup.string().required("Mật khẩu là trường  bắt buộc."),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {
      return new Promise((resolve, reject) => {
        dispatch(appActions.setOpenOverlay(true));

        setTimeout(() => {
          dispatch(authActions.signInStart(values));
          resolve(true);
        }, 1000);
      });
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <FormDialog
        open={open}
        onClose={handleClose}
        onOpen={() => setOpen(true)}
      />
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              autoComplete="username"
              type="text"
              label="Tài khoản"
              {...getFieldProps("username")}
              error={Boolean(touched.username && errors.username)}
              helperText={touched.username && errors.username}
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? "text" : "password"}
              label="Mật khẩu"
              {...getFieldProps("password")}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Iconify
                        icon={
                          showPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                        }
                      />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ my: 2 }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  {...getFieldProps("remember")}
                  checked={values.remember}
                />
              }
              label="Ghi nhớ"
            />

            <Link
              variant="subtitle2"
              style={{ cursor: "pointer" }}
              underline="hover"
              onClick={() => setOpen(true)}
            >
              Quên mật khẩu?
            </Link>
          </Stack>

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Đăng nhập
          </LoadingButton>
        </Form>
      </FormikProvider>
    </>
  );
}
