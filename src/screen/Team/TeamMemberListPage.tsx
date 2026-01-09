import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { HiMagnifyingGlass, HiUsers } from "react-icons/hi2";
import apiClient from "../../api/apiClient";
import { getAccessToken } from "../../utils/authUtils";
import Header2 from "../../components/Header/Header2/Header2";
import FilterBar from "../../components/Filter/FilterBar";

// --- Types ---
interface Player {
  teamMemberId: number;
  name: string;
  position: string;
  profileUrl?: string;
  role?: string;
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
];

const TeamMemberListPage: React.FC = () => {
  const { teamId } = useParams();
  const numericTeamId = Number(teamId);

  // States
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericTeamId]);

  const fetchPlayers = async () => {
    if (!numericTeamId) return;
    setLoading(true);

    const token = getAccessToken();
    try {
      if (token?.startsWith("dev-")) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setPlayers(DEV_MOCK_PLAYERS);
        setLoading(false);
        return;
      }

      const response = await apiClient.get<Player[]>(
        `/api/team/${numericTeamId}/memberList`,
        { params: { sort: "최신 가입순" }, headers: { "X-AUTH-TOKEN": token } }
      );
      setPlayers(response.data);
    } catch (error) {
      console.error("Failed to fetch players:", error);
    } finally {
      setLoading(false);
    }
  };

  // Position grouping logic (Standardized)
  const matchesPositionCategory = (
    playerPos: string,
    filterCategory: string | null
  ) => {
    if (!filterCategory || filterCategory === "전체") return true;

    const p = playerPos.toUpperCase();
    switch (filterCategory) {
      case "공격수":
        return ["ST", "CF", "LW", "RW", "SS", "FW"].includes(p);
      case "미드필더":
        return ["CM", "CAM", "CDM", "LM", "RM", "MF"].includes(p);
      case "수비수":
        return ["CB", "LB", "RB", "DF","WD"].includes(p);
      case "골키퍼":
        return ["GK"].includes(p);
      default:
        return false;
    }
  };

  const filteredPlayers = players.filter((p) => {
    const matchesSearch = p.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPosition = matchesPositionCategory(p.position, positionFilter);
    return matchesSearch && matchesPosition;
  });

  const getRoleBadge = (role?: string) => {
    if (role === "ROLE_MANAGER") return <RoleBadge type="manager">운영진</RoleBadge>;
    if (role === "ROLE_SUBMANAGER") return <RoleBadge type="sub">매니저</RoleBadge>;
    return null;
  };

  const getColorByPosition = (pos: string): string => {
    const position = pos.toUpperCase();
    if (["ST", "CF", "LW", "RW", "SS", "FW"].includes(position))
      return "#ff383b"; // var(--color-error)
    if (["CM", "CAM", "CDM", "LM", "RM", "MF"].includes(position))
      return "#06c270"; // var(--color-success)
    if (["CB", "LB", "RB", "DF", "WD"].includes(position)) return "#0063f7"; // var(--color-info)
    if (position === "GK") return "#ffcc00"; // var(--color-warning)
    return "#95a5a6";
  };

  return (
    <PageWrapper>
      <Header2 text="팀 멤버" />

      <Container>
        {/* Search */}
        <SearchSection>
          <SearchInputWrapper>
            <HiMagnifyingGlass color="#999" size={20} />
            <SearchInput
              placeholder="멤버 이름 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInputWrapper>
        </SearchSection>

        {/* FilterBar */}
        <FilterBar
          onFilterChange={(val) =>
            setPositionFilter(val === "전체" ? null : val)
          }
        />
        <div style={{ height: 16 }} />

        <ListHeader>
          <MemberCount>총 {filteredPlayers.length}명</MemberCount>
        </ListHeader>

        {/* List */}
        <MemberList>
          {loading ? (
            <LoadingState>멤버 정보를 불러오는 중...</LoadingState>
          ) : filteredPlayers.length > 0 ? (
            filteredPlayers.map((player) => (
              <MemberCard key={player.teamMemberId}>
                <MemberAvatar src={player.profileUrl} />
                <MemberInfo>
                  <NameRow>
                    <Name>{player.name}</Name>
                    {getRoleBadge(player.role)}
                  </NameRow>
                  <MemberMeta>
                    <PositionBox color={getColorByPosition(player.position)}>
                      {player.position}
                    </PositionBox>
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
              <p>검색된 멤버가 없습니다.</p>
            </EmptyState>
          )}
        </MemberList>
      </Container>
    </PageWrapper>
  );
};

export default TeamMemberListPage;

/* ========== Styled Components ========== */
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f8fafb;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
`;

const Container = styled.div`
  padding: 20px;
  flex: 1;
`;

const SearchSection = styled.div`
  margin-bottom: 20px;
`;

const SearchInputWrapper = styled.div`
  background: white;
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #eee;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  font-size: 15px;
  width: 100%;
  &::placeholder {
    color: #ccc;
  }
`;

const ListHeader = styled.div`
  margin-bottom: 12px;
`;

const MemberCount = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #555;
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
  border: 1px solid #f0f0f0;
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
`;

const MemberInfo = styled.div`
  flex: 1;
`;

const NameRow = styled.div`
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
