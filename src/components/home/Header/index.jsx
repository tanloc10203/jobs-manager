import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import EditLocationIcon from "@mui/icons-material/EditLocation";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import HotTubIcon from "@mui/icons-material/HotTub";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import TimeToLeaveIcon from "@mui/icons-material/TimeToLeave";
import { Box, Container, Tab, Tabs, tabsClasses, Toolbar } from "@mui/material";

function Header(props) {
  const tabs = [
    { label: "Lưu trú", Icon: <LocalTaxiIcon /> },
    { label: "Chuyến bay", Icon: <FlightTakeoffIcon /> },
    { label: "Chuyến bay + Khách sạn", Icon: <HotTubIcon /> },
    { label: "Thuê xe", Icon: <DirectionsCarFilledIcon /> },
    { label: "Địa điểm tham quan", Icon: <EditLocationIcon /> },
    { label: "Taxi sân bay", Icon: <TimeToLeaveIcon /> },
  ];

  return (
    <Box sx={{ background: "#003580" }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ color: "#fff" }}>
          <Tabs
            value={0}
            variant="scrollable"
            scrollButtons
            allowScrollButtonsMobile
            aria-label="visible arrows tabs example"
            sx={{
              [`& .${tabsClasses.scroller}`]: {
                "&.Mui-disabled": { opacity: 0.3 },
              },
            }}
          >
            {tabs.map((t, index) => (
              <Tab
                label={t.label}
                key={index}
                color="inherit"
                iconPosition="start"
                icon={t.Icon}
              />
            ))}
          </Tabs>
        </Toolbar>
      </Container>
    </Box>
  );
}

export default Header;
