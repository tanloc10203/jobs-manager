import { Grid } from "@mui/material";
import LazyLoadImage from "../../LazyLoadImage";

export default function PropertyList() {
  return (
    <Grid container spacing={1}>
      {itemData.map((item, index) => (
        <Grid key={index} item md={4}>
          <LazyLoadImage
            alt={item.title}
            src={item.img}
            sx={{ borderRadius: 1 }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
];
