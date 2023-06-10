import { LoadingButton } from "@mui/lab";
import { TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";

function FormAddEditPermission(props) {
  const { initialValues, schema, onSubmit, loading } = props;

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values, resetForm);
    },
  });

  const {
    errors,
    touched,
    values,
    handleSubmit,
    setFieldValue,
    getFieldProps,
  } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Tên quyền"
          {...getFieldProps("name")}
          error={Boolean(touched.name && errors.name)}
          helperText={touched.name && errors.name}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Slug"
          {...getFieldProps("slug")}
          error={Boolean(touched.slug && errors.slug)}
          helperText={(touched.slug && errors.slug) || "VD: product.add"}
          margin="normal"
        />

        <TextField
          fullWidth
          label="Mô tả"
          {...getFieldProps("desc")}
          error={Boolean(touched.desc && errors.desc)}
          helperText={touched.desc && errors.desc}
          multiline
          rows={3}
          margin="normal"
        />

        <LoadingButton
          sx={{ mt: 2 }}
          type="submit"
          loading={loading}
          variant="contained"
        >
          Thêm mới
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}

FormAddEditPermission.propTypes = {
  initialValues: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};

export default FormAddEditPermission;
