import { Container } from "@mui/material";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import _ from "lodash";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import DetailGuessBooking from "~/components/booking/DetailGuessBooking";
import { NavBar } from "~/components/home";
import Page from "~/components/Page";
import { authState } from "~/features/authentication/authSlice";

const steps = ["Bạn chọn", "Chi tiết về bạn", "Bước cuối"];

function Booking(props) {
  const { state } = useLocation();
  const [active, setActive] = useState(1);
  const { user } = useSelector(authState);

  return (
    <Page title={active === 1 ? "Thông tin của bạn" : "Bước cuối"}>
      <NavBar />

      <Container maxWidth="lg" sx={{ mt: 4, pb: 10 }}>
        <Stepper activeStep={active} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {state?.date?.length && !_.isEmpty(state?.save) && !_.isEmpty(user) && (
          <DetailGuessBooking
            active={active}
            onChangeActive={() => setActive(2)}
            date={state.date}
            hotel={state?.save?.hotel}
            rooms={state?.save?.booking}
          />
        )}
      </Container>
    </Page>
  );
}

export default Booking;
