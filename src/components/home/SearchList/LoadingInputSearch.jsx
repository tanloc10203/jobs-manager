import React from "react";
import PropTypes from "prop-types";
import { Skeleton } from "@mui/material";

function LoadingInputSearch({ sx }) {
  return (
    <Skeleton
      variant="rectangular"
      width={"100%"}
      sx={{ minWidth: 200, bgcolor: "grey.200", height: 60, ...sx }}
      animation="wave"
    />
  );
}

LoadingInputSearch.propTypes = {
  sx: PropTypes.object,
};

export default LoadingInputSearch;
