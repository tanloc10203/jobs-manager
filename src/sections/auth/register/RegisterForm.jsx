import { Form, FormikProvider, useFormik } from "formik";
import { useState } from "react";
// material
import { LoadingButton } from "@mui/lab";
import { IconButton, InputAdornment, Stack, TextField } from "@mui/material";
// component
import { useSelector } from "react-redux";
import { authState } from "~/features/authentication/authSlice";
import { RegisterSchema } from "~/utils";
import Iconify from "../../../components/Iconify";

// ----------------------------------------------------------------------

export default function RegisterForm({ onSubmit }) {
  const { isLoading } = useSelector(authState);

  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      if (!onSubmit) return;
      onSubmit(values);
    },
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              fullWidth
              label="Họ và tên"
              {...getFieldProps("fullName")}
              error={Boolean(touched.fullName && errors.fullName)}
              helperText={touched.fullName && errors.fullName}
            />
          </Stack>

          <TextField
            fullWidth
            autoComplete="email"
            type="email"
            label="Địa chỉ E-mail"
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={
              (touched.email && errors.email) ||
              "Mọi thao tác đều sử dụng email. Nhập chính xác."
            }
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
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isLoading}
          >
            Đăng ký
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
