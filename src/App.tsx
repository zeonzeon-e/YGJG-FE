import React from "react";
import "./App.css";
import "./index.css";
import Calendar from "./component/Calendar/Calendar";
import TeamJoinHeader from "./component/Header/TeamJoinHeader/TeamJoinHeader";
import Header2 from "./component/Header/Header2/Header2";
import ScrollProgress from "./component/ScrollProgress/ScrollProgress";

function App() {
  return (
    <div className="App">
      <Header2 text="팀 경기 일정" line={true} />
      <Calendar />
      <ScrollProgress targetWidth={15} duration={10} />
    </div>
  );
}

export default App;
