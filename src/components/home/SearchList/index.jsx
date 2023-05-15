import BedIcon from "@mui/icons-material/Bed";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import {
  Autocomplete,
  Box,
  Button,
  Container,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useOutsideAlerter from "~/hooks/useOutsideAlerter";
import DatePicker from "../date-picker/DatePicker";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";
import { format } from "date-fns";
import vi from "date-fns/locale/vi";
import ButtonOptions from "./ButtonOptions";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import {
  proviceActions,
  proviceState,
  selectProvinceOptions,
} from "~/features/provices/proviceSlice";
import LoadingInputSearch from "./LoadingInputSearch";

const WrapperStyle = styled("div")(({ theme }) => ({
  // color: "#fff",
  position: "absolute",
  width: "100%",
  bottom: "0",
  left: "50%",
  transform: "translate(-50%, 50%)",
  zIndex: "5",
}));

const GridStyle = styled(Stack)(({ theme }) => ({
  background: "#febb02",
  width: "auto",
  borderRadius: 2,
  padding: 4,
  margin: 10,
}));

const GridItemStyle = styled(Box)(({ theme }) => ({
  background: "#fff",
  borderRadius: 1,
  flex: "1 1 auto",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transition: "all 0.35s ease-in-out",

  "& > div": {
    padding: 11,
    width: "100%",
    position: "relative",
  },

  "&:not(:first-of-type)": {
    cursor: "pointer",
  },

  "&:last-child": {
    background: "unset",
    padding: 0,
    width: "auto",
  },

  [theme.breakpoints.down("lg")]: {
    justifyContent: "flex-start",
  },
}));

const ToolbarStyle = styled(Toolbar)(({ theme }) => ({
  [theme.breakpoints.down("lg")]: {
    padding: "64px 10px calc(32*5px) 10px",
  },
}));

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

function SearchList({ provinceName }) {
  const [destination, setDestination] = useState("");
  const [openDate, setOpenDate] = useState(false);
  const [counter, setCounter] = useState(0);
  const [openOptions, setOpenOptions] = useState(false);
  const [options, setOptions] = useState({
    adult: 1,
    children: 0,
    room: 1,
  });

  const dateRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const provices = useSelector(selectProvinceOptions);

  useEffect(() => {
    dispatch(proviceActions.getProvicesStart());
  }, []);

  useEffect(() => {
    if (!provinceName) return;

    console.log("provinceName", provinceName);

    setDestination(provinceName);

    handleSearch(provinceName);
  }, [provinceName]);

  useOutsideAlerter(dateRef, () => {
    setOpenDate(false);
  });

  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const handleOption = (name, operation) => {
    setOptions((prev) => {
      return {
        ...prev,
        [name]: operation === "i" ? options[name] + 1 : options[name] - 1,
      };
    });
  };

  const handleSearch = useCallback(
    (destination) => {
      console.log(destination);

      if (!destination) {
        toast.error("Vui lòng chọn nơi bạn muốn đến!");
        return;
      }

      navigate("/hotels", { state: { destination, date, options } });
    },
    [destination]
  );

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

  const handleChangeDate = (dates) => {
    setDate((pre) => [dates.selection]);
  };

  const handleClickDatePicker = () => {
    if (openDate) {
      setCounter((prev) => ++prev);
    }
  };

  useEffect(() => {
    if (counter === 1 && !openDate) {
      setCounter(0);
    }

    if (counter === 2) {
      setCounter(0);
      setOpenDate(false);
    }
  }, [counter, openDate]);

  const handleChangeDestination = (event, value) => {
    console.log("value", value);
    setDestination(value?.province_name);
  };

  return (
    <Box sx={{ background: "#003580" }}>
      <Container maxWidth="lg" style={{ position: "relative" }}>
        <ToolbarStyle sx={{ color: "#fff", p: 7.4 }}>
          <Stack spacing={1}>
            <Typography variant="h2">Tìm chỗ nghỉ tiếp theo</Typography>
            <Typography variant="h4" fontWeight={500}>
              Tìm ưu đãi khách sạn, chỗ nghỉ dạng nhà và nhiều hơn nữa...
            </Typography>
          </Stack>
        </ToolbarStyle>

        <WrapperStyle>
          <GridStyle direction={{ lg: "row", xs: "column" }} spacing={"4px"}>
            <GridItemStyle>
              {provices?.length ? (
                <Autocomplete
                  sx={{
                    minWidth: {
                      md: 200,
                    },
                  }}
                  disablePortal
                  // inputValue={destination}
                  options={provices}
                  getOptionLabel={(option) => option.province_name}
                  onChange={handleChangeDestination}
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
                            <BedIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                />
              ) : (
                <LoadingInputSearch />
              )}
            </GridItemStyle>
            <GridItemStyle>
              <Box ref={dateRef}>
                <Stack
                  direction={"row"}
                  spacing={1}
                  onClick={() => setOpenDate(!openDate)}
                >
                  <CalendarMonthIcon />
                  <Stack>
                    <Typography>
                      {`${format(date[0].startDate, "E P", {
                        locale: vi,
                      })} - ${format(date[0].endDate, "E P", {
                        locale: vi,
                      })}`}
                    </Typography>
                  </Stack>
                </Stack>
                {openDate && (
                  <DatePickerStyle onClick={handleClickDatePicker}>
                    <DatePicker date={date} onChangeDate={handleChangeDate} />
                  </DatePickerStyle>
                )}
              </Box>
            </GridItemStyle>
            <GridItemStyle>
              <Box>
                <Stack
                  direction={"row"}
                  spacing={1}
                  onClick={() => setOpenOptions(!openOptions)}
                >
                  <PermIdentityIcon />
                  <Typography>{`${options.adult} người lớn · ${options.children} trẻ em · ${options.room} phòng`}</Typography>
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
            </GridItemStyle>
            <GridItemStyle>
              <Button
                sx={{ height: "100%", borderRadius: "2px" }}
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleSearch(destination)}
              >
                Tìm
              </Button>
            </GridItemStyle>
          </GridStyle>
        </WrapperStyle>
      </Container>
    </Box>
  );
}

SearchList.propTypes = {};

export default SearchList;
