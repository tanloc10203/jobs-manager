import { Backdrop, CircularProgress } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { appState } from "~/features/app/appSlice";

function Overlay() {
  const { openOverlay, text } = useSelector(appState);

  return (
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={openOverlay}
    >
      <CircularProgress color="inherit" />
      &nbsp; {text || "Đang tải..."}
    </Backdrop>
  );
}

export default Overlay;
