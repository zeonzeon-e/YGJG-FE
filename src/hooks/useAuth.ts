// src/hooks/useAuth.ts

import { useNavigate } from "react-router-dom";
import { setAccessToken, setRefreshToken } from "../utils/authUtils"; // authUtils 임포트
import { useUserStore } from "../stores/userStore";

/**
 * 인증 및 사용자 정보 관련 상태와 액션을 제공하는 커스텀 훅입니다.
 */
export const useAuth = () => {
  const navigate = useNavigate();

  // useUserStore에서 모든 상태와 액션을 가져옵니다.
  const {
    isLoggedIn,
    user,
    teams,
    isLoading,
    fetchUserData,
    clearUserData,
    getRoleByTeamId,
  } = useUserStore();

  /**
   * 로그인 성공 후의 모든 공통 처리를 담당하는 함수
   * @param token - 서버로부터 받은 accessToken
   * @param refreshToken - 서버로부터 받은 refreshToken
   */
  const handleLoginSuccess = async (token: string, refreshToken: string) => {
    try {
      // 1. 토큰을 localStorage(또는 다른 저장소)에 저장합니다.
      setAccessToken(token);
      setRefreshToken(refreshToken);

      // 2. Zustand 스토어에 사용자 정보를 요청하고 저장합니다.
      // 이 함수는 내부에 로딩 상태 관리 로직이 이미 포함되어 있습니다.
      await fetchUserData();

      // 3. 모든 정보가 준비되면 메인 페이지로 이동시킵니다.
      navigate("/myteam"); // 혹은 '/my' 등 원하는 랜딩 페이지로 설정
    } catch (error) {
      console.error("로그인 후 처리 중 에러 발생:", error);
      // 혹시 사용자 정보 로드에 실패하면 로그인 페이지로 다시 보내고 에러를 알립니다.
      alert("사용자 정보를 불러오는 데 실패했습니다. 다시 로그인해주세요.");
      navigate("/login");
    }
  };

  // 컴포넌트에서 더 직관적으로 사용할 수 있도록 객체로 묶어 반환합니다.
  // 예를 들어, fetchUserData는 'login'이라는 이름으로 제공하여 가독성을 높일 수 있습니다.
  return {
    // 상태 (State)
    isLoggedIn, // 로그인 여부 (true/false)
    user, // 로그인한 사용자 정보 객체
    teams, // 소속된 팀 정보 배열
    isLoading, // 사용자 정보 로딩 여부

    // 액션 (Actions)
    login: fetchUserData, // 로그인(사용자 정보 불러오기) 함수
    logout: clearUserData, // 로그아웃 함수

    // 헬퍼 함수 (Helpers)
    getRoleByTeamId, // 팀 ID로 역할 정보를 가져오는 함수
    handleLoginSuccess,
  };
};
