import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  HiMagnifyingGlass,
  HiEllipsisVertical,
  HiUser,
  HiShieldCheck,
  HiShieldExclamation,
  HiUsers,
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
  role: "ROLE_MANAGER" | "ROLE_SUBMANAGER" | "ROLE_MEMBER";
}

const DEV_MOCK_PLAYERS: Player[] = [
  {
    teamMemberId: 1,
    name: "손흥민",
    position: "ST",
    role: "ROLE_MANAGER",
    profileUrl: "",
  },
  {
    teamMemberId: 2,
    name: "이강인",
    position: "MF",
    role: "ROLE_MEMBER",
    profileUrl: "",
  },
  {
    teamMemberId: 3,
    name: "김민재",
    position: "CB",
    role: "ROLE_MEMBER",
    profileUrl: "",
  },
  {
    teamMemberId: 4,
    name: "황희찬",
    position: "LW",
    role: "ROLE_MEMBER",
    profileUrl: "",
  },
  {
    teamMemberId: 5,
    name: "조현우",
    position: "GK",
    role: "ROLE_MEMBER",
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
    newRole: "ROLE_MANAGER" | "ROLE_SUBMANAGER" | "ROLE_MEMBER"
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
      if (newRole === "ROLE_MANAGER") {
        await apiClient.put(`/api/admin/team/grantManagerRole`, null, {
          params: { teamMemberId: memberId },
          headers: { "X-AUTH-TOKEN": token },
        });
      } else if (newRole === "ROLE_SUBMANAGER") {
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

  // Position grouping logic
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
        return ["CB", "LB", "RB", "DF", "WD"].includes(p);
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

  const getRoleLabel = (role: string) => {
    if (role === "ROLE_MANAGER") return "운영진";
    if (role === "ROLE_SUBMANAGER") return "매니저";
    return "멤버";
  };

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
          <LoadingState>선수 목록을 불러오는 중...</LoadingState>
        ) : filteredPlayers.length > 0 ? (
          <PlayerList>
            {filteredPlayers.map((player) => (
              <PlayerCard key={player.teamMemberId}>
                <Avatar src={player.profileUrl || ""} />
                <UserInfo>
                  <NameRow>
                    <Name>{player.name}</Name>
                    {player.role !== "ROLE_MEMBER" && (
                      <RoleBadge $role={player.role}>
                        {getRoleLabel(player.role)}
                      </RoleBadge>
                    )}
                  </NameRow>
                  <MemberMeta>
                    <PositionBox color={getColorByPosition(player.position)}>
                      {player.position}
                    </PositionBox>
                  </MemberMeta>
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
                          handleRoleChange(player.teamMemberId, "ROLE_MANAGER")
                        }
                      >
                        <HiShieldCheck /> 운영진 위임
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleRoleChange(player.teamMemberId, "ROLE_SUBMANAGER")
                        }
                      >
                        <HiShieldExclamation /> 매니저 임명
                      </MenuItem>
                      <MenuItem
                        onClick={() =>
                          handleRoleChange(player.teamMemberId, "ROLE_MEMBER")
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
          <EmptyState>
            <HiUsers size={40} color="#ddd" />
            <p>검색된 선수가 없습니다.</p>
          </EmptyState>
        )}
      </Container>
    </PageWrapper>
  );
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

const PlayerList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const PlayerCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
  position: relative;
`;

const Avatar = styled.div<{ src: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #f0f0f0;
  background-image: url(${(props) => props.src});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
`;

const UserInfo = styled.div`
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

const RoleBadge = styled.span<{ $role: string }>`
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;

  ${(props) =>
    (props.$role === "ROLE_MANAGER" || props.$role === "MANAGER") &&
    `
    background: #fff0f0; color: var(--color-error);
  `}
  ${(props) =>
    (props.$role === "ROLE_SUBMANAGER" ||
      props.$role === "SUB_MANAGER" ||
      props.$role === "ROLE_SUB_MANAGER") &&
    `
    background: #f0f7ff; color: var(--color-info);
  `}
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