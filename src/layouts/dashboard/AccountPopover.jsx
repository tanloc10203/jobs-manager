import { useMemo, useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// @mui
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
// components
import MenuPopover from "../../components/MenuPopover";
// mocks_
import _ from "lodash";
import { useDispatch, useSelector } from "react-redux";
import config from "~/configs";
import { appActions } from "~/features/app/appSlice";
import { authActions, authState } from "~/features/authentication/authSlice";
import account from "../../_mock/account";

export default function AccountPopover() {
  const anchorRef = useRef(null);
  const { user } = useSelector(authState);
  const dispatch = useDispatch();

  const [open, setOpen] = useState(null);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleSignOut = () => {
    return new Promise((resolve) => {
      setOpen(null);

      if (_.isElement(user)) return;

      dispatch(appActions.setOpenOverlay(true));
      dispatch(appActions.setText("Đang đăng xuất..."));

      setTimeout(() => {
        dispatch(authActions.signOutStart({ user_id: user.user_id }));
        resolve(true);
      }, 300);
    });
  };

  const MENU_OPTIONS = useMemo(() => {
    if (_.isEmpty(user)) return [];

    if (user.role === config.user.role.ADMIN)
      return [
        {
          label: "Hồ sơ",
          icon: "eva:person-fill",
          linkTo: "/profile",
        },
        {
          label: "Phòng đã đặt",
          icon: "eva:person-fill",
          linkTo: "/booking/info",
        },
        {
          label: "Quản trị hệ thống (ADMIN)",
          icon: "eva:person-fill",
          linkTo: "/manager/app",
        },
      ];

    if (user.role === config.user.role.HOTEL) {
      return [
        {
          label: "Hồ sơ",
          icon: "eva:person-fill",
          linkTo: "/profile",
        },
        {
          label: "Phòng đã đặt",
          icon: "eva:person-fill",
          linkTo: "/booking/info",
        },
        {
          label: "Quản lý khách sạn",
          icon: "eva:person-fill",
          linkTo: "/manager/app",
        },
      ];
    }

    return [
      {
        label: "Hồ sơ",
        icon: "eva:person-fill",
        linkTo: "/profile",
      },
      {
        label: "Phòng đã đặt",
        icon: "eva:person-fill",
        linkTo: "/booking/info",
      },
    ];
  }, [user]);

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={user?.picture || account.photoURL} alt="photoURL" />
      </IconButton>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{
          p: 0,
          mt: 1.5,
          ml: 0.75,
          "& .MuiMenuItem-root": {
            typography: "body2",
            borderRadius: 0.75,
          },
        }}
      >
        {user && (
          <Box sx={{ my: 1.5, px: 2.5 }}>
            <Typography variant="subtitle2" noWrap>
              {user.full_name}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
              {user.email}
            </Typography>
          </Box>
        )}

        <Divider sx={{ borderStyle: "dashed" }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem
              key={option.label}
              to={option.linkTo}
              component={RouterLink}
              onClick={handleClose}
            >
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: "dashed" }} />

        <MenuItem onClick={handleSignOut} sx={{ m: 1 }}>
          Đăng xuất
        </MenuItem>
      </MenuPopover>
    </>
  );
}
