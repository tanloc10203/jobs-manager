import { LoadingButton } from "@mui/lab";
import { Card, CardContent, Grid, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";

function FormAddEditRoomType(props) {
  const { initialValues, schema, onSubmit } = props;

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      if (!onSubmit) return;
      onSubmit(values);
    },
  });

  const { errors, touched, handleSubmit, setFieldValue, getFieldProps } =
    formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8}>
            <Card>
              <CardContent>
                <TextField
                  fullWidth
                  label="Tên loại phòng"
                  {...getFieldProps("rt_name")}
                  error={Boolean(touched.rt_name && errors.rt_name)}
                  helperText={touched.rt_name && errors.rt_name}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={4}
                  {...getFieldProps("rt_desc")}
                  error={Boolean(touched.rt_desc && errors.rt_desc)}
                  helperText={touched.rt_desc && errors.rt_desc}
                  margin="normal"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Card>
              <CardContent>
                <TextField
                  fullWidth
                  label="Kí hiệu loại phòng"
                  {...getFieldProps("rt_type")}
                  error={Boolean(touched.rt_type && errors.rt_type)}
                  helperText={touched.rt_type && errors.rt_type}
                  margin="normal"
                />

                <LoadingButton
                  sx={{ mt: 2 }}
                  type="submit"
                  loading={false}
                  fullWidth
                  variant="contained"
                >
                  {initialValues.floor_id ? "Lưu thay đổi" : "Hoàn thành"}
                </LoadingButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

FormAddEditRoomType.propTypes = {
  initialValues: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FormAddEditRoomType;
