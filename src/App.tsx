import React from "react";
import "./App.css";
import Header2 from "./component/Header/Header2/Header2";
import Header1 from "./component/Header/Header1/Header1";

function App() {
  return (
    <div className="App">
      <Header2 text="최씨 민석" />
      <Header1 text="최씨 민석" line={false} />
    </div>
  );
}

export default App;
