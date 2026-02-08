import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy loaded components for code splitting
const LoginPage = lazy(() => import("./screen/Auth/LoginPage"));
const SignUpPage = lazy(() => import("./screen/Auth/SignUpPage"));
const FindPasswordPage = lazy(() => import("./screen/Auth/FindPasswordPage"));
const FindPasswordPhonePage = lazy(
  () => import("./screen/Auth/FindPasswordPhonePage"),
);
const FindPasswordEmailPage = lazy(
  () => import("./screen/Auth/FindPasswordEmailPage"),
);
const SetNewPasswordPage = lazy(
  () => import("./screen/Auth/SetNewPasswordPage"),
);
const KakaoRedirectHandler = lazy(
  () => import("./screen/Auth/KakaoRedirectHandler"),
);
const GoogleRedirectHandler = lazy(
  () => import("./screen/Auth/GoogleRedirectHandler"),
);

const MainPage = lazy(() => import("./screen/My/Mainpage"));
const MyPage = lazy(() => import("./screen/My/Mypage"));
const ProfileEditPage = lazy(() => import("./screen/My/ProfileEditPage"));
const ChangePasswordPage = lazy(() => import("./screen/My/ChangePasswardPage"));
const JoinApprovalStatus = lazy(() => import("./screen/My/JoinApprovalSataus"));
const UnsubscribePage = lazy(() => import("./screen/My/UnsubscribePage"));
const TeamInfoEdit = lazy(() => import("./screen/My/TeamInfoEdit"));
const TeamOutPage = lazy(() => import("./screen/My/TeamOutPage"));
const PersonalCalendarPage = lazy(
  () => import("./screen/My/PersonalCalendarPage"),
);
const AlarmPage = lazy(() => import("./screen/My/AlarmPage"));

const TeamSelectListPage = lazy(
  () => import("./screen/Team/TeamSelectListPage"),
);
const TeamCreationPage = lazy(() => import("./screen/Team/TeamCreationPage"));
const TeamCreationIntroPage = lazy(
  () => import("./screen/Team/TeamCreationIntroPage"),
);
const TeamInforPage = lazy(() => import("./screen/Team/TeamInforPage"));
const TeamJoinPage = lazy(() => import("./screen/Team/TeamJoinPage"));
const TeamMemberListPage = lazy(
  () => import("./screen/Team/TeamMemberListPage"),
);
const TeamCalendarPage = lazy(() => import("./screen/Team/TeamCalendarPage"));

const TeamNoticePage = lazy(
  () => import("./screen/Team/Notice/TeamNoticePage"),
);
const TeamNoticeDetailPage = lazy(
  () => import("./screen/Team/Notice/TeamNoticeDetailPage"),
);
const TeamNoticeCreatePage = lazy(
  () => import("./screen/Team/Notice/TeamNoticeCreatePage"),
);
const TeamNoticeRewritePage = lazy(
  () => import("./screen/Team/Notice/TeamNoticeRewritePage"),
);

const MTeaminforpage = lazy(
  () => import("./screen/Team/Manager/MTeamInforPage"),
);
const MTeamMemberListPage = lazy(
  () => import("./screen/Team/Manager/MTeamMemberListPage"),
);
const MTeamMemberAdmission = lazy(
  () => import("./screen/Team/Manager/MTeamMemberAdmission"),
);
const MTMemberAdmissionDetail = lazy(
  () => import("./screen/Team/Manager/MTMemberAdmissionDetail"),
);
const GameStrategy = lazy(
  () => import("./screen/Team/Manager/GameStrategy/GameStrategy"),
);

const InvitePage = lazy(() => import("./screen/Invite/InvitePage"));

/**
 * Loading component for Suspense fallback
 */
const PageLoading: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(var(--vh, 1vh) * 100)",
      paddingTop: "var(--safe-area-top, 0px)",
      paddingBottom: "var(--safe-area-bottom, 0px)",
    }}
  >
    <div
      style={{
        width: 40,
        height: 40,
        border: "3px solid #e8e8e8",
        borderTopColor: "var(--color-main, #0e6244)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    />
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

/**
 * App Routes component with code splitting.
 * All page components are lazy-loaded for better performance.
 */
const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 인증 관련 라우트 */}
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

        {/* 초대코드 입력 */}
        <Route path="/invite" element={<InvitePage />} />

        {/* 팀 관리자 라우트 */}
        <Route
          path="/manager/:teamId/joinReview"
          element={<MTeamMemberAdmission />}
        />
        <Route
          path="/manager/:teamId/joinReview/:requestId"
          element={<MTMemberAdmissionDetail />}
        />
        <Route
          path="/manager/:teamId/team-strategy/:id"
          element={<GameStrategy />}
        />
        <Route path="/manager/:id" element={<MTeaminforpage />} />
        <Route
          path="/manager/:teamId/memberList"
          element={<MTeamMemberListPage />}
        />

        {/* 팀 관련 라우트 */}
        <Route path="/team/list/:teamId" element={<TeamInforPage />} />
        <Route path="/team/list/:teamId/join" element={<TeamJoinPage />} />
        <Route path="/team/create" element={<TeamCreationPage />} />
        <Route path="/team/intro" element={<TeamCreationIntroPage />} />
        <Route path="/team/list" element={<TeamSelectListPage />} />
        <Route path="/team/:teamId/member" element={<TeamMemberListPage />} />
        <Route path="/team/:teamId/notice" element={<TeamNoticePage />} />
        <Route
          path="/team/:teamId/notice/:noticeId"
          element={<TeamNoticeDetailPage />}
        />
        <Route
          path="/team/:teamId/notice/create"
          element={<TeamNoticeCreatePage />}
        />
        <Route
          path="/team/notice/rewrite/:id"
          element={<TeamNoticeRewritePage />}
        />
        <Route
          path="/team/:teamId/calendar"
          element={
            <ProtectedRoute>
              <TeamCalendarPage />
            </ProtectedRoute>
          }
        />
        <Route path="/out/:id" element={<TeamOutPage />} />

        {/* 마이페이지 라우트 */}
        <Route path="/myteam" element={<MainPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route
          path="/my/calendar"
          element={
            <ProtectedRoute>
              <PersonalCalendarPage />
            </ProtectedRoute>
          }
        />
        <Route path="/my/change-pw" element={<ChangePasswordPage />} />
        <Route path="/my/joinstatus" element={<JoinApprovalStatus />} />
        <Route
          path="/my/edit"
          element={
            <ProtectedRoute>
              <ProfileEditPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my/alarm"
          element={
            <ProtectedRoute>
              <AlarmPage />
            </ProtectedRoute>
          }
        />
        <Route path="/my/unsub" element={<UnsubscribePage />} />
        <Route path="/team-edit/:id" element={<TeamInfoEdit />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
