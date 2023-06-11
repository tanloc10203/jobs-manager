import { LoadingButton } from "@mui/lab";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";
import FormGroupPer from "./FormGroupPer";

function FormAddEditRole(props) {
  const { initialValues, schema, onSubmit, loading, pers, onChangePer } = props;

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    enableReinitialize: true,
    onSubmit: (values, { resetForm }) => {
      onSubmit(values, resetForm);
    },
  });

  const { errors, touched, values, handleSubmit, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Tên vai trò"
          {...getFieldProps("name")}
          error={Boolean(touched.name && errors.name)}
          helperText={touched.name && errors.name}
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

        <Box my={2}>
          <Typography fontWeight="bold">Vai trò này có quyền gì?</Typography>
          <Typography fontWeight={300} fontSize={14} mt={1} color="gray">
            Check vào module hoặc các hành động bên dưới để chọn quyền.
          </Typography>
        </Box>

        <FormGroupPer pers={pers} onChange={onChangePer} />

        <LoadingButton
          sx={{ mt: 2 }}
          type="submit"
          loading={loading}
          variant="contained"
        >
          {initialValues?._id ? "Lưu" : "Thêm mới"}
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}

FormAddEditRole.propTypes = {
  initialValues: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  pers: PropTypes.array,
};

export default FormAddEditRole;
