// src/components/ProtectedRoute.tsx

import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // 방금 만든 커스텀 훅을 사용합니다.

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. 데이터 로딩이 끝났는지 확인합니다. (초기 로딩 중 리다이렉트 방지)
    // 2. 로그인이 되어있지 않다면, 경고창을 띄우고 로그인 페이지로 보냅니다.
    if (!isLoading && !isLoggedIn) {
      alert("로그인이 필요한 페이지입니다.");
      navigate("/login");
    }
  }, [isLoggedIn, isLoading, navigate]);

  // 로딩 중이거나, 리다이렉션이 발생하기 전에는 로딩 화면을 보여줍니다.
  if (isLoading || !isLoggedIn) {
    return <div>Loading...</div>; // 혹은 스피너 컴포넌트를 사용하세요.
  }

  // 로딩이 끝났고, 로그인도 되어 있다면 페이지 내용을 보여줍니다.
  return <>{children}</>;
};

export default ProtectedRoute;
