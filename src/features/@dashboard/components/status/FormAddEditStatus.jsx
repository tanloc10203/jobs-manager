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

function FormAddEditStatus(props) {
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
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={6}>
                    <SelectForm
                      value={values.type}
                      error={Boolean(touched.type && errors.type)}
                      helperText={touched.type && errors.type}
                      label="Loại trạng thái"
                      name="type"
                      fullWidth
                      onChange={handleChange}
                    >
                      {types.length > 0 &&
                        types.map((p, index) => (
                          <MenuItem value={p.value} key={index}>
                            {p.label}
                          </MenuItem>
                        ))}
                    </SelectForm>
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <TextField
                      fullWidth
                      label="Mô tả"
                      {...getFieldProps("desc")}
                      error={Boolean(touched.desc && errors.desc)}
                      helperText={touched.desc && errors.desc}
                      margin="normal"
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <TextField
                      fullWidth
                      label="Key trạng thái"
                      {...getFieldProps("key")}
                      error={Boolean(touched.key && errors.key)}
                      helperText={touched.key && errors.key}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6}>
                    <TextField
                      fullWidth
                      label="Giá trị trạng thái"
                      {...getFieldProps("value")}
                      error={Boolean(touched.value && errors.value)}
                      helperText={touched.value && errors.value}
                    />
                  </Grid>
                </Grid>
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

FormAddEditStatus.propTypes = {
  initialValues: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FormAddEditStatus;
