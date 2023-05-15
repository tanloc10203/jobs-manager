import { useEffect, useState } from "react";
import { Outlet, useLocation, useMatch, useRoutes } from "react-router-dom";
// material
import { styled } from "@mui/material/styles";
//
import DashboardNavbar from "./DashboardNavbar";
import DashboardSidebar from "./DashboardSidebar";
import { useDispatch, useSelector } from "react-redux";
import { authActions, authState } from "~/features/authentication/authSlice";
import config from "~/configs";

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 64;
const APP_BAR_DESKTOP = 92;

const RootStyle = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100%",
  paddingTop: APP_BAR_MOBILE + 24,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
}));

// ----------------------------------------------------------------------

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);
  const { accessToken } = useSelector(authState);
  const dispatch = useDispatch();
  const locations = useLocation();

  useEffect(() => {
    if (accessToken) {
      dispatch(
        authActions.getCurrentUserStart({
          accessToken,
          location:
            locations.pathname.search("manager") !== -1
              ? config.app.key.manageAdmin
              : null,
        })
      );
    }
  }, [accessToken]);

  return (
    <RootStyle>
      <DashboardNavbar
        onOpenSidebar={() => setOpen((pre) => !pre)}
        isOpen={open}
      />
      <DashboardSidebar
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
      />
      <MainStyle>
        <Outlet />
      </MainStyle>
    </RootStyle>
  );
}
