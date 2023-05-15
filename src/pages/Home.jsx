import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  Header,
  NavBar,
  PropertyList,
  SearchList,
  DiscoverVietnam,
  HomeStayList,
  Footer,
  MailList,
} from "~/components/home";
import Page from "~/components/Page";
import { hotelActions } from "~/features/hotels/hotelSlice";

function Home() {
  const dispatch = useDispatch();
  const [provinceName, setProvinceName] = useState("");

  useEffect(() => {
    dispatch(hotelActions.countAreaStart());
  }, []);

  const handleOnClick = (provinceName) => {
    setProvinceName(provinceName);
  };

  return (
    <Page title="Trang chủ">
      <NavBar />
      <Header />
      <SearchList provinceName={provinceName} />

      <Container sx={{ p: 6, mt: 10 }} maxWidth="lg">
        <PropertyList />
        <DiscoverVietnam onClick={handleOnClick} />
        <HomeStayList />
      </Container>

      <MailList />
      <Footer />
    </Page>
  );
}

export default Home;
