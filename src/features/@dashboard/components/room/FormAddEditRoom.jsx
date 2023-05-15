import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import NumericFormatCustom from "~/components/form/Number/NumericFormatCustom";
import { floorActions, floorState } from "~/features/floors/floorSlice";
import { hotelState } from "~/features/hotels/hotelSlice";
import { roomTypeState } from "~/features/room-types/roomTypeSlice";
import { statusState } from "~/features/status/statusSlice";
import { getBlobImg } from "~/utils";
import SelectForm from "../forms/SelectForm";
import OverviewImg from "../OverviewImg";

const ContainedImageStyle = styled(Stack)(({ theme }) => ({
  border: "1px dotted #ddd",
  padding: 10,
  borderRadius: 7,
  height: "auto",
  cursor: "pointer",
  transition: "all 0.25s",
  "&>*": {
    transition: "all 0.25s",
  },
}));

function FormAddEditRoom(props) {
  const { initialValues, schema, onSubmit } = props;
  const { dataOptions: optionsHotels } = useSelector(hotelState);
  const { data: optionStatus } = useSelector(statusState);
  const { data: optionFloor } = useSelector(floorState);
  const { data: optionRoomType } = useSelector(roomTypeState);
  const fileRef = useRef();
  const filesRef = useRef();

  const [imgBlob, setImgBlob] = useState({});
  const [imgsBlob, setImgsBlob] = useState([]);
  const [file, setFile] = useState([]);
  const [files, setFiles] = useState([]);
  const [imgsDelete, setImgsDelete] = useState([]);
  const dispatch = useDispatch();
  const [openPrecentDiscount, setOpenPrecentDiscount] = useState(false);

  useEffect(() => {
    if (!initialValues?.room_id) return;

    setOpenPrecentDiscount(initialValues.discount);

    if (initialValues?.images) {
      const newImagesBlob = initialValues?.images.map((img) => ({
        id: img.r_image_id,
        room_id: img.room_id,
        url: img.r_image_value,
        file_name: img.file_name,
      }));

      setImgsBlob(newImagesBlob);
    }
  }, [initialValues]);

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      if (
        !onSubmit ||
        (!initialValues?.room_id && (!file.length || !files.length))
      )
        return;

      let newValues = {
        ...values,
        price: Number(values.price),
        room_thumb: file,
        r_image_value: files,
      };

      if (initialValues?.room_id) {
        const { images, ...others } = newValues;

        if (!imgsBlob.length)
          return toast.error("Vui lòng chọn danh sách ảnh.");

        // if(img)

        newValues = {
          ...others,
          img_delete: imgsDelete.length ? imgsDelete : null,
          room_thumb: file.length ? file : null,
          r_image_value: files.length ? files : null,
        };
      }

      onSubmit(newValues);
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

  const handleOpenInputFile = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleOpenInputFiles = useCallback(() => {
    if (filesRef.current) {
      filesRef.current.click();
    }
  }, []);

  const handleChangeImg = useCallback(async (event) => {
    if (!event.target.files[0]) return;

    setFile([...event.target.files]);

    const imgBlob = await getBlobImg(event.target.files[0]);

    setImgBlob((pre) => imgBlob);
  }, []);

  const handleChangeImgs = useCallback(async (event) => {
    if (!event.target.files.length) return;

    setFiles((prev) => [...prev, ...event.target.files]);

    const response = await Promise.all(
      [...event.target.files].map((file) => getBlobImg(file))
    );

    setImgsBlob((pre) => [...pre, ...response]);
  });

  const handleDeleteImgBlob = () => {
    setImgBlob({});
    setFile([]);
  };

  const handleDeleteImgsBlob = (img) => {
    const newFiles = files.filter((f) => f.lastModified !== img.id);
    const newImgsBlob = imgsBlob.filter((i) => i.id !== img.id);

    setFiles(() => newFiles);
    setImgsBlob(() => newImgsBlob);

    if (initialValues?.room_id && img.room_id) {
      setImgsDelete((pre) => [...pre, img]);
    }
  };

  const handleChange = useCallback(async (event) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "hotel_id") {
      dispatch(floorActions.getAllStart({ where: `hotel_id,${value}` }));
    }

    await setFieldValue(name, value);
  }, []);

  const handleChangeCheckbox = async (event, value) => {
    setOpenPrecentDiscount(value);
    await setFieldValue("discount", value);
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
                  label="Tên phòng"
                  {...getFieldProps("room_name")}
                  error={Boolean(touched.room_name && errors.room_name)}
                  helperText={touched.room_name && errors.room_name}
                  margin="normal"
                />

                <Grid
                  container
                  spacing={1}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid item xs={12} sm={12} md={openPrecentDiscount ? 4 : 6}>
                    <TextField
                      fullWidth
                      label="Giá phòng 1 đêm"
                      {...getFieldProps("price")}
                      error={Boolean(touched.price && errors.price)}
                      helperText={touched.price && errors.price}
                      margin="normal"
                      InputProps={{
                        inputComponent: NumericFormatCustom,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={openPrecentDiscount ? 4 : 6}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            defaultChecked={initialValues.discount}
                            {...getFieldProps("discount")}
                            onChange={handleChangeCheckbox}
                          />
                        }
                        label="Giảm giá"
                      />
                    </FormGroup>
                  </Grid>
                  {openPrecentDiscount && (
                    <Grid item xs={12} sm={12} md={4}>
                      <TextField
                        fullWidth
                        type="number"
                        label="Phần trăm giảm giá"
                        {...getFieldProps("percent_discount")}
                        error={Boolean(
                          touched.percent_discount && errors.percent_discount
                        )}
                        helperText={
                          touched.percent_discount && errors.percent_discount
                        }
                        margin="normal"
                      />
                    </Grid>
                  )}
                </Grid>

                <TextField
                  fullWidth
                  label="Mô tả"
                  multiline
                  rows={4}
                  {...getFieldProps("room_desc")}
                  error={Boolean(touched.room_desc && errors.room_desc)}
                  helperText={touched.room_desc && errors.room_desc}
                  margin="normal"
                />

                <Box mt={2} height="100%">
                  <Typography variant="body1" color="#212B36">
                    Danh sách ảnh
                  </Typography>

                  <input
                    type="file"
                    ref={filesRef}
                    multiple
                    hidden
                    accept="image/*"
                    onChange={handleChangeImgs}
                  />

                  <ContainedImageStyle spacing={2} sx={{ height: 200 }}>
                    <Stack
                      width="100%"
                      height="100%"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        background: "rgba(0,0,0,0.05)",
                        "&:hover": { opacity: 0.7 },
                      }}
                      borderRadius={1}
                      onClick={handleOpenInputFiles}
                    >
                      <AddPhotoAlternateIcon
                        sx={{
                          fontSize: 100,
                          filter: "drop-shadow(2px 4px 6px #2065D1)",
                        }}
                      />
                    </Stack>
                  </ContainedImageStyle>

                  {imgsBlob.length > 0 && (
                    <Grid
                      height="100%"
                      width="100%"
                      mt={2}
                      container
                      spacing={1}
                    >
                      {imgsBlob.map((item, index) => (
                        <Grid
                          height="100px"
                          item
                          lg={2}
                          xs={3}
                          md={3}
                          key={index}
                        >
                          <OverviewImg
                            src={item.url}
                            border="1px dotted"
                            onDeleteImg={() => handleDeleteImgsBlob(item)}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={4}>
            <Card>
              <CardContent>
                <TextField
                  fullWidth
                  label="Số lượng phòng"
                  {...getFieldProps("room_quantity")}
                  error={Boolean(touched.room_quantity && errors.room_quantity)}
                  helperText={touched.room_quantity && errors.room_quantity}
                  margin="normal"
                />
                <SelectForm
                  value={values.hotel_id}
                  error={Boolean(touched.hotel_id && errors.hotel_id)}
                  helperText={touched.hotel_id && errors.hotel_id}
                  label="Khách sạn"
                  name="hotel_id"
                  onChange={handleChange}
                >
                  {optionsHotels.length > 0 &&
                    optionsHotels.map((p) => (
                      <MenuItem value={p.hotel_id} key={p.hotel_id}>
                        {p.hotel_name}
                      </MenuItem>
                    ))}
                </SelectForm>

                {values?.hotel_id && !optionFloor.length && (
                  <Typography fontStyle="italic" color="error">
                    * Vui lòng thêm tầng trước khi thêm phòng
                  </Typography>
                )}

                <TextField
                  fullWidth
                  type="number"
                  label="Số lượng tối đa"
                  {...getFieldProps("max_people")}
                  error={Boolean(touched.max_people && errors.max_people)}
                  helperText={touched.max_people && errors.max_people}
                  margin="normal"
                />

                {optionFloor?.length > 0 && (
                  <SelectForm
                    value={values.floor_id}
                    error={Boolean(touched.floor_id && errors.floor_id)}
                    helperText={touched.floor_id && errors.floor_id}
                    label="Tầng"
                    name="floor_id"
                    onChange={handleChange}
                  >
                    {optionFloor.length > 0 &&
                      optionFloor.map((p) => (
                        <MenuItem value={p.floor_id} key={p.floor_id}>
                          {p.floor_name}
                        </MenuItem>
                      ))}
                  </SelectForm>
                )}

                <SelectForm
                  value={values.rt_id}
                  error={Boolean(touched.rt_id && errors.rt_id)}
                  helperText={touched.rt_id && errors.rt_id}
                  label="Loại phòng"
                  name="rt_id"
                  onChange={handleChange}
                >
                  {optionRoomType.length > 0 &&
                    optionRoomType.map((p) => (
                      <MenuItem value={p.rt_id} key={p.rt_id}>
                        {p.rt_name}
                      </MenuItem>
                    ))}
                </SelectForm>

                <SelectForm
                  value={values.status_id}
                  error={Boolean(touched.status_id && errors.status_id)}
                  helperText={touched.status_id && errors.status_id}
                  label="Trạng thái hiển thị"
                  name="status_id"
                  onChange={handleChange}
                >
                  {optionStatus.length > 0 &&
                    optionStatus.map((p) => (
                      <MenuItem value={p.status_id} key={p.status_id}>
                        {p.value}
                      </MenuItem>
                    ))}
                </SelectForm>

                <Box mt={2}>
                  <Typography variant="body1" color="#212B36">
                    Ảnh tiêu đề
                  </Typography>

                  <input
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                    onChange={handleChangeImg}
                  />

                  <ContainedImageStyle>
                    {imgBlob?.url || initialValues?.room_thumb ? (
                      <OverviewImg
                        height={200}
                        src={imgBlob.url || initialValues?.room_thumb}
                        onClickImg={handleOpenInputFile}
                        onDeleteImg={handleDeleteImgBlob}
                      />
                    ) : (
                      <Stack
                        width="100%"
                        height={200}
                        justifyContent="center"
                        alignItems="center"
                        sx={{
                          background: "rgba(0,0,0,0.05)",
                          "&:hover": { opacity: 0.8 },
                        }}
                        borderRadius={1}
                        onClick={handleOpenInputFile}
                      >
                        <AddPhotoAlternateIcon
                          sx={{
                            fontSize: 100,
                            filter: "drop-shadow(2px 4px 6px #2065D1)",
                          }}
                        />
                      </Stack>
                    )}
                  </ContainedImageStyle>
                </Box>

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

FormAddEditRoom.propTypes = {
  initialValues: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FormAddEditRoom;
