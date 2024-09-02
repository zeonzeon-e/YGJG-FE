import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FindPassWardPage from "./screen/Auth/FindPassWardPage";
import FindPassWardPhonePage from "./screen/Auth/FindPassWardPhonePage";
import MyPage from "./screen/My/Mypage";
import TeamInfoEdit from "./screen/My/TeamInfoEdit";
import PersonalCalendarPage from "./screen/My/PersonalCalendarPage";
import JoinApprovalStatus from "./screen/My/JoinApprovalSataus";
import { createGlobalStyle } from "styled-components";
import LoginPage from "./screen/Auth/LoginPage";
import TeamListPage from "./screen/Filter/TeamListPage";

const GlobalStyle = createGlobalStyle`
  body, #root, .app-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <App /> */}
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<TeamListPage />} />
        <Route path="/login/find-pw" element={<FindPassWardPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="/my/calendar" element={<PersonalCalendarPage />} />
        <Route path="/my/joinstatus" element={<JoinApprovalStatus />} />
        <Route
          path="/login/find-pw/phone"
          element={<FindPassWardPhonePage />}
        />
        <Route path="/team-edit/:id" element={<TeamInfoEdit />} />{" "}
        {/* 팀 정보 수정 페이지 */}
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
