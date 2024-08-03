import React from "react";
import "./App.css";
import GlobalStyles from "./component/Styled/GlobalStyled";
import CalendarPage from "./screen/Calendar/CalendarPage";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <CalendarPage />
      </div>
    </>
  );
};

export default App;
