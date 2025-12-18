import React, { useState } from "react";
import styled from "styled-components";
import {
  HiChevronDown,
  HiChevronUp,
  HiStar,
  HiOutlineStar,
  HiMegaphone,
  HiCalendar,
  HiCheck,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  selectedTeam: { teamId: number; teamName: string } | null;
  teams: { teamId: number; teamName: string }[];
  onTeamChange: (teamId: number, teamName: string) => void;
  favoriteTeams: number[];
  onToggleFavorite: (teamId: number, teamName: string) => void;
}

const HeaderContainer = styled.header`
  height: 56px;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  position: sticky;
  top: 0;
  z-index: 200;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 16px;
`;

const TeamSelectorButton = styled.button`
  background: none;
  border: none;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 17px;
  font-family: "Pretendard-Bold";
  color: #333;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: #f8f9fa;
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #666;
`;

// 드롭다운 오버레이 (헤더 아래 전체 화면)
const ModalOverlay = styled.div`
  position: fixed;
  top: 56px; // 헤더 높이만큼 아래에서 시작
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 199;
  backdrop-filter: blur(2px);
  animation: fadeIn 0.2s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const DropdownMenu = styled.div`
  position: fixed;
  top: 60px; // 헤더 바로 아래보다 약간 띄움
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 32px); // 좌우 여백
  max-width: 400px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  z-index: 201;
  overflow: hidden;
  border: 1px solid #eee;
  animation: slideDown 0.2s ease-out;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translate(-50%, -10px);
    }
    to {
      opacity: 1;
      transform: translate(-50%, 0);
    }
  }
`;

const TeamList = styled.ul`
  list-style: none;
  padding: 8px;
  margin: 0;
  max-height: 400px;
  overflow-y: auto;
`;

const TeamListItem = styled.li<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  background-color: ${(props) =>
    props.isSelected ? "#effaf5" : "transparent"};
  transition: background-color 0.2s;
  margin-bottom: 4px;

  &:hover {
    background-color: ${(props) => (props.isSelected ? "#effaf5" : "#f8f9fa")};
  }
`;

const LeftArea = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
  min-width: 0;
`;

const FavoriteButton = styled.button<{ isFavorite: boolean }>`
  border: none;
  background: none;
  padding: 4px;
  display: flex;
  align-items: center;
  font-size: 20px;
  color: ${(props) => (props.isFavorite ? "#FFC107" : "#ddd")};
  cursor: pointer;
  transition: transform 0.1s;

  &:active {
    transform: scale(0.9);
  }
`;

const TeamNameText = styled.span<{ isSelected: boolean }>`
  font-size: 16px;
  font-weight: ${(props) => (props.isSelected ? "600" : "400")};
  color: ${(props) => (props.isSelected ? "var(--color-main)" : "#333")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RightArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #eee;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--color-main);
    color: white;
    border-color: var(--color-main);
  }
`;

const Header3: React.FC<HeaderProps> = ({
  selectedTeam,
  teams,
  onTeamChange,
  favoriteTeams,
  onToggleFavorite,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const toggleModal = () => setIsModalOpen((prev) => !prev);
  const closeModal = () => setIsModalOpen(false);

  const handleTeamSelect = (teamId: number, teamName: string) => {
    onTeamChange(teamId, teamName);
    closeModal();
  };

  const isFavorite = (teamId: number) => favoriteTeams.includes(teamId);

  // 선택된 팀이 없을 때
  if (!selectedTeam) {
    return (
      <HeaderContainer>
        <TeamSelectorButton onClick={toggleModal}>
          팀 선택{" "}
          <IconWrapper>
            <HiChevronDown />
          </IconWrapper>
        </TeamSelectorButton>
      </HeaderContainer>
    );
  }

  return (
    <>
      <HeaderContainer>
        <TeamSelectorButton onClick={toggleModal}>
          {selectedTeam.teamName}
          <IconWrapper>
            {isModalOpen ? <HiChevronUp /> : <HiChevronDown />}
          </IconWrapper>
        </TeamSelectorButton>
      </HeaderContainer>

      {isModalOpen && (
        <>
          <ModalOverlay onClick={closeModal} />
          <DropdownMenu onClick={(e) => e.stopPropagation()}>
            <TeamList>
              {teams.map((team) => (
                <TeamListItem
                  key={team.teamId}
                  isSelected={team.teamName === selectedTeam.teamName}
                  onClick={() => handleTeamSelect(team.teamId, team.teamName)}
                >
                  <LeftArea>
                    <FavoriteButton
                      isFavorite={isFavorite(team.teamId)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(team.teamId, team.teamName);
                      }}
                    >
                      {isFavorite(team.teamId) ? <HiStar /> : <HiOutlineStar />}
                    </FavoriteButton>
                    <TeamNameText
                      isSelected={team.teamName === selectedTeam.teamName}
                    >
                      {team.teamName}
                    </TeamNameText>
                    {team.teamName === selectedTeam.teamName && (
                      <HiCheck color="var(--color-main)" size={16} />
                    )}
                  </LeftArea>

                  <RightArea>
                    <ActionButton
                      title="공지사항"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/team/${team.teamId}/notice`);
                      }}
                    >
                      <HiMegaphone size={16} />
                    </ActionButton>
                    <ActionButton
                      title="팀 달력"
                      onClick={(e) => {
                        e.stopPropagation();
                        // navigate(`/team/${team.teamId}/schedule`); // 추후 구현
                        alert("일정 기능은 준비 중입니다!");
                      }}
                    >
                      <HiCalendar size={16} />
                    </ActionButton>
                  </RightArea>
                </TeamListItem>
              ))}
            </TeamList>
          </DropdownMenu>
        </>
      )}
    </>
  );
};

export default Header3;