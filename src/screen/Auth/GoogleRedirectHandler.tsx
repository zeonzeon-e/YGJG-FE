import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";
import { setAccessToken, setRefreshToken } from "../../utils/authUtils";
import apiClient from "../../api/apiClient";

const GoogleRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  console.log(1);

  useEffect(() => {
    const fetchToken = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        try {
          const accessToken = code;
          const response: AxiosResponse<{
            token: string;
            refreshToken: string;
            newUser: boolean;
          }> = await apiClient.post("/auth/google/signin", { accessToken });

          // const { token, refreshToken, isNewUser, userData } = response.data;
          const { token, refreshToken, newUser } = response.data;

          if (newUser) {
            // 신규 사용자이면 회원가입 페이지로 이동
            // const socialData = encodeURIComponent(JSON.stringify(userData));
            navigate(`/signup?socialData=${newUser}`);
          } else {
            // 기존 사용자이면 토큰 저장 후 메인 페이지로 이동
            if (token && refreshToken) {
              setAccessToken(token);
              setRefreshToken(refreshToken);
              navigate("/my"); // 메인 페이지로 이동
            } else {
              console.error("토큰이 정의되지 않음");
              navigate(`/signup?socialData=${newUser}`);
            }
          }
        } catch (error) {
          console.error("구글 로그인 처리 중 오류 발생:", error);
          navigate("/login"); // 로그인 페이지로 이동
        }
      } else {
        console.error("인증 코드가 없습니다.");
        navigate("/login"); // 로그인 페이지로 이동
      }
    };

    fetchToken();
  }, [navigate]);

  return <div>구글 로그인 중...</div>;
};

export default GoogleRedirectHandler;
