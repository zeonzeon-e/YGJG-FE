import React from "react";
import "./App.css";
import MatchHeader from "./component/Header/MatchHeader/MatchHeader";
import MenuList from "./component/MenuList/MenuList";
import Header1 from "./component/Header/Header1/Header1";
import Header2 from "./component/Header/Header2/Header2";
import Notice from "./screen/Notice/Notice";

function App() {
  return (
    <div className="App">
      <Header2 text="테스트 입니다" line={false} />
      <MatchHeader
        date="2024년 7월 19일"
        time="20시"
        team1="대한민국 팀"
        team2="다음 팀"
      />
      <Notice />
    </div>
  );
}

export default App;
