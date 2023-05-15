import { LoadingButton } from "@mui/lab";
import { Card, CardContent, Grid, MenuItem, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";
import { useCallback } from "react";
import SelectForm from "../forms/SelectForm";

const types = [
  { label: "Khách sạn", value: "KH" },
  { label: "Hoá đơn", value: "HD" },
];

function FormAddEditDevice(props) {
  const { initialValues, schema, onSubmit } = props;

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      if (!onSubmit) return;
      onSubmit(values);
    },
  });

  console.log(initialValues);

  const {
    errors,
    touched,
    values,
    handleSubmit,
    setFieldValue,
    getFieldProps,
  } = formik;

  const handleChange = useCallback(async (event) => {
    await setFieldValue("type", event.target.value);
  }, []);

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8}>
            <Card>
              <CardContent>
                <TextField
                  fullWidth
                  row={4}
                  label="Tên thiết bị"
                  {...getFieldProps("dt_name")}
                  error={Boolean(touched.dt_name && errors.dt_name)}
                  helperText={touched.dt_name && errors.dt_name}
                  margin="normal"
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Mô tả"
                  {...getFieldProps("dt_desc")}
                  error={Boolean(touched.dt_desc && errors.dt_desc)}
                  helperText={touched.dt_desc && errors.dt_desc}
                  margin="normal"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Card>
              <CardContent>
                <LoadingButton
                  sx={{ mt: 2 }}
                  type="submit"
                  loading={false}
                  fullWidth
                  variant="contained"
                >
                  {initialValues.dt_id ? "Lưu thay đổi" : "Hoàn thành"}
                </LoadingButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

FormAddEditDevice.propTypes = {
  initialValues: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FormAddEditDevice;
