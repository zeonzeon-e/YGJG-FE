import React from "react";
import "./App.css";
import GlobalStyles from "./component/Styled/GlobalStyled";
import CalendarPage from "./screen/Calendar/CalendarPage";
import CheckBox from "./component/CheckBox/CheckBox";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <CheckBox title="제목이다" isToggle={false} detail="내용이다" />
      </div>
    </>
  );
};

export default App;
