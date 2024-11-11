// src/screen/Auth/GoogleRedirectHandler.tsx

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";
import { setAccessToken, setRefreshToken } from "../../utils/authUtils";
import apiClient from "../../api/apiClient";

const GoogleRedirectHandler: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchToken = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        try {
          const response: AxiosResponse<{
            token?: string;
            refreshToken?: string;
            isNewUser: boolean;
            userData?: any;
          }> = await apiClient.get(`/auth/google/callback?code=${code}`);

          const { token, refreshToken, isNewUser, userData } = response.data;

          if (isNewUser) {
            // 신규 사용자이면 회원가입 페이지로 이동
            const socialData = encodeURIComponent(JSON.stringify(userData));
            navigate(`/signup?socialData=${socialData}`);
          } else {
            // 기존 사용자이면 토큰 저장 후 메인 페이지로 이동
            if (token && refreshToken) {
              setAccessToken(token);
              setRefreshToken(refreshToken);
              navigate("/"); // 메인 페이지로 이동
            } else {
              navigate("/login"); // 로그인 페이지로 이동
            }
          }
        } catch (error) {
          console.error("구글 로그인 처리 중 오류 발생:", error);
          navigate("/login"); // 로그인 페이지로 이동
        }
      } else {
        navigate("/login"); // 로그인 페이지로 이동
      }
    };

    fetchToken();
  }, [navigate]);

  return <div>구글 로그인 중...</div>;
};

export default GoogleRedirectHandler;
