// src/stores/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import apiClient from "../api/apiClient";

// API 명세에 따른 응답 타입을 정확하게 정의합니다.
// 이렇게 하면 TypeScript의 타입 검사 이점을 최대한 활용할 수 있습니다.
interface MemberResponseDto {
  memberId: number;
  name: string;
  email: string;
  gender: "MALE" | "FEMALE";
  birthDate: string;
  profileUrl?: string;
  // 기타 필드들은 필요에 따라 추가
  address?: string;
  addressDetail?: string;
  age?: number;
  create_At?: string;
  hasExperience?: boolean;
  level?: string;
  loginMethod?: string;
  phoneNum?: string;
  update_At?: string;
}

interface MyPageTeamResponseDto {
  teamId: number;
  teamName: string;
  role: "MANAGER" | "SUB_MANAGER" | "MEMBER";
  position: "FW" | "MF" | "DF" | "GK";
  teamColor: string;
  teamImageUrl: string;
  favoriteTeam: boolean;
}

interface AllUserInfoResponse {
  memberResponseDto: MemberResponseDto;
  myPageTeamResponseDtoList: MyPageTeamResponseDto[];
}

// 스토어 상태에 사용될 인터페이스 정의
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
  teamColor: string;
  teamImageUrl: string;
  favoriteTeam: boolean;
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

// create 함수를 persist 미들웨어로 감싸서 로컬 스토리지에 상태를 저장합니다.
export const useUserStore = create<UserState & UserActions>()(
  persist(
    (set, get) => ({
      // 초기 상태
      isLoggedIn: false,
      user: null,
      teams: [],
      isLoading: false,
      error: null,

      // 액션: API 호출하여 모든 사용자 데이터를 가져오는 함수
      fetchUserData: async () => {
        // 데이터 로딩 시작, 에러 상태 초기화
        set({ isLoading: true, error: null });
        try {
          // 1. API 명세에 정의된 엔드포인트와 응답 타입을 사용하여 데이터 요청
          const response = await apiClient.get<AllUserInfoResponse>(
            "/api/member/all-info"
          );

          // 2. 응답 데이터에서 회원 정보와 팀 정보를 추출
          const { memberResponseDto, myPageTeamResponseDtoList } =
            response.data;

          // 3. 추출한 회원 정보를 스토어의 `UserProfile` 상태 구조에 맞게 매핑
          const userProfile: UserProfile = {
            id: memberResponseDto.memberId,
            name: memberResponseDto.name,
            email: memberResponseDto.email,
            gender: memberResponseDto.gender,
            birthDate: memberResponseDto.birthDate,
            profileImageUrl: memberResponseDto.profileUrl,
          };

          // 4. 추출한 팀 정보를 스토어의 `TeamRole` 상태 구조에 맞게 매핑
          const teamRoles: TeamRole[] = myPageTeamResponseDtoList.map(
            (team) => ({
              teamId: team.teamId,
              teamName: team.teamName,
              role: team.role,
              position: team.position,
              teamColor: team.teamColor,
              teamImageUrl: team.teamImageUrl,
              favoriteTeam: team.favoriteTeam, // <-- 이 부분을 추가합니다.
            })
          );

          // 5. 모든 상태를 업데이트합니다. API 호출 성공 시 로그인 상태를 true로 설정
          set({
            isLoggedIn: true,
            user: userProfile,
            teams: teamRoles,
            isLoading: false,
            error: null,
          });
        } catch (err) {
          console.error("사용자 정보 조회 실패:", err);
          // API 호출 실패 시 로그인 상태를 false로 설정하고 상태 초기화
          set({
            isLoggedIn: false,
            user: null,
            teams: [],
            error: "사용자 정보를 불러오는 데 실패했습니다.",
            isLoading: false,
          });
        }
      },

      // 액션: 로그아웃 시 모든 데이터를 초기화하는 함수
      clearUserData: () => {
        set({ isLoggedIn: false, user: null, teams: [], error: null });
      },

      // 헬퍼 함수: 특정 팀 ID로 팀 역할을 찾는 함수
      getRoleByTeamId: (teamId: number) => {
        const { teams } = get();
        return teams.find((team) => team.teamId === teamId);
      },
    }),
    {
      // persist 설정 객체
      name: "user-auth-storage", // 로컬 스토리지에 저장될 때 사용될 키 이름
      storage: createJSONStorage(() => localStorage), // 사용할 스토리지 종류 지정
    }
  )
);
