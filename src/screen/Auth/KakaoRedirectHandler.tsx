import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";
import { setAccessToken, setRefreshToken } from "../../utils/authUtils";
import apiClient from "../../api/apiClient";

const KakaoRedirectHandler: React.FC = () => {
  const navigate = useNavigate();

  // 한 번이라도 요청이 되었는지 추적할 ref
  const isFetchingRef = useRef<boolean>(false);

  useEffect(() => {
    const fetchToken = async () => {
      // 이미 API 요청을 진행했다면, 다시 실행하지 않도록 가드
      if (isFetchingRef.current) {
        return;
      }
      // 첫 실행 시점에 true로 설정
      isFetchingRef.current = true;

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");

      if (code) {
        try {
          // code를 accessToken으로 간주해 서버에 전송
          const accessToken = code;
          const response: AxiosResponse<{
            token: string;
            refreshToken: string;
            newUser: boolean;
          }> = await apiClient.post("/auth/kakao/signin", { accessToken });

          const { token, refreshToken, newUser } = response.data;
          console.log(response);
          if (newUser) {
            // 신규 사용자라면 회원가입 페이지로 이동
            //navigate(`/signup?socialData=${newUser}`);
          } else {
            // 기존 사용자라면 토큰 저장 후 메인 페이지로 이동
            if (token && refreshToken) {
              setAccessToken(token);
              setRefreshToken(refreshToken);
              navigate("/my");
            } else {
              // 토큰이 없다면 회원가입 페이지로 이동(에러 상황 처리)
              // navigate(`/signup?socialData=${newUser}`);
            }
          }
        } catch (error) {
          console.error("카카오 로그인 처리 중 오류 발생:", error);
          navigate("/login"); // 로그인 페이지로 이동
        }
      } else {
        console.error("인증 코드가 없습니다.");
        navigate("/login"); // 로그인 페이지로 이동
      }
    };

    fetchToken();
  }, [navigate]);

  return <div>카카오 로그인 중...</div>;
};

export default KakaoRedirectHandler;
