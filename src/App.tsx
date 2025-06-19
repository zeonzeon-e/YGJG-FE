import React from "react";
import "./App.css";
import GlobalStyles from "./components/Styled/GlobalStyled";
import MyPage from "./screen/My/Mypage";
import IntroPage from "./screen/IntroPage";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <IntroPage />
      </div>
    </>
  );
};

export default App;
