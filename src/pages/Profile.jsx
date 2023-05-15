import EditIcon from "@mui/icons-material/Edit";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Container,
  IconButton,
  Tooltip,
} from "@mui/material";
import _ from "lodash";
import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Footer, Header, MailList, NavBar } from "~/components/home";
import Page from "~/components/Page";
import ProfileForm from "~/components/profile/ProfileForm";
import { appActions } from "~/features/app/appSlice";
import { authState } from "~/features/authentication/authSlice";
import { userActions } from "~/features/users/userSlice";
import account from "~/_mock/account";

function Profile(props) {
  const { user } = useSelector(authState);
  const dispatch = useDispatch();

  const initialValues = useMemo(() => {
    let result = {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      username: "",
      ...user,
    };

    Object.keys(result).forEach((key) => {
      if (result[key] === null) {
        result[key] = "";
      }
    });

    return result;
  }, [user]);

  const handleSubmit = (values) => {
    if (_.isEmpty(user)) return;

    dispatch(appActions.setOpenOverlay(true));
    dispatch(appActions.setText("Đang cập nhật..."));
    dispatch(userActions.updateStart({ id: user.user_id, data: values }));
  };

  return (
    <Page title="Thông tin cá nhân">
      <NavBar />
      <Header />

      <Container maxWidth="xs" sx={{ p: { sm: 2, lg: 6, xs: 2 } }}>
        <Card
          elevation={24}
          sx={{
            borderRadius: "2px",
            transition: "all .25s ease",
            width: "100%",
            p: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Box
                sx={{
                  padding: 0.5,
                  border: "2px solid #dedede",
                  width: "100%",
                  height: "100%",
                  borderRadius: "100%",
                }}
              >
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={user?.picture || account.photoURL}
                  alt="photoURL"
                />
              </Box>

              <Box
                position="absolute"
                sx={{
                  bottom: 0,
                  right: 0,
                  height: 30,
                  width: 30,
                  background: "#fff",
                  boxShadow:
                    "rgb(0 0 0 / 20%) 0px 4px 5px 0px, rgb(0 0 0 / 12%) 0px 3px 14px 3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px",
                  borderRadius: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Tooltip title="Thay đổi">
                  <IconButton size="small" aria-label="edit" color="inherit">
                    <EditIcon fontSize="inherit" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          {!_.isEmpty(user) && (
            <CardContent sx={{ textAlign: "center" }}>
              <ProfileForm
                initialValues={initialValues}
                onSubmit={handleSubmit}
              />
            </CardContent>
          )}
        </Card>
      </Container>

      <MailList />
      <Footer />
    </Page>
  );
}

Profile.propTypes = {};

export default Profile;
