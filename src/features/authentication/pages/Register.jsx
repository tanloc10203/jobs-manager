import { Link as RouterLink, useLocation, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { Card, Link, Container, Typography } from "@mui/material";
import useResponsive from "~/hooks/useResponsive";
import Page from "~/components/Page";
import Logo from "~/components/Logo";
import AuthSocial from "~/sections/auth/AuthSocial";
import { RegisterForm } from "~/sections/auth/register";
import { useDispatch } from "react-redux";
import { appActions } from "~/features/app/appSlice";
import { authActions } from "../authSlice";
import config from "~/configs";

const RootStyle = styled("div")(({ theme }) => ({
  [theme.breakpoints.up("md")]: {
    display: "flex",
  },
}));

const HeaderStyle = styled("header")(({ theme }) => ({
  top: 0,
  zIndex: 9,
  lineHeight: 0,
  width: "100%",
  display: "flex",
  alignItems: "center",
  position: "absolute",
  padding: theme.spacing(3),
  justifyContent: "space-between",
  [theme.breakpoints.up("md")]: {
    alignItems: "flex-start",
    padding: theme.spacing(7, 5, 0, 7),
  },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 464,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
  maxWidth: 480,
  margin: "auto",
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Register() {
  const smUp = useResponsive("up", "sm");

  const mdUp = useResponsive("up", "md");

  const dispatch = useDispatch();

  const handleSumbit = (value) => {
    dispatch(appActions.setOpenOverlay(true));
    dispatch(appActions.setText("Đang đăng ký vui lòng đợi..."));
    dispatch(authActions.signUpStart(value));
  };

  return (
    <Page title="Đăng ký">
      <RootStyle>
        <HeaderStyle>
          <Logo />
          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Bạn đã có tài khoản? {""}
              <Link variant="subtitle2" component={RouterLink} to="/sign-in">
                Đăng nhập
              </Link>
            </Typography>
          )}
        </HeaderStyle>

        {mdUp && (
          <SectionStyle>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Quản lý Jobs
            </Typography>
            <img
              alt="register"
              src="/static/illustrations/illustration_register.png"
            />
          </SectionStyle>
        )}

        <Container>
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Bắt đầu hoàn toàn miễn phí.
            </Typography>

            <Typography sx={{ color: "text.secondary", mb: 5 }}>
              Điền đầy đủ thông tin của bạn.
            </Typography>

            <RegisterForm onSubmit={handleSumbit} />

            {!smUp && (
              <Typography variant="body2" sx={{ mt: 3, textAlign: "center" }}>
                Bạn đã có tài khoản?{" "}
                <Link variant="subtitle2" to="/sign-in" component={RouterLink}>
                  Đăng nhập
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}
