import { Card, Container, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import permissionAPI from "~/apis/permission";
import Logo from "~/components/Logo";
import Page from "~/components/Page";
import { appActions } from "~/features/app/appSlice";
import { authActions } from "~/features/authentication/authSlice";
import useResponsive from "~/hooks/useResponsive";
import { RegisterForm } from "~/sections/auth/register";

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

export default function RegisterAdmin() {
  const smUp = useResponsive("up", "sm");
  const mdUp = useResponsive("up", "md");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      const response = await permissionAPI.checkFirstStartApp();
      if (response?.metadata.start) navigate(-1);
    })();
  }, []);

  const handleSumbit = (values) => {
    console.log("values", values);
    dispatch(appActions.setOpenOverlay(true));
    dispatch(appActions.setText("Đang đăng ký vui lòng đợi..."));
    dispatch(authActions.signUpAdminStart(values));
  };

  return (
    <Page title="Đăng ký admin">
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
              Bắt đầu hoàn quản lý hệ thống.
            </Typography>

            <Typography sx={{ color: "text.secondary", mb: 5 }}>
              Điền đầy đủ thông tin dành cho Admin.
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
