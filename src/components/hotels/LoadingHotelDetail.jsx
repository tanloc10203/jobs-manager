import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Container,
  Grid,
  ImageList,
  ImageListItem,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

function LoadingHotelDetail(props) {
  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 5 }}>
      <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={300} />
      <Skeleton variant="text" sx={{ fontSize: "14px" }} width={350} />
      <Skeleton variant="text" sx={{ fontSize: "14px" }} width={280} />

      <Box
        sx={{
          width: "100%",
          height: { md: 400, xs: 300 },
          overflowY: "scroll",
          mt: 2,
        }}
      >
        <ImageList
          variant="masonry"
          sx={{ columnCount: { md: "4 !important" } }}
          gap={8}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <ImageListItem key={item}>
              <Skeleton
                variant="rounded"
                sx={{
                  height: { md: 200, xs: 300 },
                  borderRadius: "2px",
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>

      <Stack
        justifyContent="space-between"
        direction={{ md: "row", xs: "column" }}
        width="100%"
        mt={3}
        spacing={2}
        mb={4}
      >
        <Box
          sx={{
            flexBasis: { md: "66.66667%", xs: "100%" },
            width: { md: "66.66667%", xs: "100%" },
            maxWidth: { md: "66.66667%", xs: "100%" },
          }}
        >
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="100%" />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="100%" />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="100%" />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="100%" />
          <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="100%" />
        </Box>
        <Box
          sx={{
            flexBasis: { md: "33.33333%", xs: "100%" },
            width: { md: "33.33333%", xs: "100%" },
            maxWidth: { md: "33.33333%", xs: "100%" },
            marginLeft: "auto",
          }}
        >
          <Box
            sx={{
              marginLeft: "auto",
              width: { md: "80%", xs: "100%" },
              background: "#e4f4ff",
              padding: "24px 12px 24px 12px",
            }}
          >
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="100%" />
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="100%" />
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="100%" />
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="100%" />
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width="100%" />
            <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={100} />
            <Box mt={2}>
              <Skeleton variant="rounded" width="100%" height={35} sx={{}} />
            </Box>
          </Box>
        </Box>
      </Stack>

      <hr style={{ borderTop: "1px solid #e7e7e7" }} />

      <Box mt={4}>
        <Typography variant="h4">Phòng trống</Typography>
        <Grid container mt={4} spacing={1}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} item lg={3} md={4} xs={12}>
              <Paper
                sx={{
                  boxShadow: "0 0 9px 1px rgba(0,0,0,0.2)",
                  p: 2,
                  borderRadius: "2px",
                  "&:hover": {
                    boxShadow: "0 0 9px 1px #4c76b2",
                  },
                }}
              >
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1.5rem" }}
                  width="100%"
                />
                <Box mt={2} mb={2}>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "14px" }}
                    width="100%"
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "14px" }}
                    width="100%"
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "14px" }}
                    width="100%"
                  />
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "14px" }}
                    width="100%"
                  />

                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "14px" }}
                    width="100%"
                  />
                </Box>

                <Box mb={2}>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "14px" }}
                    width="70%"
                  />
                </Box>

                <hr style={{ borderTop: "1px solid #e7e7e7" }} />

                <Box sx={{ mt: 2 }}>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "14px" }}
                    width="70%"
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "14px" }}
                    width="100%"
                  />
                </Box>

                <Box sx={{ mt: 1 }}>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "2.4rem" }}
                    width="100%"
                  />
                </Box>

                <Box sx={{ mt: 1 }}>
                  <Skeleton
                    variant="text"
                    sx={{ fontSize: "2.4rem" }}
                    width="100%"
                  />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

LoadingHotelDetail.propTypes = {};

export default LoadingHotelDetail;
