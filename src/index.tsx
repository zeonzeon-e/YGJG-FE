import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./screen/Auth/LoginPage";
import FindPassWardPage from "./screen/Auth/FindPassWardPage";
import FindPassWardPhonePage from "./screen/Auth/FindPassWardPhonePage";
import MyPage from "./screen/My/Mypage";
import TeamInfoEdit from "./screen/My/TeamInfoEdit";
import GameStrategy from "./screen/Team/GameStrategy/GameStrategy";
import PersonalCalenderPage from "./screen/My/PersonalCalendarPage";
import JoinApprovalStatus from "./screen/My/JoinApprovalSataus";
import { createGlobalStyle } from "styled-components";
import TeamListPage from "./screen/Filter/TeamListPage";
import FindPassWardEmailPage from "./screen/Auth/FindPassWardEmailPage";
import SignUpPage from "./screen/Auth/SignUpPage";
import IntroPage from "./screen/IntroPage";
import { InvitePage, InvitePassPage } from "./screen/Invite/InvitePage";

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
        <Route path="/" element={<IntroPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/find-pw" element={<FindPassWardPage />} />
        <Route
          path="/login/find-pw/phone"
          element={<FindPassWardPhonePage />}
        />
        <Route path="/team/list" element={<TeamListPage />} />
        <Route path="/my" element={<MyPage />} />
        {/* 팀 정보 수정 페이지 */}
        <Route path="/team-edit/:id" element={<TeamInfoEdit />} />
        {/* 팀 전략 생성 페이지*/}
        <Route path="/team-strategy/:id" element={<GameStrategy />} />
        <Route path="/invite" element={<InvitePage />} />
        <Route path="/invite-pass/:invitecode" element={<InvitePassPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
