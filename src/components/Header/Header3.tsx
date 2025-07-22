// Header.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { FaChevronDown, FaChevronUp, FaStar } from "react-icons/fa6";
import HorizontalLine from "../Styled/HorizontalLine";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  selectedTeam: { teamId: number; teamName: string };
  teams: {
    teamImageUrl: any;
    teamId: number;
    teamName: string;
  }[];
  onTeamChange: (teamId: number, teamName: string) => void;
  favoriteTeams: number[]; // 즐겨찾기된 팀 목록
  onToggleFavorite: (teamId: number, teamName: string) => void; // 즐겨찾기 토글 함수
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: center; /* 가운데 정렬 */
  height: 44px;
  background-color: white;
  position: relative;
`;

const TeamNameWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TeamName = styled.h1`
  font-size: 18px;
`;

const DropdownButton = styled.button`
  margin-left: 8px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
`;

const ModalBackground = styled.div<{ isOpen: boolean }>`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  //background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  position: absolute;
  top: 40px;
  left: 50%;

  transform: translate(-50%, 0);
  background-color: white;
  padding: 5px;
  border-radius: 8px;
`;

const TeamList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TeamListItem = styled.li<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 250px;
  padding: 5px;
  cursor: pointer;
  background-color: ${(props) =>
    props.isSelected ? "#E7F0ED" : "transparent"};
  border-radius: 8px;
  &:hover {
    background-color: ${(props) => (props.isSelected ? "#E7F0ED" : "#f1f3f5")};
    border-radius: 8px;
  }
`;

const StarIcon = styled.span<{ isFavorite: boolean }>`
  font-size: 18px;
  color: ${(props) =>
    props.isFavorite ? "var(--color-sub)" : "var(--color-dark1)"};
  cursor: pointer;
`;

const TeamNameText = styled.span`
  font-size: 16px;
  font-family: "Pretendard-Bold";
`;

const LeftItems = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const RightItem = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const NavButton = styled.button`
  background: white;
  border: 1px solid var(--color-sub);
  border-radius: 6px;
  width: 80px;
  height: 24px;
  cursor: pointer;
  font-size: 13px;
  &:first-child {
    margin-bottom: 5px;
  }
`;

const TeamProfileImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
`;
const Header3: React.FC<HeaderProps> = ({
  selectedTeam,
  teams,
  onTeamChange,
  favoriteTeams,
  onToggleFavorite,
}) => {
  //const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleTeamSelect = (teamId: number, teamName: string) => {
    onTeamChange(teamId, teamName);
    setIsModalOpen(false);
  };

  const isFavorite = (teamId: number) => favoriteTeams.includes(teamId);

  return (
    <>
      <HeaderContainer>
        <TeamNameWrapper>
          <StarIcon
            style={{ marginRight: "5px" }}
            isFavorite={isFavorite(selectedTeam.teamId)}
          >
            {isFavorite(selectedTeam.teamId) ? <FaStar /> : <FaStar />}
          </StarIcon>
          <TeamName>{selectedTeam.teamName}</TeamName>
          <DropdownButton onClick={toggleModal}>
            {isModalOpen ? <FaChevronUp /> : <FaChevronDown />}
          </DropdownButton>
          <HorizontalLine />
        </TeamNameWrapper>
      </HeaderContainer>

      <ModalBackground isOpen={isModalOpen} onClick={toggleModal}>
        <ModalContent
          className="border-df shadow-df"
          onClick={(e) => e.stopPropagation()}
        >
          <TeamList>
            {teams.map((team) => (
              <TeamListItem
                key={team.teamId}
                isSelected={team.teamName === selectedTeam.teamName}
                onClick={() => handleTeamSelect(team.teamId, team.teamName)}
              >
                <LeftItems>
                  <StarIcon
                    isFavorite={isFavorite(team.teamId)}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(team.teamId, team.teamName);
                    }}
                  >
                    {isFavorite(team.teamId) ? <FaStar /> : <FaStar />}
                  </StarIcon>
                  <TeamProfileImg src={team.teamImageUrl} />
                  <RightItem>
                    <TeamNameText>{team.teamName}</TeamNameText>
                  </RightItem>
                </LeftItems>
                <RightItem>
                  <NavButton
                    className="border-df shadow-df"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 공지사항으로 이동하는 로직 구현
                      navigate(`/team/${team.teamId}/notice`);
                    }}
                  >
                    공지사항
                  </NavButton>
                  <NavButton
                    className="border-df shadow-df"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 팀 달력으로 이동하는 로직 구현
                      navigate(`/team/${team.teamId}/calendar`);
                    }}
                  >
                    팀 달력
                  </NavButton>
                </RightItem>
              </TeamListItem>
            ))}
          </TeamList>
        </ModalContent>
      </ModalBackground>
    </>
  );
};

export default Header3;
