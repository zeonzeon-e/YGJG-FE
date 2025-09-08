// src/stores/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import apiClient from "../api/apiClient";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
  profileImageUrl?: string;
}

export interface TeamRole {
  teamId: number;
  teamName: string;
  role: "MANAGER" | "SUB_MANAGER" | "MEMBER";
  position: "FW" | "MF" | "DF" | "GK";
}

interface UserState {
  isLoggedIn: boolean;
  user: UserProfile | null;
  teams: TeamRole[];
  isLoading: boolean;
  error: string | null;
}

interface UserActions {
  fetchUserData: () => Promise<void>;
  clearUserData: () => void;
  getRoleByTeamId: (teamId: number) => TeamRole | undefined;
}

// 2. create 함수를 persist 함수로 감싸줍니다.
export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      // 초기 상태
      isLoggedIn: false,
      user: null,
      teams: [],
      isLoading: false,
      error: null,

      // 액션: API 호출하여 모든 사용자 데이터를 가져옴
      fetchUserData: async () => {
        set({ isLoading: true, error: null });
        try {
          // 백엔드와 협의된 API 엔드포인트
          const response = await apiClient.get<
            Omit<UserState, "isLoading" | "error">
          >("/api/me");
          // API 응답 전체를 상태에 저장
          set({ ...response.data, isLoading: false });
        } catch (err) {
          console.error("사용자 정보 조회 실패:", err);
          // 실패 시에는 로그인 상태가 아닌 것으로 간주하고 상태를 초기화
          set({
            isLoggedIn: false,
            user: null,
            teams: [],
            error: "사용자 정보를 불러오는 데 실패했습니다.",
            isLoading: false,
          });
        }
      },

      // 액션: 로그아웃 시 모든 데이터를 초기화
      clearUserData: () => {
        set({ isLoggedIn: false, user: null, teams: [], error: null });
      },

      // 헬퍼 함수
      getRoleByTeamId: (teamId: number) => {
        const { teams } = get();
        return teams.find((team) => team.teamId === teamId);
      },
    }),
    {
      // 3. persist 설정 객체
      name: "user-auth-storage", // localStorage에 저장될 때 사용될 key 이름입니다.
      storage: createJSONStorage(() => localStorage), // 사용할 스토리지 종류를 지정합니다. (localStorage, sessionStorage 등)
    }
  )
);
