// src/hooks/useAuthValidator.ts

import { useEffect, useRef } from "react";
import axios from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  isTokenExpired,
  removeTokens,
} from "../utils/authUtils";
import { useUserStore } from "../stores/userStore";

/**
 * 리프레시 토큰으로 새로운 액세스 토큰을 발급받는 함수
 * @returns {Promise<boolean>} 성공 여부
 */
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    console.warn("[Auth Validator] 리프레시 토큰 없음");
    return false;
  }

  try {
    console.info("[Auth Validator] 액세스 토큰 갱신 시도...");
    const response = await axios.post("/api/sign/reissue", null, {
      params: {
        refreshToken: refreshToken,
      },
    });

    const newAccessToken = response.data.accessToken;
    const newRefreshToken = response.data.refreshToken;

    if (newAccessToken) {
      setAccessToken(newAccessToken);
      if (newRefreshToken) {
        setRefreshToken(newRefreshToken);
      }
      console.info("[Auth Validator] 액세스 토큰 갱신 성공!");
      return true;
    }

    return false;
  } catch (error) {
    console.error("[Auth Validator] 토큰 갱신 실패:", error);
    return false;
  }
}

/**
 * 앱 시작 시 토큰 유효성을 검증하고, 만료된 토큰을 자동으로 갱신/정리하는 훅입니다.
 *
 * 이 훅은 다음과 같은 상황을 처리합니다:
 * 1. 토큰이 없는 경우 → 게스트 상태 유지
 * 2. 액세스 토큰 만료 + 리프레시 토큰 유효 → 즉시 토큰 갱신 (자동 로그인 유지)
 * 3. 액세스 토큰 만료 + 리프레시 토큰도 만료 → 강제 로그아웃
 * 4. 개발용 토큰(dev-)은 검증을 건너뜀
 *
 * @example
 * ```tsx
 * // App.tsx에서 사용
 * const App: React.FC = () => {
 *   useAuthValidator();
 *   // ...
 * };
 * ```
 */
export const useAuthValidator = (): void => {
  const hasValidated = useRef(false);
  const clearUserData = useUserStore((state) => state.clearUserData);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const user = useUserStore((state) => state.user);
  const fetchUserData = useUserStore((state) => state.fetchUserData);

  useEffect(() => {
    // 중복 실행 방지
    if (hasValidated.current) return;
    hasValidated.current = true;

    const validateAuth = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      // 토큰이 없으면 검증할 필요 없음
      if (!accessToken && !refreshToken) {
        // 토큰은 없는데 로그인 상태면 상태 초기화
        if (isLoggedIn) {
          console.warn("[Auth Validator] 토큰 없음, 상태 초기화");
          clearUserData();
        }
        return;
      }

      // 개발용 토큰은 검증 건너뜀
      if (accessToken?.startsWith("dev-") || refreshToken?.startsWith("dev-")) {
        console.info("[Auth Validator] 개발용 토큰 감지 - 검증 스킵");
        return;
      }

      // 액세스 토큰이 만료된 경우
      if (accessToken && isTokenExpired(accessToken)) {
        console.warn("[Auth Validator] 액세스 토큰 만료됨");

        // 리프레시 토큰도 만료되었거나 없으면 완전 로그아웃
        if (!refreshToken || isTokenExpired(refreshToken)) {
          console.warn(
            "[Auth Validator] 리프레시 토큰도 만료됨 - 강제 로그아웃",
          );
          removeTokens();
          clearUserData();
          return;
        }

        // 리프레시 토큰이 유효하면 즉시 토큰 갱신 시도
        const refreshSuccess = await refreshAccessToken();

        if (!refreshSuccess) {
          console.warn("[Auth Validator] 토큰 갱신 실패 - 강제 로그아웃");
          removeTokens();
          clearUserData();
          return;
        }

        // 갱신 성공 후 사용자 데이터 재로드
        // (isLoggedIn은 이전 상태를 반영하므로, 토큰 갱신 후에도 로그인 상태로 간주)
        if (isLoggedIn && !user) {
          console.info("[Auth Validator] 사용자 데이터 재로드");
          try {
            await fetchUserData();
          } catch (error) {
            console.error("[Auth Validator] 사용자 데이터 로드 실패:", error);
            // 데이터 로드 실패 시에도 로그아웃 처리
            removeTokens();
            clearUserData();
          }
        }
        return; // 토큰 갱신 및 처리 완료
      }

      // 토큰은 유효한데 사용자 정보가 없으면 데이터 재로드
      if (accessToken && !isTokenExpired(accessToken) && isLoggedIn && !user) {
        console.info("[Auth Validator] 사용자 데이터 재로드");
        try {
          await fetchUserData();
        } catch (error) {
          console.error("[Auth Validator] 사용자 데이터 로드 실패:", error);
          removeTokens();
          clearUserData();
        }
      }
    };

    validateAuth();
  }, [clearUserData, isLoggedIn, user, fetchUserData]);
};
