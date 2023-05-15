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
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authAPI } from "~/apis";
import { appActions } from "~/features/app/appSlice";

const theme = createTheme();

export default function ChangePwd() {
  const { search } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (!data.get("password")) {
      return toast.error("Vui lòng nhập mật khẩu mới.");
    }

    dispatch(appActions.setOpenOverlay(true));

    const values = {
      body: {
        password: data.get("password"),
      },
      query: search,
    };

    try {
      const response = await authAPI.changePwd({ ...values });

      if (response) {
        dispatch(appActions.setOpenOverlay(false));
        toast.success("Thay đổi mật khẩu thành công.");
        navigate("/sign-in", { replace: true });
      }
    } catch (error) {
      dispatch(appActions.setOpenOverlay(false));
      toast.error(error.message);
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
