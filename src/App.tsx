import React from "react";
import "./App.css";
import Calendar from "./component/Calendar/Calendar";
import TeamJoinHeader from "./component/Header/TeamJoinHeader/TeamJoinHeader";

function App() {
  return (
    <div className="App">
      <TeamJoinHeader
        profileImage="https://via.placeholder.com/50"
        userName="거북이"
        applicationTitle="팀 가입 신청서"
      />
      <Calendar />
    </div>
  );
}

export default App;
