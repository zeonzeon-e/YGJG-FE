import React from "react";
import "./App.css";
import GlobalStyles from "./component/Styled/GlobalStyled";
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
