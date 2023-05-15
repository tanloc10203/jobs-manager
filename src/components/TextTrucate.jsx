import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

function TextTrucate({ text, lineShow, width, sx }) {
  return (
    <Typography
      sx={{
        display: "-webkit-box",
        WebkitLineClamp: lineShow || 1,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
        textOverflow: "ellipsis",
        wordBreak: "break-word",
        width: width || 300,
        ...sx,
      }}
    >
      {text}
    </Typography>
  );
}

TextTrucate.propTypes = {
  text: PropTypes.string.isRequired,
  lineShow: PropTypes.number,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  sx: PropTypes.object,
};

export default TextTrucate;
