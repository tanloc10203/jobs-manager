import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function MailList(props) {
  return (
    <Box sx={{ background: "#003580", mb: 2, color: "#fff" }}>
      <Container maxWidth="lg">
        <Stack
          sx={{
            p: {
              lg: 7,
              md: 4,
              xs: 3,
            },
          }}
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Typography variant="h4" fontWeight={500}>
            Tiết kiệm thời gian và tiền bạc!
          </Typography>
          <Typography color="#dedede">
            Hãy đăng ký và chúng tôi sẽ gửi những ưu đãi tốt nhất cho bạn
          </Typography>
          <Stack direction={{ sm: "column", md: "row" }} spacing={3}>
            <TextField
              sx={{ "& input": { color: "#fff" }, mb: { xs: 1 } }}
              placeholder="Địa chỉ e-mail của bạn"
            />
            <Button variant="contained">Đăng ký</Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

MailList.propTypes = {};

export default MailList;
