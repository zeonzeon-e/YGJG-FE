import React from "react";
import "./App.css";
import GlobalStyles from "./component/Styled/GlobalStyled";
import CalendarPage from "./screen/Calendar/CalendarPage";
import CheckBox from "./component/CheckBox/CheckBox";
import MatchCard from "./component/MatchCard/MatchCard";
import Input from "./component/Styled/Input"

const App = () => {
  const content: [string,string][] = [["제목1", "설명1"],["제목2", "설명2"], ["제목3", "설명3"]]
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <CheckBox content={content} isToggle={true} />
        <MatchCard time={"10시"} color="#000000" teams="대한민국 팀 vs 다음 팀"/>
        <Input type="text" placeholder="이름을 입력하세요" color="var(--color-light2)" />
      </div>
    </>
  );
};

export default App;
