import React from "react";
import "./App.css";
import GlobalStyles from "./component/Styled/GlobalStyled";
import FindPassWardPage from "./screen/Auth/FindPassWardPage";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <FindPassWardPage />
      </div>
    </>
  );
};

export default App;
