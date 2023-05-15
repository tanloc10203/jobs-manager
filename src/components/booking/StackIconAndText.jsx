import React from "react";
import PropTypes from "prop-types";
import { Stack, Typography } from "@mui/material";

function StackIconAndText({ children, text }) {
  return (
    <Stack mt={2} direction="row" alignItems="center" spacing={2}>
      {children}
      <Typography fontSize={13}>{text}</Typography>
    </Stack>
  );
}

StackIconAndText.propTypes = {
  children: PropTypes.node.isRequired,
  text: PropTypes.string.isRequired,
};

export default StackIconAndText;
