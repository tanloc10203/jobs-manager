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

function ConfirmAccount(props) {
  const { userId } = useParams();
  const locations = useLocation();
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { openOverlay: loading } = useSelector(appState);
  const [isResend, setIsResend] = useState(false);

  const token = useMemo(() => locations.search.split("=")[1], locations);

  useEffect(() => {
    if (!userId) return;

    dispatch(appActions.setOpenOverlay(true));
    dispatch(appActions.setText("Đang xác thực vui lòng đợi..."));

    (async () => {
      const data = {
        token,
        userId,
      };

      try {
        setMessage("");
        await authAPI.verifyAccount(data);
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
  }, [userId, token]);

  const handleResend = async () => {
    try {
      setIsResend(true);
      dispatch(appActions.setOpenOverlay(true));
      dispatch(appActions.setText("Đang xác thực vui lòng đợi..."));
      setMessage("");

      await authAPI.resendVerifyAccount({ userId });
      dispatch(appActions.setOpenOverlay(false));
      dispatch(appActions.setText(""));
    } catch (error) {
      setIsResend(false);
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
  };

  if (loading) {
    return <div></div>;
  }

  return (
    <Page title="Xác thực tài khoản">
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
                {isResend ? (
                  <Stack justifyContent="center" alignItems="center">
                    <MarkEmailReadRoundedIcon
                      sx={{ height: 100, width: 100, color: "#1B9C85" }}
                    />
                    <Typography variant="h4" color="#1B9C85" sx={{ mt: 3 }}>
                      Gửi lại thành công.
                    </Typography>
                    <Typography variant="h4" color="#1B9C85" sx={{ mt: 0.3 }}>
                      Bạn có thể kiểm tra email
                    </Typography>
                  </Stack>
                ) : message ? (
                  <Stack justifyContent="center" alignItems="center">
                    <WarningRoundedIcon
                      sx={{ height: 100, width: 100, color: "#FFB84C" }}
                    />
                    <Typography variant="h4" color="#FFB84C" sx={{ mt: 3 }}>
                      Xác thực không thành công.
                    </Typography>
                    <Typography variant="h4" color="#FFB84C" sx={{ mt: 0.3 }}>
                      Vui lòng gửi mail lại.
                    </Typography>
                  </Stack>
                ) : (
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
                )}

                <Box>
                  {message ? (
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ color: "#FFB84C", mt: 4 }}
                      onClick={handleResend}
                    >
                      Gửi lại
                    </Button>
                  ) : (
                    <Button
                      LinkComponent={Link}
                      to="/sign-in"
                      variant="outlined"
                      sx={{ color: "#1B9C85", mt: 4 }}
                    >
                      Đăng nhập
                    </Button>
                  )}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Page>
  );
}

export default ConfirmAccount;
