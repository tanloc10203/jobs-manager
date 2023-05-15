import React from "react";
import PropTypes from "prop-types";
import { Box, Skeleton, Stack } from "@mui/material";

function LoadingHotel(props) {
  return (
    <Stack
      sx={{
        border: "1px solid #c6c6c6",
        borderRadius: "2px",
        padding: "16px",
      }}
      direction={{ md: "row", xs: "column" }}
      spacing={2}
      my="16px"
      width="100%"
    >
      <Skeleton
        variant="rounded"
        sx={{
          width: { md: 200, xs: "100%" },
          height: { md: 200, xs: 300 },
          borderRadius: "2px",
        }}
      />

      <Box flex={2}>
        <Stack
          justifyContent="space-between"
          direction={{ md: "row", xs: "column" }}
        >
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={250} />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={100} />
        </Stack>

        <Stack spacing={1} direction={{ md: "row", xs: "column" }}>
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={180} />
        </Stack>

        <Skeleton variant="text" sx={{ fontSize: "1.5rem" }} width={190} />

        <Stack
          mt={1}
          justifyContent="space-between"
          direction={{ md: "row", xs: "column" }}
        >
          <Box>
            <Skeleton variant="text" sx={{ fontSize: "0.8rem" }} width={200} />
            <Skeleton variant="text" sx={{ fontSize: "0.8rem" }} width={250} />
            <Skeleton variant="text" sx={{ fontSize: "0.8rem" }} width={200} />
            <Skeleton variant="text" sx={{ fontSize: "0.8rem" }} width={300} />
          </Box>

          <Box textAlign={{ md: "right", xs: "left" }}>
            <Skeleton
              variant="text"
              sx={{
                fontSize: "0.9rem",
                ml: {
                  md: "auto",
                },
              }}
              width={90}
            />
            <Skeleton
              variant="text"
              sx={{
                fontSize: "2rem",
                ml: {
                  md: "auto",
                },
              }}
              width={130}
            />
            <Skeleton
              variant="text"
              sx={{
                fontSize: "0.7rem",
                ml: {
                  md: "auto",
                },
              }}
              width={130}
            />
            <Skeleton
              variant="text"
              sx={{
                fontSize: "2.5rem",
                borderRadius: "2px",
                width: { md: 150, xs: "100%" },
              }}
            />
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}

LoadingHotel.propTypes = {};

export default LoadingHotel;
