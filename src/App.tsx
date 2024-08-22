import React from "react";
import "./App.css";
import GlobalStyles from "./component/Styled/GlobalStyled";
import ProfileCard from "./component/ProfileCard/ProfileCard";
import Header1 from "./component/Header/Header1/Header1";
import LoginPage from "./screen/Auth/LoginPage";
import Calendar from "./component/Calendar/Calendar";
import CalendarPage from "./screen/Calendar/CalendarPage";
import CheckBox from "./component/CheckBox/CheckBox";
import CheckButton from "./component/Button/CheckButton";
import RadioButton from "./component/Button/RadioButton";
import ActivityDaysSelector from "./component/Button/ActivityDaysSelector";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <CheckButton items={["월", "화", "수", "목"]} title="체크버튼" />
        <RadioButton items={["월", "화", "수", "목"]} title="라디오버튼" />
        <ActivityDaysSelector />
      </div>
    </>
  );
};

export default App;
