import React from "react";
import "./App.css";
import GlobalStyles from "./component/Styled/GlobalStyled";
import CalendarPage from "./screen/Calendar/CalendarPage";
import CheckBox from "./component/CheckBox/CheckBox";

const App = () => {
  const content: [string,string][] = [["제목1", "설명1"],["제목2", "설명2"], ["제목3", "설명3"]]
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <CheckBox content={content} isToggle={true} />
      </div>
    </>
  );
};

export default App;
