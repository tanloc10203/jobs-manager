import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Page from "~/components/Page";
import { appActions } from "~/features/app/appSlice";
import { authActions } from "~/features/authentication/authSlice";

function VerifyOtp(props) {
  const [otp, setOtp] = useState("");
  const { userId } = useParams();
  const dispatch = useDispatch();

  const handleChange = (newValue) => {
    setOtp(newValue);
  };

  const handleOnClickConfirm = () => {
    if (!otp) {
      toast.error("Vui lòng điền đầy đủ.");
      return;
    }

    if (!userId) {
      return;
    }

    dispatch(appActions.setOpenOverlay(true));
    dispatch(appActions.setText("Đang xác thực..."));

    dispatch(
      authActions.verifySignUpHotelStart({
        userId,
        otp: otp,
      })
    );
  };

  return (
    <Page title="Xác thực">
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
                minWidth: 300,
                minHeight: 300,
                transition: "all .25s ease",
                p: 2,
                "&:hover": {
                  boxShadow:
                    "rgb(0 0 0 / 20%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 3px 14px 3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px",
                },
              }}
            >
              <Box textAlign="center">
                <Typography variant="h4">Nhập mã OTP</Typography>

                <Typography variant="caption" color="red" fontStyle="italic">
                  Mã xác thực đã gửi về email của bạn.
                </Typography>

                <Typography
                  variant="caption"
                  display="block"
                  color="red"
                  fontStyle="italic"
                >
                  Vui lòng kiểm tra email.
                </Typography>
              </Box>

              <Box mt={6}>
                <MuiOtpInput
                  width={300}
                  sx={{
                    "& input": { p: 0 },
                    gap: 1,
                    "&  div": {
                      borderRadius: "2px",
                      width: "100%",
                      height: "100%",
                    },
                  }}
                  height={50}
                  color="#000"
                  length={6}
                  value={otp}
                  onChange={handleChange}
                />
              </Box>

              <Button
                onClick={handleOnClickConfirm}
                variant="outlined"
                sx={{ mt: 6 }}
                fullWidth
              >
                Xác nhận
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Page>
  );
}

VerifyOtp.propTypes = {};

export default VerifyOtp;
