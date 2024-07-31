import React from "react";
import "./App.css";
import Calendar from "./component/Calendar/Calendar";
import Header2 from "./component/Header/Header2/Header2";

const App = () => {
  return (
    <div className="App">
      <Header2 text="주연상 바보" line={false} />
      <Calendar />
    </div>
  );
};

export default App;
