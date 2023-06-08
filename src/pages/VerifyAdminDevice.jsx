import MarkEmailReadRoundedIcon from "@mui/icons-material/MarkEmailReadRounded";
import VerifiedUserRoundedIcon from "@mui/icons-material/VerifiedUserRounded";
import WarningRoundedIcon from "@mui/icons-material/WarningRounded";
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { authAPI } from "~/apis";
import Page from "~/components/Page";
import { appActions, appState } from "~/features/app/appSlice";

function VerifyAdminDevice(props) {
  const locations = useLocation();
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { openOverlay: loading } = useSelector(appState);

  const uID = useMemo(() => locations.search.split("=")[1], locations);

  useEffect(() => {
    if (!uID) return;

    dispatch(appActions.setOpenOverlay(true));
    dispatch(appActions.setText("Đang xác thực vui lòng đợi..."));

    (async () => {
      const data = {
        userId: uID,
      };

      try {
        setMessage("");
        await authAPI.verifyAdminDevice(data);
        dispatch(appActions.setOpenOverlay(false));
        dispatch(appActions.setText(""));
      } catch (error) {
        dispatch(appActions.setOpenOverlay(false));
        dispatch(appActions.setText(""));
        if (error instanceof AxiosError) {
          if (error.response.data) {
            setMessage(error.response.data?.message);
            Swal.fire({
              icon: "error",
              title: "Lỗi xác thực...",
              text: `${error.response.data?.message}`,
            });
          }
        }
      }
    })();
  }, [uID]);

  if (loading) {
    return <div></div>;
  }

  return (
    <Page title="Xác thực thiết bị">
      <Box>
        <Container maxWidth="lg">
          <Box
            sx={{
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Paper
              elevation={24}
              sx={{
                borderRadius: "2px",

                transition: "all .25s ease",
                p: 6,
                "&:hover": {
                  boxShadow:
                    "rgb(0 0 0 / 20%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 3px 14px 3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px",
                },
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Stack justifyContent="center" alignItems="center">
                  <VerifiedUserRoundedIcon
                    sx={{ height: 100, width: 100, color: "#1B9C85" }}
                  />
                  <Typography variant="h4" color="#1B9C85" sx={{ mt: 3 }}>
                    Xác thực thành công.
                  </Typography>
                  <Typography variant="h4" color="#1B9C85" sx={{ mt: 0.3 }}>
                    Bạn có thể đăng nhập
                  </Typography>
                </Stack>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Page>
  );
}

export default VerifyAdminDevice;
