import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Page from "~/components/Page";
import { appActions } from "~/features/app/appSlice";
import { authActions } from "~/features/authentication/authSlice";

function VerifyAdmin(props) {
  const [code, setCode] = useState("");
  const dispatch = useDispatch();

  const handleOnClickConfirm = () => {
    if (!code) {
      toast.error("Vui lòng điền đầy đủ.");
      return;
    }

    dispatch(appActions.setOpenOverlay(true));
    dispatch(appActions.setText("Đang xác thực..."));

    dispatch(
      authActions.verifySignInAdminStart({
        code,
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
                minWidth: 800,
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
                <Typography variant="h4">Nhập mã code ADMIN</Typography>

                <Typography variant="caption" color="red" fontStyle="italic">
                  Nhập mã để có thể vào hệ thống.
                </Typography>
              </Box>

              <Box mt={6}>
                <TextField
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                  fullWidth
                  autoComplete="code"
                  type="text"
                  label="Mã code"
                  helperText={"Vui lòng nhập chính xác"}
                />
              </Box>

              <Box display="flex" justifyContent="center" alignItems="center">
                <Button
                  onClick={handleOnClickConfirm}
                  variant="outlined"
                  sx={{ mt: 6 }}
                >
                  Xác nhận
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Page>
  );
}

VerifyAdmin.propTypes = {};

export default VerifyAdmin;
