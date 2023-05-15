import { Box, Typography } from "@mui/material";
import { format } from "date-fns";
import vi from "date-fns/locale/vi";
import PropTypes from "prop-types";

function BoxTime({ title, date, timeText, sx }) {
  return (
    <Box flex={1} sx={{ ...sx }}>
      <Typography mb={0.5} fontSize={14}>
        {title}
      </Typography>
      <Typography fontSize={18} fontWeight={700}>
        {`${format(date, "E P", {
          locale: vi,
        })} `}
      </Typography>
      <Typography mb={0.5} fontSize={14}>
        {timeText}
      </Typography>
    </Box>
  );
}

BoxTime.propTypes = {
  title: PropTypes.string,
  date: PropTypes.any,
  timeText: PropTypes.string,
  sx: PropTypes.object,
};

export default BoxTime;
