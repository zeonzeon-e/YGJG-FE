import React, { Component, ErrorInfo, ReactNode } from "react";
import styled from "styled-components";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Global Error Boundary component.
 * Catches JavaScript errors anywhere in the child component tree
 * and displays a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });
    // TODO: Log error to monitoring service (e.g., Sentry)
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleRefresh = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <ErrorContainer>
          <ErrorIcon>⚠️</ErrorIcon>
          <ErrorTitle>문제가 발생했습니다</ErrorTitle>
          <ErrorMessage>
            앱에서 예기치 않은 오류가 발생했습니다.
            <br />
            잠시 후 다시 시도해주세요.
          </ErrorMessage>
          <ButtonGroup>
            <RetryButton onClick={this.handleRetry}>다시 시도</RetryButton>
            <RefreshButton onClick={this.handleRefresh}>새로고침</RefreshButton>
          </ButtonGroup>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <ErrorDetails>
              <summary>개발자 정보</summary>
              <pre>
                {this.state.error.toString()}
                {"\n\n"}
                {this.state.errorInfo?.componentStack}
              </pre>
            </ErrorDetails>
          )}
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

/* Styled Components */
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(var(--vh, 1vh) * 100);
  padding: 24px;
  padding-top: calc(24px + var(--safe-area-top, 0px));
  padding-bottom: calc(24px + var(--safe-area-bottom, 0px));
  background: #f5f7fa;
  text-align: center;
`;

const ErrorIcon = styled.div`
  font-size: 64px;
  margin-bottom: 16px;
`;

const ErrorTitle = styled.h1`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2, #333);
  margin: 0 0 12px 0;
`;

const ErrorMessage = styled.p`
  font-size: 14px;
  color: var(--color-dark1, #797979);
  line-height: 1.6;
  margin: 0 0 24px 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const RetryButton = styled.button`
  padding: 12px 24px;
  font-size: 15px;
  font-family: "Pretendard-SemiBold";
  color: white;
  background: var(--color-main, #0e6244);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const RefreshButton = styled.button`
  padding: 12px 24px;
  font-size: 15px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2, #333);
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }
`;

const ErrorDetails = styled.details`
  margin-top: 24px;
  width: 100%;
  max-width: 400px;
  text-align: left;

  summary {
    cursor: pointer;
    color: var(--color-dark1, #797979);
    font-size: 13px;
    margin-bottom: 8px;
  }

  pre {
    background: #1e1e1e;
    color: #f8f8f8;
    padding: 12px;
    border-radius: 8px;
    font-size: 11px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
  }
`;
