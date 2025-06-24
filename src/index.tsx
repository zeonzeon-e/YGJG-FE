import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./screen/Auth/LoginPage";
import FindPasswordPage from "./screen/Auth/FindPasswordPage";
import FindPasswordPhonePage from "./screen/Auth/FindPasswordPhonePage";
import MyPage from "./screen/My/Mypage";
import TeamInfoEdit from "./screen/My/TeamInfoEdit";
import GameStrategy from "./screen/Team/Manager/GameStrategy/GameStrategy";
import PersonalCalenderPage from "./screen/My/PersonalCalendarPage";
import JoinApprovalStatus from "./screen/My/JoinApprovalSataus";
import { createGlobalStyle } from "styled-components";
import TeamMemberListPage from "./screen/Team/TeamMemberListPage";
import SignUpPage from "./screen/Auth/SignUpPage";
import IntroPage from "./screen/IntroPage";
import InvitePage from "./screen/Invite/InvitePage";
import KakaoRedirectHandler from "./screen/Auth/KakaoRedirectHandler";
import GoogleRedirectHandler from "./screen/Auth/GoogleRedirectHandler";
import TeamCreationPage from "./screen/Team/TeamCreationPage";
import TeamCreationIntroPage from "./screen/Team/TeamCreationIntroPage";
import TeamSelectListPage from "./screen/Team/TeamSelectListPage";
import TeamInforPage from "./screen/Team/TeamInforPage";
import TeamNoticePage from "./screen/Team/Notice/TeamNoticePage";
import TeamNoticeDetailPage from "./screen/Team/Notice/TeamNoticeDetailPage";
import TeamNoticeCreatePage from "./screen/Team/Notice/TeamNoticeCreatePage";
import TeamOutPage from "./screen/My/TeamOutPage";
import TeamNoticeRewritePage from "./screen/Team/Notice/TeamNoticeRewritePage";
import CalendarPage from "./screen/Team/Calendar/CalendarPage";
import ProfileEditPage from "./screen/My/ProfileEditPage";
import UnsubscribePage from "./screen/My/UnsubscribePage";
import MTeaminforpage from "./screen/Team/Manager/MTeamInforPage";
import MainPage from "./screen/My/Mainpage";
import AdminJoinReviewPage from "./screen/Team/Manager/AdminJoinReviewPage";
import ChangePasswordPage from "./screen/My/ChangePasswardPage";
import FindPasswordEmailPage from "./screen/Auth/FindPasswordEmailPage";
import SetNewPasswordPage from "./screen/Auth/SetNewPasswordPage";
import TeamJoinPage from "./screen/Team/TeamJoinPage";
import AdminJoinListPage from "./screen/Team/Manager/AdminJoinListPage";

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

        {/* 로그인 페이지 */}
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/kakao/callback" element={<KakaoRedirectHandler />} />
        <Route
          path="/auth/google/callback"
          element={<GoogleRedirectHandler />}
        />
        <Route path="/login/find-pw" element={<FindPasswordPage />} />
        <Route
          path="/login/find-pw/phone"
          element={<FindPasswordPhonePage />}
        />
        <Route
          path="/login/find-pw/email"
          element={<FindPasswordEmailPage />}
        />
        <Route
          path="/login/find-pw/set-new-password"
          element={<SetNewPasswordPage />}
        />

        {/* 팀 관련 페이지 */}
        {/* 초대코드 입력 페이지 */}
        <Route path="/invite" element={<InvitePage />} />
        {/* [관리자]팀 가입 신청서 열람람 페이지 @@@@@팀ID & 유저ID로 식별 기능 추가할 것 */}
        <Route
          path="/manager/:teamId/joinReview"
          element={<AdminJoinListPage />}
        />
        <Route
          path="/manager/:teamId/joinReview/:requestId"
          element={<AdminJoinReviewPage />}
        />
        {/* 팀 선택 목록에서 들어가면 보이는 팀 상세 페이지(가입하기 전) */}
        <Route path="/team/list/:teamId" element={<TeamInforPage />} />
        {/* 팀 가입 페이지 */}
        <Route path="/team/list/:teamId/join" element={<TeamJoinPage />} />
        {/* 팀 생성 페이지 */}
        <Route path="/team/create" element={<TeamCreationPage />} />
        {/* 팀 생성 안내 페이지 */}
        <Route path="/team/intro" element={<TeamCreationIntroPage />} />
        {/* 팀 선택 목록 페이지 */}
        <Route path="/team/list" element={<TeamSelectListPage />} />
        {/* 팀 선수목록 페이지 */}
        <Route path="/team/:teamId/member" element={<TeamMemberListPage />} />
        {/* 게시판 목록 페이지 */}
        <Route path="/team/notice" element={<TeamNoticePage />} />
        {/* 게시판 글 페이지 */}
        <Route
          path="/team/notice/:noticeId"
          element={<TeamNoticeDetailPage />}
        />
        {/* 팀 탈퇴 사유 작성 페이지 */}
        <Route path="/out/:id" element={<TeamOutPage />} />

        {/* 팀 매너지 관련 페이지 */}
        {/* 경기전략 페이지 */}
        <Route path="/team-strategy/:id" element={<GameStrategy />} />
        {/* 게시판 추가 페이지 */}
        <Route path="/team/notice/create" element={<TeamNoticeCreatePage />} />
        {/* 게시판 수정 페이지 */}
        <Route
          path="/team/notice/rewrite/:id"
          element={<TeamNoticeRewritePage />}
        />
        {/* 본인이 관리자인 팀 페이지 */}
        <Route path="/manager/:id" element={<MTeaminforpage />} />

        {/* 마이페이지 */}
        {/* 메인페이지(가입한 팀 정보 있음) */}
        <Route path="/myteam" element={<MainPage />} />
        {/* 마이페이지 */}
        <Route path="/my" element={<MyPage />} />
        {/* 개인 캘린더 */}
        <Route path="/my/calendar" element={<PersonalCalenderPage />} />
        {/* 비밀번호 변경 */}
        <Route path="/my/change-pw" element={<ChangePasswordPage />} />
        {/* 가입 승인 현황 (대기, 승인, 탈락) */}
        <Route path="/my/joinstatus" element={<JoinApprovalStatus />} />
        {/* 본인 프로필 수정 */}
        <Route path="/my/edit" element={<ProfileEditPage />} />

        {/* 서비스 탈퇴 안내 페이지 */}
        <Route path="/my/unsub" element={<UnsubscribePage />} />
        {/* 팀 색상, 팀 내 희망 포지션 변경 */}
        <Route path="/team-edit/:id" element={<TeamInfoEdit />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
