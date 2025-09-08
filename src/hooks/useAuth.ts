// src/hooks/useAuth.ts

import { useUserStore } from "../stores/userStore";

/**
 * 인증 및 사용자 정보 관련 상태와 액션을 제공하는 커스텀 훅입니다.
 */
export const useAuth = () => {
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
  };
};
