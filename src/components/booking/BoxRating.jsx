import React from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

function BoxRating({ rate, sx }) {
  return (
    <Box
      sx={{
        background: "#003580",
        borderRadius: "calc(32px/5.5) calc(32px/5.5) calc(32px/5.5) 0",
        height: "32px",
        minWidth: "32px",
        verticalAlign: "baseline",
        width: "32px",
        display: "flex",
        alignItems: "center",
        color: "#fff",
        justifyContent: "center",
        fontWeight: 700,
        ...sx,
      }}
    >
      {rate}
    </Box>
  );
}

BoxRating.propTypes = {
  rate: PropTypes.number.isRequired,
  sx: PropTypes.object,
};

export default BoxRating;
