import React from "react";
import PropTypes from "prop-types";
import { Stack, Typography } from "@mui/material";
import { fPrice } from "~/utils/formatNumber";

function TextAndPrice({
  mt = 1,
  text = "",
  price = 0,
  fontSize = 14,
  sx,
  content,
  fontWeight = 500,
  sxText,
  ...others
}) {
  return (
    <Stack
      mt={mt}
      {...others}
      sx={{ ...sx }}
      direction="row"
      justifyContent="space-between"
    >
      <Typography fontSize={fontSize} fontWeight={fontWeight}>
        {text}
      </Typography>
      <Typography fontSize={fontSize} fontWeight={700} sx={{ ...sxText }}>
        {price !== 0 ? fPrice(price) : content}
      </Typography>
    </Stack>
  );
}

TextAndPrice.propTypes = {
  mt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  text: PropTypes.string,
  price: PropTypes.number,
  content: PropTypes.string,
  sx: PropTypes.object,
  sxText: PropTypes.object,
  fontSize: PropTypes.number,
  fontWeight: PropTypes.number,
};

export default TextAndPrice;
