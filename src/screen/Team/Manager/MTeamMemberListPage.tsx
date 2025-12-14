import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  HiMagnifyingGlass,
  HiEllipsisVertical,
  HiUser,
  HiShieldCheck,
  HiShieldExclamation,
} from "react-icons/hi2";
import Header2 from "../../../components/Header/Header2/Header2";
import FilterBar from "../../../components/Filter/FilterBar";
import apiClient from "../../../api/apiClient";
import { getAccessToken } from "../../../utils/authUtils";

interface Player {
  teamMemberId: number;
  name: string;
  position: string;
  profileUrl?: string;
  role: "MANAGER" | "SUB_MANAGER" | "MEMBER";
}

const DEV_MOCK_PLAYERS: Player[] = [
  {
    teamMemberId: 1,
    name: "손흥민",
    position: "ST",
    role: "MANAGER",
    profileUrl: "",
  },
  {
    teamMemberId: 2,
    name: "이강인",
    position: "MF",
    role: "MEMBER",
    profileUrl: "",
  },
  {
    teamMemberId: 3,
    name: "김민재",
    position: "CB",
    role: "SUB_MANAGER",
    profileUrl: "",
  },
  {
    teamMemberId: 4,
    name: "황희찬",
    position: "LW",
    role: "MEMBER",
    profileUrl: "",
  },
  {
    teamMemberId: 5,
    name: "조현우",
    position: "GK",
    role: "MEMBER",
    profileUrl: "",
  },
];

const MTeamMemberListPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [positionFilter, setPositionFilter] = useState<string | null>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const closeMenu = () => setActiveMenuId(null);
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    const token = getAccessToken();

    if (token?.startsWith("dev-")) {
      await new Promise((r) => setTimeout(r, 600));
      setPlayers(DEV_MOCK_PLAYERS);
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.get<Player[]>(
        `/api/team/${teamId}/memberList`,
        {
          headers: { "X-AUTH-TOKEN": token },
        }
      );
      setPlayers(res.data);
    } catch (error) {
      console.error("Failed to fetch players:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const handleRoleChange = async (
    memberId: number,
    newRole: "MANAGER" | "SUB_MANAGER" | "MEMBER"
  ) => {
    if (!window.confirm("권한을 변경하시겠습니까?")) return;

    const token = getAccessToken();
    try {
      if (token?.startsWith("dev-")) {
        setPlayers((prev) =>
          prev.map((p) =>
            p.teamMemberId === memberId ? { ...p, role: newRole } : p
          )
        );
        alert("권한이 변경되었습니다 (Dev Mode)");
        return;
      }

      // API mapping based on role
      if (newRole === "MANAGER") {
        await apiClient.put(`/api/admin/team/grantManagerRole`, null, {
          params: { teamMemberId: memberId },
          headers: { "X-AUTH-TOKEN": token },
        });
      } else if (newRole === "SUB_MANAGER") {
        await apiClient.put(`/api/admin/team/updateSubManagerRole`, null, {
          params: { teamMemberId: memberId, grant: true },
          headers: { "X-AUTH-TOKEN": token },
        });
      } else {
        // Demote from Sub Manager
        await apiClient.put(`/api/admin/team/updateSubManagerRole`, null, {
          params: { teamMemberId: memberId, grant: false },
          headers: { "X-AUTH-TOKEN": token },
        });
      }

      alert("권한이 변경되었습니다.");
      fetchPlayers(); // Refresh list
    } catch (error) {
      console.error("Role update failed", error);
      alert("권한 변경 실패");
    }
  };

  // Position grouping logic (Standardized to match /team/1/member)
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
        return ["CB", "LB", "RB", "DF"].includes(p);
      case "골키퍼":
        return ["GK"].includes(p);
      default:
        return false;
    }
  };

  const filteredPlayers = players.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPosition = matchesPositionCategory(p.position, positionFilter);

    return matchesSearch && matchesPosition;
  });

  return (
    <PageWrapper>
      <Header2 text="선수 관리" />

      <Container>
        <SearchSection>
          <SearchInputWrapper>
            <HiMagnifyingGlass color="#999" size={20} />
            <SearchInput
              placeholder="이름 또는 포지션 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchInputWrapper>
        </SearchSection>

        {/* Restore FilterBar */}
        <FilterBar
          onFilterChange={(val) =>
            setPositionFilter(val === "전체" ? null : val)
          }
        />
        <div style={{ height: 16 }} />

        <ListHeader>
          <MemberCount>총 {filteredPlayers.length}명</MemberCount>
        </ListHeader>

        {loading ? (
          <EmptyState>선수 목록을 불러오는 중...</EmptyState>
        ) : filteredPlayers.length > 0 ? (
          <PlayerList>
            {filteredPlayers.map((player) => (
              <PlayerCard key={player.teamMemberId}>
                <UserInfo>
                  <Avatar src={player.profileUrl || ""} />
                  <TextInfo>
                    <NameRow>
                      <Name>{player.name}</Name>
                      <RoleBadge role={player.role}>
                        {getRoleLabel(player.role)}
                      </RoleBadge>
                    </NameRow>
                    <Position>{player.position}</Position>
                  </TextInfo>
                </UserInfo>

                <ActionMenuWrapper
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(
                      activeMenuId === player.teamMemberId
                        ? null
                        : player.teamMemberId
                    );
                  }}
                >
                  <MenuButton>
                    <HiEllipsisVertical size={20} />
                  </MenuButton>
                  {activeMenuId === player.teamMemberId && (
                    <DropdownMenu>
                      <MenuItem
                        onClick={() =>
                          handleRoleChange(player.teamMemberId, "MANAGER")
                        }
                      >
                        <HiShieldCheck /> 매니저 위임
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleRoleChange(player.teamMemberId, "SUB_MANAGER")
                        }
                      >
                        <HiShieldExclamation /> 부매니저 임명
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleRoleChange(player.teamMemberId, "MEMBER")
                        }
                      >
                        <HiUser /> 일반 멤버로 변경
                      </MenuItem>
                    </DropdownMenu>
                  )}
                </ActionMenuWrapper>
              </PlayerCard>
            ))}
          </PlayerList>
        ) : (
          <EmptyState>검색된 선수가 없습니다.</EmptyState>
        )}
      </Container>
    </PageWrapper>
  );
};

// Helper
const getRoleLabel = (role: string) => {
  if (role === "MANAGER") return "매니저";
  if (role === "SUB_MANAGER") return "부매니저";
  return "멤버";
};

export default MTeamMemberListPage;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafb;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
`;

const Container = styled.div`
  padding: 20px;
  flex: 1;
`;

const SearchSection = styled.div`
  margin-bottom: 24px;
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

const PlayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PlayerCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
  position: relative;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const Avatar = styled.div<{ src: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: #eee;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
`;

const TextInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const NameRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Name = styled.span`
  font-size: 16px;
  font-family: "Pretendard-Bold";
  color: #333;
`;

const RoleBadge = styled.span<{ role: string }>`
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;

  ${(props) =>
    props.role === "MANAGER" &&
    `
    background: #fff3bf; color: #f08c00;
  `}
  ${(props) =>
    props.role === "SUB_MANAGER" &&
    `
    background: #e7f5ff; color: #1c7ed6;
  `}
  ${(props) =>
    props.role === "MEMBER" &&
    `
    background: #f1f3f5; color: #868e96;
  `}
`;

const Position = styled.span`
  font-size: 13px;
  color: #888;
`;

const ActionMenuWrapper = styled.div`
  position: relative;
`;

const MenuButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #aaa;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #333;
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #eee;
  width: 160px;
  z-index: 10;
  overflow: hidden;
  padding: 4px;
`;

const MenuItem = styled.button`
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  background: none;
  border: none;
  font-size: 13px;
  color: #444;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background: #f8f9fa;
  }

  svg {
    font-size: 16px;
    color: #888;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
`;
