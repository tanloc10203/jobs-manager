import { Outlet } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
// components
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import config from "~/configs";
import { appActions } from "~/features/app/appSlice";
import { authActions } from "~/features/authentication/authSlice";

// ----------------------------------------------------------------------

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  left: 0,
  lineHeight: 0,
  width: "100%",
  position: "absolute",
  padding: theme.spacing(3, 3, 0),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(5, 5, 0),
  },
}));

// ----------------------------------------------------------------------

export default function LogoOnlyLayout() {
  const dispatch = useDispatch();
  const signWithGoogle = localStorage.getItem(
    config.localStorage.signInWithGoole
  );

  useEffect(() => {
    if (signWithGoogle) {
      dispatch(appActions.setOpenOverlay(true));
      dispatch(authActions.getUserSignInWithGoogle());
    }
  });

  return (
    <>
      <Outlet />
    </>
  );
}
