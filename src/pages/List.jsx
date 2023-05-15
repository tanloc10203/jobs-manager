import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SearchIcon from "@mui/icons-material/Search";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { differenceInDays, format } from "date-fns";
import vi from "date-fns/locale/vi";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Footer, Header, MailList, NavBar } from "~/components/home";
import DatePicker from "~/components/home/date-picker/DatePicker";
import ButtonOptions from "~/components/home/SearchList/ButtonOptions";
import LoadingInputSearch from "~/components/home/SearchList/LoadingInputSearch";
import ListHotelSearch from "~/components/list/ListHotelSearch";
import Page from "~/components/Page";
import { appActions } from "~/features/app/appSlice";
import { hotelActions } from "~/features/hotels/hotelSlice";
import {
  proviceActions,
  selectProvinceOptions,
} from "~/features/provices/proviceSlice";

const DatePickerStyle = styled(Box)(({ theme }) => ({
  position: "absolute",
  zIndex: 9999,
  top: "100%",
  left: 0,
  boxShadow: "0px 2px 16px 0px rgba(0,0,0,0.45)",
  borderRadius: 2,
}));

const PaperStyle = styled(Paper)(({ theme }) => ({
  position: "absolute",
  zIndex: 9999,
  top: "100%",
  left: 0,
  boxShadow: "0px 2px 16px 0px rgba(0,0,0,0.45)",
  borderRadius: 2,
}));

function List(props) {
  const location = useLocation();
  const [destination, setDestination] = useState(location.state.destination);
  const [date, setDate] = useState(location.state.date);
  const [options, setOptions] = useState(location.state.options);
  const provices = useSelector(selectProvinceOptions);
  const [openOptions, setOpenOptions] = useState(false);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !location.state?.destination ||
      !location.state?.date ||
      !location.state?.options
    )
      return;

    dispatch(appActions.setOpenOverlay(true));

    const timer = setTimeout(() => {
      dispatch(
        hotelActions.findHotelsStart({
          destination: location.state.destination,
          total_people:
            +location.state.options.adult + +location.state.options.children,
        })
      );
    }, 500);

    return () => clearTimeout(timer);
  }, [location.state]);

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const handleChangeDate = (dates) => {
    setDate((pre) => [dates.selection]);
  };

  useEffect(() => {
    dispatch(proviceActions.getProvicesStart());
  }, []);

  const handleChangeDestination = (event, value) => {
    if (!value) {
      setDestination("");
      return;
    }
    setDestination(value.province_name);
  };

  const handleOnInputChangeDestination = useCallback((event, value, reason) => {
    if (reason === "reset") return;

    setDestination(value);
  }, []);

  const handleSearchHotel = useCallback(() => {
    if (!destination || !date || _.isEmpty(options)) return;

    dispatch(appActions.setOpenOverlay(true));

    setTimeout(() => {
      dispatch(
        hotelActions.findHotelsStart({
          destination: destination,
          total_people: +options.adult + +options.children,
        })
      );
    }, 500);
  }, [destination, date, options]);

  const resultCountDate = useMemo(() => {
    const result = differenceInDays(date[0]?.endDate, date[0]?.startDate);
    return result === 0 ? 1 : result;
  }, [date]);

  const optionsList = useMemo(() => {
    return [
      {
        name: "Người lớn",
        number: options.adult,
        disabled: options.adult <= 1,
        label: "adult",
      },
      {
        name: "Trẻ em",
        number: options.children,
        disabled: options.children <= 0,
        label: "children",
      },
      {
        name: "Phòng",
        number: options.room,
        disabled: options.room <= 1,
        label: "room",
      },
    ];
  }, [options]);

  return (
    <Page title={`Khách sạn ở ${destination}`}>
      <NavBar />
      <Header />

      <Container
        sx={{
          p: {
            md: 6,
            xs: 2,
          },
        }}
        maxWidth="lg"
      >
        <Grid container spacing={2}>
          {/* Search */}
          <Grid item xs={12} md={3}>
            <Paper
              sx={{ background: "#febb02", borderRadius: "2px", padding: 1.5 }}
            >
              <Typography variant="h6">Tìm</Typography>

              <Box sx={{ mt: 1 }}>
                <Typography color="#262626" fontSize={12} fontWeight={400}>
                  Tên chỗ nghỉ / điểm đến
                </Typography>
                {provices?.length ? (
                  <Autocomplete
                    sx={{
                      minWidth: {
                        md: 200,
                      },
                      background: "#fff",
                      borderRadius: 0,
                      "& div": { borderRadius: 0 },
                      "& input": {
                        fontSize: 14,
                      },
                      p: 1,
                    }}
                    disablePortal
                    options={provices}
                    getOptionLabel={(option) => option.province_name || ""}
                    isOptionEqualToValue={(option, value) =>
                      option.province_name === value.province_name
                    }
                    onChange={handleChangeDestination}
                    inputValue={destination || ""}
                    onInputChange={handleOnInputChangeDestination}
                    defaultValue={location.state.destination}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Bạn muốn đến đâu?"
                        variant="standard"
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                  />
                ) : (
                  <LoadingInputSearch sx={{ height: 40 }} />
                )}
              </Box>

              <Box sx={{ position: "relative" }}>
                <Box sx={{ mt: 2 }}>
                  <Typography color="#262626" fontSize={12} fontWeight={400}>
                    Ngày nhận phòng
                  </Typography>
                  <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems="center"
                    sx={{ background: "#fff", p: 1, pl: 2, cursor: "pointer" }}
                    onClick={() => setOpen((pre) => !pre)}
                  >
                    <CalendarMonthIcon sx={{ fontWeight: 400 }} />

                    <Stack>
                      <Typography fontSize={14} fontWeight={400}>
                        {`${format(date[0].startDate, "E P", {
                          locale: vi,
                        })} `}
                      </Typography>
                    </Stack>
                  </Stack>

                  {open && (
                    <DatePickerStyle>
                      <DatePicker date={date} onChangeDate={handleChangeDate} />
                    </DatePickerStyle>
                  )}
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography color="#262626" fontSize={12} fontWeight={400}>
                    Ngày trả phòng
                  </Typography>
                  <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems="center"
                    sx={{ background: "#fff", p: 1, pl: 2, cursor: "pointer" }}
                    onClick={() => setOpen((pre) => !pre)}
                  >
                    <CalendarMonthIcon />

                    <Stack>
                      <Typography fontSize={14} fontWeight={400}>
                        {`${format(date[0].endDate, "E P", {
                          locale: vi,
                        })} `}
                      </Typography>
                    </Stack>
                  </Stack>
                </Box>

                {open.b && (
                  <DatePickerStyle>
                    <DatePicker date={date} onChangeDate={onChangeDate} />
                  </DatePickerStyle>
                )}
              </Box>

              <Box sx={{ mt: 2, position: "relative" }}>
                <Typography color="#262626" fontSize={12} fontWeight={400}>
                  {`Nghỉ ${resultCountDate} đêm`}
                </Typography>
                <Stack
                  direction={"row"}
                  spacing={1}
                  sx={{ background: "#fff", p: 1, pl: 2, cursor: "pointer" }}
                  onClick={() => setOpenOptions(!openOptions)}
                >
                  <Typography
                    fontSize={14}
                    fontWeight={400}
                  >{`${options.adult} người lớn · ${options.children} trẻ em · ${options.room} phòng`}</Typography>
                </Stack>
                {openOptions && (
                  <PaperStyle>
                    {optionsList.map((i, index) => (
                      <ButtonOptions
                        key={index}
                        disabled={i.disabled}
                        name={i.name}
                        number={i.number}
                        onClickFunc={handleOption}
                        label={i.label}
                      />
                    ))}
                  </PaperStyle>
                )}
              </Box>

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2, borderRadius: "2px" }}
                onClick={handleSearchHotel}
              >
                Tìm
              </Button>
            </Paper>
          </Grid>

          <ListHotelSearch
            date={date}
            options={options}
            destination={destination}
          />
        </Grid>
      </Container>

      <MailList />
      <Footer />
    </Page>
  );
}

List.propTypes = {};

export default List;
