import { Button, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import { ProfileSchema } from "~/utils";
import PropTypes from "prop-types";

function ProfileForm({ initialValues, onSubmit }) {
  const formik = useFormik({
    initialValues,
    validationSchema: ProfileSchema,
    onSubmit: (values) => {
      if (!onSubmit) return;

      onSubmit(values);
    },
  });

  const {
    errors,
    touched,
    handleSubmit,
    values,
    isSubmitting,
    setFieldValue,
    getFieldProps,
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <TextField
          margin="normal"
          {...getFieldProps("first_name")}
          error={Boolean(touched.first_name && errors.first_name)}
          helperText={touched.first_name && errors.first_name}
          label="Họ"
          fullWidth
          size="small"
        />

        <TextField
          margin="normal"
          {...getFieldProps("last_name")}
          error={Boolean(touched.last_name && errors.last_name)}
          helperText={touched.last_name && errors.last_name}
          label="Tên"
          fullWidth
          size="small"
        />

        <TextField
          margin="normal"
          {...getFieldProps("phone")}
          error={Boolean(touched.phone && errors.phone)}
          helperText={touched.phone && errors.phone}
          label="Số điện thoại"
          fullWidth
          size="small"
        />

        <TextField
          margin="normal"
          {...getFieldProps("email")}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email}
          label="Email"
          fullWidth
          disabled
          size="small"
        />

        <TextField
          margin="normal"
          {...getFieldProps("username")}
          error={Boolean(touched.username && errors.username)}
          helperText={touched.username && errors.username}
          label="Tài khoản đăng nhập"
          fullWidth
          size="small"
        />

        <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
          Cập nhật
        </Button>
      </Form>
    </FormikProvider>
  );
}

ProfileForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  onSubmit: PropTypes.func,
};

export default ProfileForm;
