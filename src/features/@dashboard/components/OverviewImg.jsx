import React from "react";
import PropTypes from "prop-types";
import LazyLoadImage from "~/components/LazyLoadImage";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { styled } from "@mui/material/styles";

const DivStyle = styled("div")(({ theme }) => ({
  position: "relative",
  width: "100%",
  height: "100%",
}));

const IconDeleteStyle = styled(HighlightOffIcon)(({ theme }) => ({
  position: "absolute",
  top: 3,
  right: 3,
  fontSize: 30,
  cursor: "pointer",
  transition: "all 0.25s",
  "&:hover": {
    opacity: 0.5,
    color: "red",
    transform: "rotate(45deg)",
  },
}));

function OverviewImg({ src, onClickImg, onDeleteImg, ...others }) {
  return (
    <DivStyle onClick={onClickImg}>
      <LazyLoadImage
        src={src}
        alt=""
        loading="lazy"
        sx={{ borderRadius: "7px", ...others }}
      />
      <IconDeleteStyle onClick={onDeleteImg} />
    </DivStyle>
  );
}

OverviewImg.propTypes = {
  src: PropTypes.string.isRequired,
  onClickImg: PropTypes.func,
  onDeleteImg: PropTypes.func,
};

export default OverviewImg;
