import Overlay from "./components/Overlay";
import ScrollToTop from "./components/ScrollToTop";
import { BaseOptionChartStyle } from "./components/chart/BaseOptionChart";
import Router from "./routes";
import ThemeProvider from "./theme";

function App() {
  return (
    <>
      <Overlay />
      <ThemeProvider>
        <ScrollToTop />
        <BaseOptionChartStyle />
        <Router />
      </ThemeProvider>
    </>
  );
}

export default App;
