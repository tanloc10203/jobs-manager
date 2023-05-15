import { LoadingButton } from "@mui/lab";
import { Card, CardContent, Grid, MenuItem, TextField } from "@mui/material";
import { Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { hotelState } from "~/features/hotels/hotelSlice";
import SelectForm from "../forms/SelectForm";

function FormAddEditFloor(props) {
  const { initialValues, schema, onSubmit } = props;

  const { dataOptions } = useSelector(hotelState);

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
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

  const handleChange = async (event) => {
    await setFieldValue("hotel_id", event.target.value);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8}>
            <Card>
              <CardContent>
                <TextField
                  fullWidth
                  label="Tên tầng"
                  {...getFieldProps("floor_name")}
                  error={Boolean(touched.floor_name && errors.floor_name)}
                  helperText={touched.floor_name && errors.floor_name}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Loại tầng"
                  {...getFieldProps("floor_type")}
                  error={Boolean(touched.floor_type && errors.floor_type)}
                  helperText={touched.floor_type && errors.floor_type}
                  margin="normal"
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Card>
              <CardContent>
                <SelectForm
                  value={values.hotel_id}
                  error={Boolean(touched.hotel_id && errors.hotel_id)}
                  helperText={touched.hotel_id && errors.hotel_id}
                  label="Khách sạn"
                  name="hotel_id"
                  onChange={handleChange}
                >
                  {dataOptions.length > 0 &&
                    dataOptions.map((p) => (
                      <MenuItem value={p.hotel_id} key={p.hotel_id}>
                        {p.hotel_name}
                      </MenuItem>
                    ))}
                </SelectForm>
              </CardContent>
            </Card>

            <LoadingButton
              sx={{ mt: 2 }}
              type="submit"
              loading={false}
              fullWidth
              variant="contained"
            >
              {initialValues.floor_id ? "Lưu thay đổi" : "Hoàn thành"}
            </LoadingButton>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

FormAddEditFloor.propTypes = {
  initialValues: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FormAddEditFloor;
