import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import ErrorBoundary from "./components/ErrorBoundary";
import { useViewportHeight } from "./hooks/useViewportHeight";
import { useCapacitor } from "./hooks/useCapacitor";
import { useAuthValidator } from "./hooks/useAuthValidator";
import AppRoutes from "./routes";
import BottomNavBar from "./components/Nevigation/BottomNavBar";
import { ToastContainer } from "./components/Toast/Toast";

/**
 * Global styles for mobile app layout.
 * Uses safe-area variables defined in index.css
 */
const GlobalStyle = createGlobalStyle`
  body, #root, .app-container {
    max-width: 600px;
    margin: auto;
    padding: 0;
    box-sizing: border-box;
    /* Safe area bottom padding for BottomNavBar */
    padding-bottom: calc(70px + var(--safe-area-bottom, 0px));
  }

  /* Apply safe area to all pages */
  .page-container {
    padding-top: var(--safe-area-top, 0px);
    padding-left: var(--safe-area-left, 0px);
    padding-right: var(--safe-area-right, 0px);
  }
`;

/**
 * 앱 시작 시 인증 상태를 검증하는 컴포넌트
 * BrowserRouter 내부에서 실행되어야 하므로 별도 컴포넌트로 분리
 */
const AuthValidator: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // 앱 시작 시 토큰 유효성 검증 및 만료 토큰 자동 정리
  useAuthValidator();
  return <>{children}</>;
};

/**
 * Root App component with all providers and global configurations.
 */
const App: React.FC = () => {
  // Initialize dynamic viewport height
  useViewportHeight();

  // Initialize Capacitor native features (push notifications, status bar, etc.)
  useCapacitor();

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthValidator>
          <GlobalStyle />
          <AppRoutes />
          <BottomNavBar />
          <ToastContainer />
        </AuthValidator>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
