import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AxiosResponse } from "axios";
import apiClient from "../../api/apiClient";
import { useAuth } from "../../hooks/useAuth";

const KakaoRedirectHandler: React.FC = () => {
  const navigate = useNavigate();
  const { handleLoginSuccess } = useAuth(); // 훅에서 공통 로그인 성공 처리 함수를 가져옵니다.

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

          if (newUser) {
            // 신규 사용자라면 추가 정보 입력을 위해 회원가입 페이지로 이동
            alert("신규 회원입니다. 추가 정보를 입력해주세요.");
            navigate(`/signup?socialData=${newUser}`);
          } else {
            // 기존 사용자라면 공통 핸들러를 호출하여 로그인 처리를 완료합니다.
            if (token && refreshToken) {
              await handleLoginSuccess(token, refreshToken);
            } else {
              // 토큰이 없는 예외적인 경우
              console.error("서버로부터 토큰을 받지 못했습니다.");
              alert("로그인에 실패했습니다. 다시 시도해주세요.");
              navigate("/login");
            }
          }
        } catch (error) {
          console.error("카카오 로그인 처리 중 오류 발생:", error);
          alert("로그인에 실패했습니다. 다시 시도해주세요.");
          navigate("/login"); // 에러 발생 시 로그인 페이지로 이동
        }
      } else {
        console.error("카카오 인증 코드가 없습니다.");
        alert("인증에 실패했습니다. 다시 시도해주세요.");
        navigate("/login"); // 인증 코드가 없을 경우 로그인 페이지로 이동
      }
    };

    fetchToken();
  }, [navigate, handleLoginSuccess]);

  return <div>카카오 로그인 중...</div>;
};

export default KakaoRedirectHandler;
