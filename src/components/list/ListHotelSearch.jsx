import {
  Box,
  Button,
  Grid,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { differenceInDays } from "date-fns";
import PropTypes from "prop-types";
import { memo, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { appState } from "~/features/app/appSlice";
import { hotelState } from "~/features/hotels/hotelSlice";
import { calcPriceAndTax, calcPriceDiscount } from "~/utils";
import { fPrice } from "~/utils/formatNumber";
import LazyLoadImage from "../LazyLoadImage";
import LoadingHotel from "./LoadingHotel";

function ListHotelSearch({ date, options, destination }) {
  const { data } = useSelector(hotelState);
  const { openOverlay: isLoading } = useSelector(appState);
  const navigation = useNavigate();

  const resultCountDate = useMemo(() => {
    const result = differenceInDays(date[0]?.endDate, date[0]?.startDate);
    return result === 0 ? 1 : result;
  }, [date]);

  const handleClickNaviga = (hotel) => {
    navigation(`/hotels/${hotel.slug}`, {
      state: { destination, options, date },
    });
  };

  return (
    <Grid item xs={12} md={9}>
      <Typography variant="h4">{`${destination}: tìm thấy ${
        data?.length || 0
      } chỗ nghỉ`}</Typography>

      {isLoading
        ? [1, 2, 3, 4, 5].map((i) => <LoadingHotel key={i} />)
        : data.length
        ? data.map((item, index) => (
            <div key={index}>
              <Stack width="100%" my="16px">
                <Stack
                  sx={{
                    border: "1px solid #c6c6c6",
                    borderRadius: "2px",
                    padding: "16px",
                  }}
                  direction={{ md: "row", xs: "column" }}
                  spacing={2}
                  width="100%"
                >
                  <LazyLoadImage
                    src={item.hotel_image}
                    sx={{
                      width: {
                        md: 200,
                        xs: "100%",
                      },
                      height: {
                        md: 200,
                        xs: "100%",
                      },
                      borderRadius: "2px",
                    }}
                  />

                  <Box flex={2}>
                    <Stack
                      justifyContent="space-between"
                      direction={{ md: "row", xs: "column" }}
                    >
                      <Typography
                        sx={{
                          transition: "all 0.25s",
                          cursor: "pointer",
                          "&:hover": {
                            color: "#000",
                          },
                        }}
                        fontWeight={700}
                        fontSize={20}
                        color="#0071c2"
                      >
                        {item.hotel_name}
                      </Typography>

                      <Stack
                        direction="row"
                        justifyContent="center"
                        alignItems="center"
                        spacing={1}
                      >
                        <Typography fontWeight={700} lineHeight="24px">
                          {+item.hotel_rating === 0
                            ? "Chưa có đánh giá"
                            : "Xuất sắc"}
                        </Typography>
                        <Box
                          sx={{
                            background: "#003580",
                            borderRadius:
                              "calc(32px/5.5) calc(32px/5.5) calc(32px/5.5) 0",
                            height: "32px",
                            minWidth: "32px",
                            verticalAlign: "baseline",
                            width: "32px",
                            display: "flex",
                            alignItems: "center",
                            color: "#fff",
                            justifyContent: "center",
                            fontWeight: 700,
                          }}
                        >
                          {item.hotel_rating}
                        </Box>
                      </Stack>
                    </Stack>

                    <Stack spacing={1} direction={{ md: "row", xs: "column" }}>
                      <Typography
                        fontWeight={600}
                        color="#0071c2"
                        fontSize={12}
                        sx={{ textDecoration: "underline" }}
                      >
                        {item.provice_name}
                      </Typography>
                      <Typography fontSize={12}>Cách trung tâm 9km</Typography>
                    </Stack>

                    <Box
                      sx={{
                        mt: 1,
                        background: "#008009",
                        display: "inline-block",
                        color: "#fff",
                        padding: "1px 4px",
                        borderRadius: "2px",
                        lineHeight: "18px",
                      }}
                    >
                      <Typography fontSize={12}>
                        Ưu Đãi Trong Thời Gian Có Hạn
                      </Typography>
                    </Box>

                    <Stack
                      mt={2}
                      justifyContent="space-between"
                      direction={{ md: "row", xs: "column" }}
                    >
                      <Box>
                        <Typography
                          textTransform="capitalize"
                          fontSize={12}
                          fontWeight={700}
                        >
                          Căn hộ nhìn ra vườn
                        </Typography>

                        <Typography
                          textTransform="capitalize"
                          fontSize={12}
                          fontWeight={400}
                          lineHeight="18px"
                          mt="1px"
                        >
                          {item.room_desc}
                        </Typography>

                        <Typography
                          textTransform="capitalize"
                          fontSize={12}
                          fontWeight={700}
                          lineHeight="18px"
                          mt="2px"
                          color="#008009"
                        >
                          Miễn Phí hủy phòng
                        </Typography>

                        <Typography
                          textTransform="capitalize"
                          fontSize={12}
                          fontWeight={400}
                          lineHeight="18px"
                          mt="2px"
                          color="#008009"
                        >
                          Bạn có thể huỷ sau, nên hãy đặt ngay hôm nay để có giá
                          tốt.
                        </Typography>
                      </Box>

                      <Box
                        textAlign={{ md: "right", xs: "left" }}
                        minWidth={150}
                      >
                        {item.discount === 1 && (
                          <Typography
                            color="#c00"
                            fontSize={12}
                            fontWeight={400}
                            sx={{ textDecoration: "line-through" }}
                          >
                            {fPrice(item.price * resultCountDate)}
                          </Typography>
                        )}

                        <Typography fontSize={20} fontWeight={700} mt="5px">
                          {item.discount === 1
                            ? fPrice(
                                calcPriceAndTax({
                                  price:
                                    calcPriceDiscount({
                                      price: item.price,
                                      persent_discount: item.percent_discount,
                                    }) * resultCountDate,
                                  tax: item.tax,
                                })
                              )
                            : fPrice(
                                calcPriceAndTax({
                                  price: +item.price * resultCountDate,
                                  tax: item.tax,
                                })
                              )}
                        </Typography>

                        <Typography
                          fontSize={11}
                          fontWeight={300}
                          color="gray"
                          mt="5px"
                        >
                          Đã bao gồm <strong>{`${item.tax}%`}</strong> thuế và
                          phí
                        </Typography>

                        <Button
                          variant="contained"
                          sx={{ borderRadius: "2px", mt: 2 }}
                          fullWidth
                          onClick={() => handleClickNaviga(item)}
                        >
                          Xem chỗ trống
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            </div>
          ))
        : null}
    </Grid>
  );
}

ListHotelSearch.propTypes = {
  date: PropTypes.array,
  options: PropTypes.object,
  destination: PropTypes.string,
};

export default memo(ListHotelSearch);
