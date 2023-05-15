import { Card, Container, Link, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Link as RouterLink, Outlet } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import Logo from "./../../components/Logo";
import Page from "./../../components/Page";
// sections

// ----------------------------------------------------------------------

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

function SignInLayout() {
  const smUp = useResponsive("up", "sm");

  const mdUp = useResponsive("up", "md");

  return (
    <Page title="Đăng nhập">
      <RootStyle>
        <HeaderStyle>
          <Logo />

          {smUp && (
            <Typography variant="body2" sx={{ mt: { md: -2 } }}>
              Bạn không có tài khoản? {""}
              <Link variant="subtitle2" component={RouterLink} to="/sign-up">
                Đăng ký
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
              src="/static/illustrations/illustration_login.png"
              alt="login"
            />
          </SectionStyle>
        )}

        <Container maxWidth="sm">
          <ContentStyle>
            <Typography variant="h4" gutterBottom>
              Đăng nhập vào jobs
            </Typography>

            <Typography sx={{ color: "text.secondary", mb: 5 }}>
              Nhập chi tiết thông tin đăng nhập của bạn
            </Typography>

            <Outlet />

            {!smUp && (
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Bạn không có tài khoản?{" "}
                <Link variant="subtitle2" component={RouterLink} to="/sign-up">
                  Đăng ký
                </Link>
              </Typography>
            )}
          </ContentStyle>
        </Container>
      </RootStyle>
    </Page>
  );
}

export default SignInLayout;
