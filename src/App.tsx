import React from "react";
import { BrowserRouter } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import ErrorBoundary from "./components/ErrorBoundary";
import { useViewportHeight } from "./hooks/useViewportHeight";
import { useCapacitor } from "./hooks/useCapacitor";
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
        <GlobalStyle />
        <AppRoutes />
        <BottomNavBar />
        <ToastContainer />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
