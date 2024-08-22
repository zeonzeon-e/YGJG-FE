import React from "react";
import "./App.css";
import GlobalStyles from "./component/Styled/GlobalStyled";
import ProfileCard from "./component/ProfileCard/ProfileCard";
import Header1 from "./component/Header/Header1/Header1";
import LoginPage from "./screen/Auth/LoginPage";
import Calendar from "./component/Calendar/Calendar";
import CalendarPage from "./screen/Calendar/CalendarPage";
import CheckBox from "./component/CheckBox/CheckBox";
import GroupButton from "./component/Button/GroupButton/GroupButton";
import CheckButton from "./component/Button/CheckButton";
import RadioButton from "./component/Button/RadioButton";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <GroupButton items={["월", "화","수", "목"]} type="multi" />
        <CheckButton items={["월", "화","수", "목"]} />
        <RadioButton items={["월", "화","수", "목"]} />
      </div>
    </>
  );
};

export default App;
