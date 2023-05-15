import * as React from "react";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import LazyLoadImage from "../LazyLoadImage";
import Box from "@mui/material/Box";

function srcset(image, size, rows = 1, cols = 1) {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
}

export default function ListImage({ data }) {
  return (
    <Box
      sx={{
        width: "100%",
        minHeight: { md: 100, xs: 50 },
        maxHeight: { md: 400, xs: 300 },
        overflowY: "scroll",
        mt: 2,
      }}
    >
      <ImageList
        variant="masonry"
        sx={{ columnCount: { md: "4 !important" } }}
        gap={8}
      >
        {data.map((item, index) => (
          <ImageListItem key={index}>
            <LazyLoadImage
              src={`${item.r_image_value}?w=248&fit=crop&auto=format`}
              srcSet={`${item.r_image_value}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt=""
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}
