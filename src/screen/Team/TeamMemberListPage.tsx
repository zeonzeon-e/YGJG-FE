import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  HiMagnifyingGlass,
  HiUserCircle,
  HiChevronLeft,
  HiFunnel,
  HiUsers,
} from "react-icons/hi2";
import apiClient from "../../api/apiClient";
import { getAccessToken } from "../../utils/authUtils";

// --- Types ---
// API 명세서와 동일하게 구조 수정
interface Player {
  teamMemberId: number; // API: teamMemberId
  name: string;
  position: string;
  profileUrl?: string;
  role?: string; // API: string (MANAGER | SUB_MANAGER | MEMBER)
  // joinDate는 API 명세에 없음 -> UI 표시용으로 임의 추가하거나 제거
  // 여기서는 API 구조를 엄격히 따르기 위해 선택적 속성으로 유지하되, 실제 API 연동 시엔 없을 수 있음을 감안
  joinDate?: string;
}

// --- Dev Mock Data ---
const DEV_MOCK_PLAYERS: Player[] = [
  {
    teamMemberId: 1,
    name: "박지성",
    position: "MF",
    role: "MANAGER",
    joinDate: "2023-01-01",
  },
  {
    teamMemberId: 2,
    name: "손흥민",
    position: "FW",
    role: "MEMBER",
    joinDate: "2023-02-15",
  },
  {
    teamMemberId: 3,
    name: "김민재",
    position: "DF",
    role: "MEMBER",
    joinDate: "2023-03-10",
  },
  {
    teamMemberId: 4,
    name: "이강인",
    position: "MF",
    role: "SUB_MANAGER",
    joinDate: "2023-04-05",
  },
  {
    teamMemberId: 5,
    name: "조현우",
    position: "GK",
    role: "MEMBER",
    joinDate: "2023-05-20",
  },
  {
    teamMemberId: 6,
    name: "황희찬",
    position: "FW",
    role: "MEMBER",
    joinDate: "2023-06-12",
  },
  {
    teamMemberId: 7,
    name: "황인범",
    position: "MF",
    role: "MEMBER",
    joinDate: "2023-07-08",
  },
  {
    teamMemberId: 8,
    name: "이재성",
    position: "MF",
    role: "MEMBER",
    joinDate: "2023-08-01",
  },
  {
    teamMemberId: 9,
    name: "김영권",
    position: "DF",
    role: "MEMBER",
    joinDate: "2023-09-14",
  },
  {
    teamMemberId: 10,
    name: "김문환",
    position: "DF",
    role: "MEMBER",
    joinDate: "2023-10-09",
  },
  {
    teamMemberId: 11,
    name: "정우영",
    position: "MF",
    role: "MEMBER",
    joinDate: "2023-11-22",
  },
];

const TeamMemberListPage: React.FC = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const numericTeamId = Number(teamId);

  // States
  const [allPlayers, setAllPlayers] = useState<Player[]>([]);
  const [displayedPlayers, setDisplayedPlayers] = useState<Player[]>([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [positionFilter, setPositionFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);

  // 무한 스크롤 관련 (간소화)
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    fetchPlayers();
  }, [numericTeamId]);

  // 필터링 및 검색 로직
  useEffect(() => {
    let result = allPlayers;

    // 포지션 필터
    if (positionFilter !== "ALL") {
      if (positionFilter === "FW") {
        result = result.filter((p) =>
          ["ST", "CF", "LW", "RW", "SS", "FW"].includes(
            p.position.toUpperCase()
          )
        );
      } else if (positionFilter === "MF") {
        result = result.filter((p) =>
          ["CM", "CAM", "CDM", "LM", "RM", "MF"].includes(
            p.position.toUpperCase()
          )
        );
      } else if (positionFilter === "DF") {
        result = result.filter((p) =>
          ["CB", "LB", "RB", "DF"].includes(p.position.toUpperCase())
        );
      } else if (positionFilter === "GK") {
        result = result.filter((p) => p.position.toUpperCase() === "GK");
      }
    }

    // 검색어 필터
    if (searchKeyword) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    setDisplayedPlayers(result);
  }, [allPlayers, positionFilter, searchKeyword]);

  const fetchPlayers = async () => {
    if (!numericTeamId) return;
    setLoading(true);

    try {
      // 🔧 개발 모드 체크
      const token = getAccessToken();
      if (token?.startsWith("dev-")) {
        console.warn("[DEV MODE] Using mock data for Team Members");
        await new Promise((resolve) => setTimeout(resolve, 500));
        setAllPlayers(DEV_MOCK_PLAYERS);
        setLoading(false);
        return;
      }

      const response = await apiClient.get<Player[]>(
        `/api/team/${numericTeamId}/memberList`,
        {
          params: { sort: "최신 가입순" },
        }
      );
      setAllPlayers(response.data);
    } catch (error) {
      console.error("Failed to fetch players:", error);
    } finally {
      setLoading(false);
    }
  };

  const getColorByPosition = (pos: string): string => {
    const position = pos.toUpperCase();
    if (["ST", "CF", "LW", "RW", "SS", "FW"].includes(position))
      return "var(--color-error)";
    if (["CM", "CAM", "CDM", "LM", "RM", "MF"].includes(position))
      return "var(--color-success)";
    if (["CB", "LB", "RB", "DF"].includes(position)) return "var(--color-info)";
    if (position === "GK") return "var(--color-warning)";
    return "#95a5a6";
  };

  const getRoleBadge = (role?: string) => {
    if (role === "MANAGER") return <RoleBadge type="manager">운영진</RoleBadge>;
    if (role === "SUB_MANAGER") return <RoleBadge type="sub">매니저</RoleBadge>;
    return null;
  };

  // 상세 프로필 이동 (현재 라우트 없음 -> 추후 구현 or 모달)
  const handleMemberClick = (memberId: number) => {
    // navigate(`/user/${memberId}`); // 🚧 아직 프로필 상세 페이지가 없음
    alert("선수 상세 프로필 기능은 준비 중입니다! 🚧");
  };

  return (
    <PageWrapper>
      {/* 헤더 */}
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <HiChevronLeft size={24} />
        </BackButton>
        <HeaderTitle>팀 멤버</HeaderTitle>
        <div style={{ width: 24 }} /> {/* 레이아웃 균형용 */}
      </Header>

      <ContentContainer>
        {/* 상단 통계 카드 */}
        <StatsCard>
          <StatsItem>
            <StatsLabel>총 인원</StatsLabel>
            <StatsValue>{allPlayers.length}명</StatsValue>
          </StatsItem>
          <StatsDivider />
          <StatsItem>
            <StatsLabel>이번 달 신규</StatsLabel>
            <StatsValue new>+2명</StatsValue>
          </StatsItem>
        </StatsCard>

        {/* 검색 및 필터 */}
        <SearchFilterSection>
          <SearchWrapper>
            <HiMagnifyingGlass color="#999" size={18} />
            <SearchInput
              placeholder="이름으로 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </SearchWrapper>

          <FilterScroll>
            {["ALL", "FW", "MF", "DF", "GK"].map((pos) => (
              <FilterChip
                key={pos}
                active={positionFilter === pos}
                onClick={() => setPositionFilter(pos)}
              >
                {pos === "ALL" ? "전체" : pos}
              </FilterChip>
            ))}
          </FilterScroll>
        </SearchFilterSection>

        {/* 멤버 리스트 */}
        <MemberList>
          {loading ? (
            <LoadingState>멤버 정보를 불러오는 중...</LoadingState>
          ) : displayedPlayers.length > 0 ? (
            displayedPlayers.map((player) => (
              <MemberCard
                key={player.teamMemberId}
                onClick={() => handleMemberClick(player.teamMemberId)}
              >
                <MemberAvatar src={player.profileUrl} />
                <MemberInfo>
                  <MemberNameRow>
                    <Name>{player.name}</Name>
                    {getRoleBadge(player.role)}
                  </MemberNameRow>
                  <MemberMeta>
                    <PositionBox color={getColorByPosition(player.position)}>
                      {player.position}
                    </PositionBox>
                    {/* joinDate는 API에 없으므로 데이터 있을 때만 표시 */}
                    {player.joinDate && (
                      <JoinDate>{player.joinDate} 가입</JoinDate>
                    )}
                  </MemberMeta>
                </MemberInfo>
              </MemberCard>
            ))
          ) : (
            <EmptyState>
              <HiUsers size={40} color="#ddd" />
              <p>검색 결과가 없습니다.</p>
            </EmptyState>
          )}
        </MemberList>
      </ContentContainer>
    </PageWrapper>
  );
};

export default TeamMemberListPage;

/* ========== Styled Components ========== */
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f8fafb;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #f0f0f0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  color: var(--color-dark2);
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
`;

const ContentContainer = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const StatsCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
`;

const StatsItem = styled.div`
  flex: 1;
  text-align: center;
`;

const StatsLabel = styled.div`
  font-size: 13px;
  color: var(--color-dark1);
  margin-bottom: 4px;
`;

const StatsValue = styled.div<{ new?: boolean }>`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  color: ${(props) => (props.new ? "var(--color-main)" : "var(--color-dark2)")};
`;

const StatsDivider = styled.div`
  width: 1px;
  height: 40px;
  background: #f0f0f0;
`;

const SearchFilterSection = styled.div`
  margin-bottom: 20px;
`;

const SearchWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  border: 1px solid #eee;

  &:focus-within {
    border-color: var(--color-main);
    box-shadow: 0 0 0 3px rgba(14, 98, 68, 0.1);
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  font-size: 15px;

  &::placeholder {
    color: #bbb;
  }
`;

const FilterScroll = styled.div`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterChip = styled.button<{ active: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-family: "Pretendard-SemiBold";
  border: 1px solid ${(props) => (props.active ? "var(--color-main)" : "#eee")};
  background: ${(props) => (props.active ? "var(--color-main)" : "white")};
  color: ${(props) => (props.active ? "white" : "var(--color-dark1)")};
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const MemberCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const MemberAvatar = styled.div<{ src?: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f0f0;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;

  ${(props) =>
    !props.src &&
    `
    display: flex;
    align-items: center;
    justify-content: center;
    &::after {
      content: "👤";
      font-size: 24px;
      color: #ccc;
    }
  `}
`;

const MemberInfo = styled.div`
  flex: 1;
`;

const MemberNameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
`;

const Name = styled.span`
  font-size: 16px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
`;

const RoleBadge = styled.span<{ type: "manager" | "sub" }>`
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: ${(props) => (props.type === "manager" ? "#fff0f0" : "#f0f7ff")};
  color: ${(props) =>
    props.type === "manager" ? "var(--color-error)" : "var(--color-info)"};
  font-weight: 600;
`;

const MemberMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const PositionBox = styled.span<{ color: string }>`
  font-size: 12px;
  font-family: "Pretendard-Bold";
  color: ${(props) => props.color};
  background-color: ${(props) => props.color}15;
  padding: 2px 8px;
  border-radius: 6px;
`;

const JoinDate = styled.span`
  font-size: 12px;
  color: #aaa;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 12px;

  p {
    color: #bbb;
    font-size: 14px;
  }
`;
