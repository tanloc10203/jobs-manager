import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { differenceInDays } from "date-fns";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Footer, Header, MailList, NavBar } from "~/components/home";
import ListImage from "~/components/hotels/ListImage";
import LoadingHotelDetail from "~/components/hotels/LoadingHotelDetail";
import Page from "~/components/Page";
import { appActions, appState } from "~/features/app/appSlice";
import { authState } from "~/features/authentication/authSlice";
import { hotelActions, hotelSelect } from "~/features/hotels/hotelSlice";
import { calcPriceAndTax, calcPriceDiscount } from "~/utils";
import { fPrice } from "~/utils/formatNumber";
import DoneIcon from "@mui/icons-material/Done";

function Hotel(props) {
  const { data, rooms, images, tags } = useSelector(hotelSelect);
  const { openOverlay: loading } = useSelector(appState);
  const { hotelSlug } = useParams();
  const boxRef = useRef();
  const dispach = useDispatch();
  const [selected, setSelected] = useState({});
  const [selectedRooms, setSelectedRooms] = useState({});
  const navigate = useNavigate();
  const { state } = useLocation();
  const { user } = useSelector(authState);

  const resultCountDate = useMemo(() => {
    const result = differenceInDays(
      state.date[0]?.endDate,
      state.date[0]?.startDate
    );
    return result === 0 ? 1 : result;
  }, [state.date]);

  useEffect(() => {
    if (!hotelSlug) return;

    dispach(appActions.setOpenOverlay(true));

    const timer = setTimeout(() => {
      dispach(hotelActions.getHotelBySlugStart(hotelSlug));
    }, 500);

    return () => clearTimeout(timer);
  }, [hotelSlug]);

  const handleOnClickBooking = useCallback(() => {
    if (!boxRef.current) return;
    if (_.isEmpty(selected)) {
      boxRef.current?.scrollIntoView({ behavior: "smooth" });
      toast.info("Vui lòng chọn phòng.");
    } else {
      if (_.isEmpty(user)) {
        toast.error("Đăng nhập trước khi đặt phòng!");
        navigate("/sign-in");
        return;
      }

      let array = [];

      Object.keys(selectedRooms).forEach((key) => {
        array = [...array, selectedRooms[key]];
      });

      // Save
      const save = {
        hotel: data,
        booking: array,
      };

      navigate("/booking", { state: { save, ...state } });
    }
  }, [selectedRooms, boxRef]);

  const handleChangeSelect = (event, room) => {
    setSelected((pre) => ({ ...pre, [room.room_id]: event.target.value }));
  };

  const handleSelectedRooms = useCallback(
    (room) => {
      if (!selected[room.room_id]) {
        toast.error("Vui lòng chọn số lượng phòng.");
        return;
      }

      // * price * quantity_room.
      let price = +room.price * +selected[room.room_id];

      if (room.discount === 1) {
        price =
          calcPriceDiscount({
            price: room.price,
            persent_discount: room.percent_discount,
          }) * selected[room.room_id];
      }

      setSelectedRooms((pre) => ({
        ...pre,
        [room.room_id]: {
          ...room,
          booking_price: price,
          booking_room: selected[room.room_id],
        },
      }));
    },
    [selected]
  );

  const handleCancle = useCallback(
    (room) => {
      if (!selected[room.room_id]) {
        return;
      }

      setSelected((pre) => {
        delete pre[room.room_id];
        return { ...pre };
      });

      setSelectedRooms((pre) => {
        delete pre[room.room_id];
        return { ...pre };
      });
    },
    [selected]
  );

  return (
    <Page title={data.hotel_name}>
      <NavBar />
      <Header />

      {loading ? (
        <LoadingHotelDetail />
      ) : (
        <Container maxWidth="lg" sx={{ mt: 2, mb: 5 }}>
          <Stack>
            <Typography variant="h4">{data.hotel_name || ""}</Typography>

            <Stack direction="row" spacing={2} mt={1}>
              <LocationOnIcon fontSize="10" color="primary" />
              <Typography
                fontSize={14}
              >{`${data.hotel_address}, ${data.ward_name}, ${data.district_name}, ${data.provice_name}`}</Typography>
            </Stack>

            <Typography fontWeight={500} mt={1}>
              Vị trí xuất sắc, cách trung tâm 500m
            </Typography>
          </Stack>

          {!rooms.length ? (
            <Typography
              color="red"
              sx={{ mt: 2 }}
              fontSize={18}
              fontWeight={700}
            >
              Khách sạn này chưa có thông tin về phòng
            </Typography>
          ) : (
            <>
              {images?.length && <ListImage data={images} />}

              <Stack
                justifyContent="space-between"
                direction={{ md: "row", xs: "column" }}
                width="100%"
                mt={3}
                spacing={2}
                mb={4}
                height="100%"
              >
                <Box
                  sx={{
                    flexBasis: { md: "66.66667%", xs: "100%" },
                    width: { md: "66.66667%", xs: "100%" },
                    maxWidth: { md: "66.66667%", xs: "100%" },
                    // display: "flex",
                    // justifyContent: "space-between",
                    // flexDirection: "column",
                  }}
                >
                  <Typography variant="h5" mt={2}>
                    Giới thiệu
                  </Typography>
                  <Typography fontSize={14} textAlign="justify">
                    {data.hotel_desc || ""}
                  </Typography>

                  <Typography variant="h5" mt={2}>
                    Tiện nghi
                  </Typography>
                  <Stack sx={{ gap: 1 }} direction="row" flexWrap="wrap">
                    {tags?.length &&
                      tags.map((tag) => (
                        <Chip
                          key={tag.tag_id}
                          label={tag.tag_value}
                          icon={<DoneIcon />}
                          color="success"
                          variant="outlined"
                        />
                      ))}
                  </Stack>
                </Box>
                <Box
                  sx={{
                    flexBasis: { md: "33.33333%", xs: "100%" },
                    width: { md: "33.33333%", xs: "100%" },
                    maxWidth: { md: "33.33333%", xs: "100%" },
                    marginLeft: "auto",
                  }}
                >
                  <Box
                    sx={{
                      marginLeft: "auto",
                      width: { md: "80%", xs: "100%" },
                      background: "#e4f4ff",
                      padding: "24px 12px 0 12px",
                    }}
                  >
                    <Typography fontSize={16} fontWeight={700}>
                      Điểm nổi bật của chỗ nghỉ
                    </Typography>

                    <Typography mt={2} fontSize={16} fontWeight={700}>
                      Hoàn hảo cho kỳ nghỉ 1 đêm!
                    </Typography>

                    <Stack direction="row" mt={2}>
                      <LocationOnIcon fontSize="20" color="primary" />
                      <Typography fontSize={14}>
                        Nằm tại khu vực được đánh giá cao nhất ở Hội An, khách
                        sạn này có điểm vị trí xuất sắc 9,3
                      </Typography>
                    </Stack>

                    <Typography mt={2} fontSize={16} fontWeight={700}>
                      Thông tin về bửa sáng
                    </Typography>

                    <Typography mt={2} fontSize={14} fontWeight={500}>
                      Tự chọn
                    </Typography>

                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2, borderRadius: "2px", mb: 3 }}
                      onClick={handleOnClickBooking}
                    >
                      Đặt ngay
                    </Button>
                  </Box>
                </Box>
              </Stack>

              <hr style={{ borderTop: "1px solid #e7e7e7" }} />

              <Box mt={4} ref={boxRef}>
                <Typography variant="h4">Phòng trống</Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2, borderRadius: "2px" }}
                  onClick={handleOnClickBooking}
                >
                  Đặt ngay
                </Button>

                <Grid container mt={4} spacing={1}>
                  {rooms?.length &&
                    rooms.map((room, index) => (
                      <Grid key={index} item lg={3} md={4} xs={12}>
                        <Paper
                          sx={{
                            boxShadow: "0 0 9px 1px rgba(0,0,0,0.2)",
                            p: 2,
                            borderRadius: "2px",
                            "&:hover": {
                              boxShadow: "0 0 9px 1px #4c76b2",
                            },
                            height: "100%",
                            display: "flex",
                            justifyContent: "space-between",
                            flexDirection: "column",
                          }}
                        >
                          <Typography
                            color="#4c76b2"
                            fontWeight={700}
                            fontSize={18}
                          >
                            {room.room_name}
                          </Typography>

                          <Typography mt={3} mb={2}>
                            {room.room_desc}
                          </Typography>

                          <Typography>{room.rt_desc}</Typography>

                          <Stack direction="row" spacing={1} mt={2} mb={2}>
                            <Typography fontWeight={600}>
                              Phù hợp cho:{" "}
                            </Typography>
                            <Typography
                              fontWeight={700}
                            >{`${room.max_people} người`}</Typography>
                          </Stack>

                          <hr style={{ borderTop: "1px solid #e7e7e7" }} />

                          <Stack direction="row" spacing={1} mt={2}>
                            <Typography fontWeight={600}>
                              Giá hôm nay:
                            </Typography>
                            <Typography fontWeight={700}>
                              {room.discount === 1
                                ? fPrice(
                                    calcPriceAndTax({
                                      price:
                                        calcPriceDiscount({
                                          price: room.price,
                                          persent_discount:
                                            room.percent_discount,
                                        }) * resultCountDate,
                                      tax: data.tax,
                                    })
                                  )
                                : fPrice(
                                    calcPriceAndTax({
                                      price: room.price * resultCountDate,
                                      tax: data.tax,
                                    })
                                  )}
                            </Typography>
                          </Stack>

                          <Stack direction="row" spacing={1}>
                            {room.discount === 1 && (
                              <Typography
                                fontSize={15}
                                sx={{
                                  textDecoration: "line-through",
                                  fontStyle: "italic",
                                }}
                                fontWeight={700}
                                color="red"
                              >
                                {fPrice(room.price)}
                              </Typography>
                            )}

                            {room.discount === 1 && (
                              <Typography
                                sx={{
                                  fontStyle: "italic",
                                }}
                                fontWeight={700}
                                color="green"
                              >{`Tiết kiệm ${room.percent_discount}%`}</Typography>
                            )}
                          </Stack>

                          <Typography
                            fontStyle="italic"
                            fontSize={12}
                            fontWeight={700}
                          >
                            Bao gồm {data.tax}% thuế
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={1}
                            mt={2}
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography
                              fontSize={14}
                              fontStyle="italic"
                              color="red"
                              fontWeight={500}
                            >
                              {`Chỉ còn lại ${
                                room.room_quantity - room.room_booking
                              } phòng`}
                            </Typography>

                            <Typography
                              fontSize={14}
                              fontStyle="italic"
                              color="green"
                              fontWeight={700}
                            >
                              Miễn phí huỷ
                            </Typography>
                          </Stack>

                          <FormControl fullWidth margin="normal" size="small">
                            <InputLabel id="demo-simple-select-label">
                              Số lượng phòng
                            </InputLabel>
                            <Select
                              label="Số lượng phòng"
                              value={selected[room.room_id] || ""}
                              onChange={(e) => handleChangeSelect(e, room)}
                            >
                              {[
                                ...Array(
                                  room.room_quantity - room.room_booking
                                ),
                              ].map((i, index) => (
                                <MenuItem value={index + 1} key={index}>
                                  <Stack direction="row" spacing={1}>
                                    <Typography>{`${
                                      index + 1
                                    } phòng.`}</Typography>
                                    <Typography>
                                      (
                                      {room.discount === 1
                                        ? fPrice(
                                            calcPriceAndTax({
                                              price:
                                                calcPriceDiscount({
                                                  price: room.price,
                                                  persent_discount:
                                                    room.percent_discount,
                                                }) *
                                                (index + 1) *
                                                resultCountDate,
                                              tax: data.tax,
                                            })
                                          )
                                        : fPrice(
                                            calcPriceAndTax({
                                              price:
                                                room.price *
                                                (index + 1) *
                                                resultCountDate,
                                              tax: data.tax,
                                            })
                                          )}
                                      )
                                    </Typography>
                                  </Stack>
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={1}
                          >
                            <Button
                              disabled={
                                selectedRooms[room.room_id]?.room_id ===
                                room.room_id
                              }
                              variant="contained"
                              fullWidth
                              sx={{ borderRadius: "2px" }}
                              onClick={() => handleSelectedRooms(room)}
                            >
                              Chọn
                            </Button>

                            <Button
                              fullWidth
                              variant="contained"
                              color="error"
                              sx={{ borderRadius: "2px" }}
                              onClick={() => handleCancle(room)}
                            >
                              Huỷ
                            </Button>
                          </Stack>
                        </Paper>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </>
          )}
        </Container>
      )}
      <MailList />
      <Footer />
    </Page>
  );
}

Hotel.propTypes = {};

export default Hotel;
