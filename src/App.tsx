import React from "react";
import "./App.css";
import GlobalStyles from "./component/Styled/GlobalStyled";
import Header1 from "./component/Header/Header1/Header1";
import LoginPage from "./screen/Auth/LoginPage";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <LoginPage />
      </div>
    </>
  );
};

export default App;
