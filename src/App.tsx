import React from "react";
import "./App.css";
import "./index.css";
import Calendar from "./component/Calendar/Calendar";
import TeamJoinHeader from "./component/Header/TeamJoinHeader/TeamJoinHeader";
import Header2 from "./component/Header/Header2/Header2";
import ScrollProgress from "./component/ScrollProgress/ScrollProgress";
import Searchbar from "./component/Searchbar/Searchbar";

function App() {
  return (
    <div className="App">
      <Header2 text="팀 경기 일정" line={true} />
      <Calendar />
      <ScrollProgress targetWidth={15} duration={10} />
      <Searchbar />
      <h1>안녕하세요</h1>
      <h2>안녕하세요</h2>
      <h3>안녕하세요</h3>
      <h4>안녕하세요</h4>
      <h5>안녕하세요</h5>
      <p>안녕하세요</p>
    </div>
  );
}

export default App;
