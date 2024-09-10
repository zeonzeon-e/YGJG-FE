import React from "react";
import "./App.css";
import GlobalStyles from "./components/Styled/GlobalStyled";
import FindPassWardPage from "./screen/Auth/FindPassWardPage";
import MyPage from "./screen/My/Mypage";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <MyPage />
      </div>
    </>
  );
};

export default App;
