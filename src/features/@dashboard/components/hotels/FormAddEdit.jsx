import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import { LoadingButton } from "@mui/lab";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

import { getBlobImg, getSlug } from "~/utils";
import OverviewImg from "../OverviewImg";
import Provice from "../Provice";
import options from "./option";

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

function FormAddEdit(props) {
  const { initialValues, schema, onSubmit } = props;
  const fileRef = useRef();
  const filesRef = useRef();

  const [imgBlob, setImgBlob] = useState({});
  const [imgsBlob, setImgsBlob] = useState([]);
  const [tags, setTags] = useState([]);
  const [tagDelete, setTagDelete] = useState([]);
  const [file, setFile] = useState([]);
  const [files, setFiles] = useState([]);
  const [imgsDelete, setImgsDelete] = useState([]);

  useEffect(() => {
    if (!initialValues?.hotel_id) return;

    if (initialValues?.images) {
      const newImagesBlob = initialValues?.images.map((img) => ({
        id: img.h_image_id,
        hotel_id: img.hotel_id,
        url: img.h_image_value,
        file_name: img.file_name,
      }));

      setImgsBlob(newImagesBlob);
    }

    if (initialValues?.tags) {
      const newTags = initialValues.tags.map((tag) => ({
        tag_id: tag.tag_id,
        title: tag.tag_value,
        hotel_id: tag.hotel_id,
      }));
      setTags(newTags);
    }
  }, [initialValues]);

  const formik = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: (values) => {
      if (
        !onSubmit ||
        (!initialValues?.hotel_id &&
          (!file.length || !tags.length || !files.length))
      )
        return;

      let newValues = {
        ...values,
        hotel_image: file,
        slug: getSlug(values.hotel_name),
        h_image_value: files,
        tags,
      };

      if (initialValues?.hotel_id) {
        const { tags, images, ...others } = newValues;

        if (!imgsBlob.length || !tags.length)
          return toast.error("Vui lòng điền và chọn ảnh và tags.");

        // if(img)

        const tagsNews = tags.filter((t) => !t?.tag_id);

        newValues = {
          ...others,
          img_delete: imgsDelete.length ? imgsDelete : null,
          tag_delete: tagDelete.length ? tagDelete : null,
          hotel_image: file.length ? file : null,
          h_image_value: files.length ? files : null,
          tag_news: tagsNews.length ? tagsNews : null,
        };
      }

      onSubmit(newValues);
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

    if (initialValues?.hotel_id && img.hotel_id) {
      setImgsDelete((pre) => [...pre, img]);
    }
  };

  const handleChangeTag = useCallback(
    (event, value, reason) => {
      if (value && value.length && value[value.length - 1].tag_id) {
        const deleted = tags.filter((i) => [...value].indexOf(i) === -1);
        setTagDelete((pre) => [...pre, ...deleted]);
      } else if (initialValues.hotel_id && !value.length) {
        setTagDelete((pre) => [...pre, ...initialValues.tags]);
      }

      setTags(value);
    },
    [tags, initialValues]
  );

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={8}>
            <Card>
              <CardContent>
                <TextField
                  fullWidth
                  label="Tên khách sạn"
                  {...getFieldProps("hotel_name")}
                  error={Boolean(touched.hotel_name && errors.hotel_name)}
                  helperText={touched.hotel_name && errors.hotel_name}
                  margin="normal"
                />

                <TextField
                  fullWidth
                  label="Giới thiệu về khách sạn"
                  multiline
                  rows={4}
                  margin="normal"
                  {...getFieldProps("hotel_desc")}
                  error={Boolean(touched.hotel_desc && errors.hotel_desc)}
                  helperText={touched.hotel_desc && errors.hotel_desc}
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
                    {imgBlob?.url || initialValues?.hotel_image ? (
                      <OverviewImg
                        height={200}
                        src={imgBlob.url || initialValues?.hotel_image}
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

                <TextField
                  fullWidth
                  type="number"
                  label="Phần trăm thuế"
                  {...getFieldProps("tax")}
                  error={Boolean(touched.tax && errors.tax)}
                  helperText={touched.tax && errors.tax}
                  margin="normal"
                />

                <Autocomplete
                  onChange={handleChangeTag}
                  id="size-small-filled"
                  multiple
                  value={[...tags]}
                  options={options}
                  getOptionLabel={(option) => option.title}
                  isOptionEqualToValue={(option, value) =>
                    option.title === value.title
                  }
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        variant="outlined"
                        label={option.title}
                        size="small"
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField {...params} label="Tags" margin="normal" />
                  )}
                />

                <Provice
                  getFieldProps={getFieldProps}
                  touched={touched}
                  errors={errors}
                  values={values}
                  setFieldValue={setFieldValue}
                />
              </CardContent>
            </Card>

            <Card sx={{ mt: 2 }}>
              <CardContent>
                <LoadingButton
                  type="submit"
                  loading={false}
                  fullWidth
                  variant="contained"
                >
                  {initialValues.hotel_id ? "Lưu thay đổi" : "Tạo khách sạn"}
                </LoadingButton>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

FormAddEdit.propTypes = {
  initialValues: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default FormAddEdit;
