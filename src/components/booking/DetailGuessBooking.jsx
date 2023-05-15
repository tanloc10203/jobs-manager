import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LockIcon from "@mui/icons-material/Lock";
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { differenceInDays } from "date-fns";
import { Form, FormikProvider, useFormik } from "formik";
import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { vnPayAPI } from "~/apis";
import SelectForm from "~/features/@dashboard/components/forms/SelectForm";
import { appActions } from "~/features/app/appSlice";
import { authState } from "~/features/authentication/authSlice";
import { billActions } from "~/features/bill/billSlice";
import { calcPriceDiscount, schemaBooking, getFieldOfObject } from "~/utils";
import LazyLoadImage from "../LazyLoadImage";
import BoxContent from "./BoxContent";
import BoxRating from "./BoxRating";
import BoxTime from "./BoxTime";
import StackIconAndText from "./StackIconAndText";
import TextAndPrice from "./TextAndPrice";
import times from "./time";

function DetailGuessBooking({
  active,
  onChangeActive,
  onFinished,
  date,
  rooms,
  hotel,
}) {
  const [value, setValue] = useState("OFFLINE");
  const [bookingFor, setBookingFor] = useState("ME");
  const { user } = useSelector(authState);
  const [timeDestination, setTimeDestination] = useState("");
  const dispatch = useDispatch();

  const initialValues = useMemo(
    () => ({
      ...user,
      note: "",
      time_destination: "",
      voucher: "",
      payment: "",
      bookingFor: "",
      customer_fullname: "",
      customer_email: "",
    }),
    [user]
  );

  const resultCountDate = useMemo(() => {
    const result = differenceInDays(date[0]?.endDate, date[0]?.startDate);
    return result === 0 ? 1 : result;
  }, [date]);

  const total = useMemo(() => {
    return [...rooms].reduce((_total, value) => {
      const priceTemp =
        value.discount === 1
          ? calcPriceDiscount({
              price: value.price * value.booking_room,
              persent_discount: value.percent_discount,
            })
          : value.price * value.booking_room;

      // * Thuế
      const tax = priceTemp * (hotel.tax / 100);

      const price = priceTemp + tax;

      return (_total += price);
    }, 0);
  }, [rooms]);

  const formik = useFormik({
    initialValues,
    validationSchema: schemaBooking,
    onSubmit: async (values) => {
      const newToal = Math.trunc(total * resultCountDate);

      if (active === 1) {
        onChangeActive();
        return;
      }

      let newValues = {
        ...values,
        amount: newToal,
        bankCode: values.payment,
        total_price: newToal,
        rooms,
      };

      return new Promise((resolve, reject) => {
        let data = getFieldOfObject({
          fileds: [
            "user_id",
            "total_price",
            "payment",
            "note",
            "email",
            "first_name",
            "last_name",
            "phone",
            "rooms",
            "time_destination",
            "voucher",
            "customer_fullname",
            "customer_email",
          ],
          object: newValues,
        });

        data = {
          ...hotel,
          ...data,
          booking_for: values.bookingFor,
          totalNight: resultCountDate,
          startDate: date[0].startDate,
          endDate: date[0].endDate,
        };

        dispatch(appActions.setOpenOverlay(true));
        dispatch(appActions.setText("Đang đặt phòng..."));
        setTimeout(() => {
          dispatch(billActions.createStart(data));
          resolve(true);
        }, 200);
      });
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

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleChangeBookingFor = async (event) => {
    setBookingFor(event.target.value);
    if (event.target.value === "ME") {
      await setFieldValue("customer_fullname", "");
      await setFieldValue("customer_email", "");
    }
  };

  useEffect(() => {
    (async () => {
      await setFieldValue("payment", value);
    })();
  }, [value]);

  useEffect(() => {
    (async () => {
      await setFieldValue("bookingFor", bookingFor);
    })();
  }, [bookingFor]);

  const handleOnChangeTimeDestination = async (event) => {
    if (!event.target.value) return;

    setTimeDestination(event.target.value);
    const filter = times.filter((time) => time.value === +event.target.value);
    await setFieldValue("time_destination", filter[0].title);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Grid container mt={5} spacing={3}>
          <Grid item lg={4} md={5} xs={12}>
            <BoxContent
              title="Chi tiết đặt phòng của bạn"
              sx={{ mt: 0 }}
              fontSize={14}
            >
              <Stack mt={2} direction="row" sx={{ width: "100%" }} spacing={2}>
                <BoxTime
                  title="Nhận phòng"
                  date={date[0]?.startDate}
                  timeText="Từ 14:00"
                />
                <BoxTime
                  sx={{
                    position: "relative",

                    "&:before": {
                      content: '""',
                      background: "#e7e7e7",
                      position: "absolute",
                      height: "100%",
                      left: "-15px",
                      top: 0,
                      width: "1px",
                    },
                  }}
                  title="Trả phòng"
                  date={date[0]?.endDate}
                  timeText="Cho đến 12:00"
                />
              </Stack>

              <Stack mt={3} mb={2}>
                <Typography fontSize={14} fontWeight={500}>
                  Tổng thời gian lưu trú:
                </Typography>
                <Typography fontWeight={700} fontSize={14}>
                  {`${resultCountDate} đêm`}
                </Typography>
              </Stack>

              <hr style={{ borderTop: "1px solid #e7e7e7" }} />

              <Stack mt={3}>
                <Typography fontSize={14} fontWeight={500}>
                  Bạn đã chọn:
                </Typography>
                {rooms.map((room, index) => (
                  <TextAndPrice
                    key={index}
                    fontWeight={700}
                    text={room.room_name}
                    content={`x ${room.booking_room} phòng`}
                  />
                ))}
              </Stack>
            </BoxContent>

            <BoxContent title="Tóm tắt giá" fontSize={14}>
              {rooms.map((room, index) => (
                <Box key={index}>
                  <TextAndPrice
                    fontWeight={700}
                    mt={2}
                    text={room.room_name}
                    price={
                      room.discount === 1
                        ? calcPriceDiscount({
                            price: room.price,
                            persent_discount: room.percent_discount,
                          })
                        : room.price
                    }
                  />
                  <TextAndPrice
                    text={`${hotel.tax} % Thuế GTGT`}
                    price={
                      room.discount === 1
                        ? calcPriceDiscount({
                            price: room.price,
                            persent_discount: room.percent_discount,
                          }) *
                          (hotel.tax / 100)
                        : room.price * (hotel.tax / 100)
                    }
                  />
                  <TextAndPrice
                    sx={{ mb: 2 }}
                    text="Số lượng phòng"
                    content={`${room.booking_room} phòng`}
                  />
                </Box>
              ))}

              <hr style={{ borderTop: "1px solid #e7e7e7" }} />

              <TextAndPrice mt={2} text="Giá" price={total} />

              <TextAndPrice
                mt={2}
                text="Số đêm"
                sx={{ mb: 2 }}
                content={`x ${resultCountDate} đêm`}
              />

              <hr style={{ borderTop: "1px solid #e7e7e7" }} />

              <TextAndPrice
                fontSize={16}
                sxText={{ color: "red" }}
                mt={2}
                text="Tổng giá"
                price={total * resultCountDate}
              />
            </BoxContent>

            {active === 2 && (
              <BoxContent title="Bạn có mã khuyến mãi không?" fontSize={14}>
                <Typography mt={2}>Nhập mã khuyến mãi</Typography>
                <TextField
                  fullWidth
                  {...getFieldProps("voucher")}
                  error={Boolean(touched.voucher && errors.voucher)}
                  helperText={touched.voucher && errors.voucher}
                  sx={{
                    "& > div": { borderRadius: "2px", background: "#fff" },
                  }}
                />
                <Button
                  sx={{ mt: 0.5, borderRadius: "2px" }}
                  variant="outlined"
                >
                  Áp dụng
                </Button>
              </BoxContent>
            )}
          </Grid>
          <Grid item lg={8} md={7} xs={12}>
            <Box
              sx={{
                borderRadius: "2px",
                border: "1px solid #e7e7e7",
                color: "#262626",
                p: 2,
              }}
            >
              <Stack direction={{ md: "row", xs: "column" }} spacing={2}>
                <LazyLoadImage
                  sx={{
                    borderRadius: "2px",
                    width: { md: "160px", xs: "100%" },
                    height: { md: "160px", xs: "300px" },
                  }}
                  loading="lazy"
                  src={hotel.hotel_image}
                />

                <Box>
                  <Typography variant="h5">{hotel.hotel_name}</Typography>

                  <Typography mt={2} fontSize={13}>
                    {`${hotel.hotel_address}, ${hotel.ward_name}, ${hotel.district_name}, ${hotel.provice_name}`}
                  </Typography>

                  <Typography color="green" fontSize={13}>
                    Vị trí xuất sắc - 10
                  </Typography>
                  {hotel.hotel_rating === 0 && (
                    <Typography color="green" fontSize={13}>
                      Chưa có đánh giá
                    </Typography>
                  )}

                  <BoxRating rate={hotel.hotel_rating} sx={{ mt: 1 }} />
                </Box>
              </Stack>
            </Box>

            {active === 1 && (
              <BoxContent title="Mách nhỏ:">
                <StackIconAndText text="Bạn có thể thanh toán trước bằng thẻ tín dụng!">
                  <CreditCardIcon color="success" />
                </StackIconAndText>

                <StackIconAndText text="Hoặc bạn có thể thanh toán trong kì nghỉ của bạn">
                  <CheckCircleOutlineIcon color="success" />
                </StackIconAndText>

                <StackIconAndText text="Miễn phí huỷ phòng và hoàn lại toàn bộ số tiền đã đặt.">
                  <CheckCircleOutlineIcon color="success" />
                </StackIconAndText>

                <StackIconAndText text="Bạn sẽ nhận được buổi ăn sáng miễn phí">
                  <CheckCircleOutlineIcon color="success" />
                </StackIconAndText>
              </BoxContent>
            )}

            <BoxContent
              sx={{ background: "#ebf3ff" }}
              title="Nhập thông tin chi tiết về bạn"
            >
              <Box>
                <Chip
                  label="Gần xong rồi! Chỉ cần điền phần thông tin * bắt buộc"
                  color="success"
                  sx={{
                    color: "#006607",
                    background: "#d2edd5",
                    borderRadius: "4px",
                    mt: 1,
                  }}
                />
              </Box>

              <Grid container width="100%" spacing={2}>
                <Grid item lg={6} md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Họ (*)"
                    {...getFieldProps("last_name")}
                    error={Boolean(touched.last_name && errors.last_name)}
                    helperText={touched.last_name && errors.last_name}
                    margin="normal"
                    sx={{
                      "& > div": { borderRadius: "2px", background: "#fff" },
                    }}
                  />
                </Grid>
                <Grid item lg={6} md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Tên (*)"
                    {...getFieldProps("first_name")}
                    error={Boolean(touched.first_name && errors.first_name)}
                    helperText={touched.first_name && errors.first_name}
                    margin="normal"
                    sx={{
                      "& > div": { borderRadius: "2px", background: "#fff" },
                    }}
                  />
                </Grid>

                <Grid item lg={6} md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Địa chỉ email (*)"
                    {...getFieldProps("email")}
                    error={Boolean(touched.email && errors.email)}
                    helperText={touched.email && errors.email}
                    sx={{
                      "& > div": { borderRadius: "2px", background: "#fff" },
                    }}
                  />
                  <Typography fontSize={12} mt={1}>
                    Email xác nhận đặt phòng sẽ được gửi đến địa chỉ này
                  </Typography>
                </Grid>

                <Grid item lg={6} md={6} xs={12}>
                  <TextField
                    fullWidth
                    label="Số điện thoại (*)"
                    {...getFieldProps("phone")}
                    error={Boolean(touched.phone && errors.phone)}
                    helperText={touched.phone && errors.phone}
                    sx={{
                      "& > div": { borderRadius: "2px", background: "#fff" },
                    }}
                  />
                </Grid>
              </Grid>
            </BoxContent>

            {active === 2 && (
              <>
                <BoxContent
                  sx={{ background: "#ebf3ff" }}
                  title="Bạn đặt cho ai"
                >
                  <Box mt={2}>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                        value={bookingFor}
                        onChange={handleChangeBookingFor}
                      >
                        <FormControlLabel
                          value="ME"
                          control={<Radio />}
                          label="Đặt cho chính bạn"
                        />
                        <FormControlLabel
                          value="CUSTOMER"
                          control={<Radio />}
                          label="Đặt cho người khác"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>

                  {bookingFor === "CUSTOMER" && (
                    <Grid container width="100%" spacing={2}>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Họ và tên khách hàng (*)"
                          {...getFieldProps("customer_fullname")}
                          error={Boolean(
                            touched.customer_fullname &&
                              errors.customer_fullname
                          )}
                          helperText={
                            touched.customer_fullname &&
                            errors.customer_fullname
                          }
                          sx={{
                            "& > div": {
                              borderRadius: "2px",
                              background: "#fff",
                            },
                          }}
                        />
                      </Grid>
                      <Grid item lg={6} md={6} xs={12}>
                        <TextField
                          fullWidth
                          label="Địa chỉ email khách hàng (*)"
                          {...getFieldProps("customer_email")}
                          error={Boolean(
                            touched.customer_email && errors.customer_email
                          )}
                          helperText={
                            touched.customer_email && errors.customer_email
                          }
                          sx={{
                            "& > div": {
                              borderRadius: "2px",
                              background: "#fff",
                            },
                          }}
                        />
                        <Typography fontSize={12} mt={1}>
                          Email xác nhận đặt phòng sẽ được gửi đến địa chỉ này
                        </Typography>
                      </Grid>
                    </Grid>
                  )}
                </BoxContent>
                <BoxContent
                  sx={{ background: "#ebf3ff" }}
                  title="Chọn hình thức thanh toán"
                >
                  <Box mt={2}>
                    <Typography fontSize={14} color="red" fontStyle="italic">
                      * Bạn có thể thay đổi lựa chọn
                    </Typography>
                    <FormControl>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="female"
                        name="radio-buttons-group"
                        value={value}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          value="ONLINE"
                          control={<Radio />}
                          label="Cổng thanh toán VNPAYQR"
                        />
                        <FormControlLabel
                          value="OFFLINE"
                          control={<Radio />}
                          label="Thanh toán trong kỉ nghỉ"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Box>
                </BoxContent>
              </>
            )}

            {active === 1 && (
              <>
                <BoxContent
                  sx={{ background: "#ebf3ff" }}
                  title="Các yêu cầu đặc biệt"
                >
                  <Typography mt={2} fontSize={13}>
                    Các yêu cầu đặc biệt không đảm bảo sẽ được đáp ứng – tuy
                    nhiên, chỗ nghỉ sẽ cố gắng hết sức để thực hiện. Bạn luôn có
                    thể gửi yêu cầu đặc biệt sau khi hoàn tất đặt phòng của
                    mình!
                  </Typography>
                  <TextField
                    fullWidth
                    label="Vui lòng ghi yêu cầu của bạn tại đây. (không bắt buộc)"
                    multiline
                    {...getFieldProps("note")}
                    error={Boolean(touched.note && errors.note)}
                    helperText={touched.note && errors.note}
                    rows={4}
                    margin="normal"
                    sx={{
                      "& > div": { borderRadius: "2px", background: "#fff" },
                    }}
                  />
                </BoxContent>

                <BoxContent
                  sx={{ background: "#ebf3ff" }}
                  title="Thời gian đến của bạn"
                >
                  <StackIconAndText text="Bạn có thể nhận chỗ nghỉ lúc 14:00">
                    <CheckCircleOutlineIcon color="success" />
                  </StackIconAndText>

                  <Stack mt={2} direction="row" spacing={0.5}>
                    <Typography fontSize={14} fontWeight={700}>
                      Thêm thời gian đến dự kiến của bạn
                    </Typography>
                    <Typography fontSize={14}>(không bắt buộc)</Typography>
                  </Stack>

                  <SelectForm
                    label="Thời gian đến dự kiên"
                    error={false}
                    helperText=""
                    value={timeDestination}
                    onChange={handleOnChangeTimeDestination}
                    sx={{
                      width: {
                        md: "50%",
                        xs: "100%",
                      },
                      "& div ": { borderRadius: "2px" },
                    }}
                  >
                    {times.map((item, index) => (
                      <MenuItem value={item.value + ""} key={index}>
                        {item.title}
                      </MenuItem>
                    ))}
                  </SelectForm>
                  <Typography fontSize={14} fontWeight={500}>
                    {`Thời gian theo múi giờ của ${hotel.provice_name}`}
                  </Typography>
                </BoxContent>
              </>
            )}

            <Stack mt={3} alignItems="flex-end">
              {active === 1 ? (
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ borderRadius: "2px" }}
                  endIcon={<ChevronRightIcon />}
                >
                  Tiếp theo: Chi tiết cuối cùng
                </Button>
              ) : (
                <Button
                  variant="contained"
                  sx={{ borderRadius: "2px" }}
                  startIcon={<LockIcon />}
                  onClick={onFinished}
                  type="submit"
                >
                  Hoàn tất đặt chỗ
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Form>
    </FormikProvider>
  );
}

DetailGuessBooking.propTypes = {
  active: PropTypes.number.isRequired,
  onChangeActive: PropTypes.func,
  onFinished: PropTypes.func,
  date: PropTypes.any,
  hotel: PropTypes.object,
  rooms: PropTypes.array,
};

export default DetailGuessBooking;
