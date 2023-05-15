import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { authAPI } from "~/apis";
import { appActions } from "~/features/app/appSlice";

const theme = createTheme();

export default function ChangePwd() {
  const { search } = useLocation();
  const { userId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!data.get("password")) {
      return toast.error("Vui lòng nhập mật khẩu mới.");
    }

    if (data.get("password").length < 5) {
      return toast.error("Nhập ít nhất 5 kí tự");
    }

    dispatch(appActions.setOpenOverlay(true));
    dispatch(appActions.setText("Đang thực hiện thay đổi..."));

    const values = {
      userId: userId,
      password: data.get("password"),
      token: search.split("=")[1],
    };

    try {
      const response = await authAPI.changePwd(values);

      if (response) {
        dispatch(appActions.setOpenOverlay(false));
        dispatch(appActions.setText(""));
        toast.success("Thay đổi mật khẩu thành công.");
        navigate("/sign-in", { replace: true });
      }
    } catch (error) {
      dispatch(appActions.setOpenOverlay(false));
      dispatch(appActions.setText(""));
      let message = error.message;

      if (error?.response && error.response.data) {
        message = error.response.data.message;
      }

      return Swal.fire({
        icon: "error",
        title: "Đã xảy ra lỗi...",
        text: `${message}`,
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Thay đổi mật khẩu
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mật khẩu mới"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Gửi
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
