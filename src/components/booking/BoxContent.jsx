import { Box, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { memo } from "react";

function BoxContent({
  title,
  children,
  sx,
  variant = "",
  fontSize = 16,
  fontWeight = 700,
}) {
  return (
    <Box
      sx={{
        borderRadius: "2px",
        border: "1px solid #e7e7e7",
        color: "#262626",
        p: 2,
        mt: 3,
        width: "100%",
        ...sx,
      }}
    >
      <Typography variant={variant} fontSize={fontSize} fontWeight={fontWeight}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

BoxContent.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
  variant: PropTypes.string,
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fontWeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default memo(BoxContent);
