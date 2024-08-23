import React from "react";
import "./App.css";
import GlobalStyles from "./component/Styled/GlobalStyled";
import FindPassWardPage from "./screen/Auth/FindPassWardPage";
import BottomNavBar from "./component/Nevigation/BottomNavBar";
import CalendarPage from "./screen/Calendar/CalendarPage";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <FindPassWardPage />
        <BottomNavBar />
      </div>
    </>
  );
};

export default App;
