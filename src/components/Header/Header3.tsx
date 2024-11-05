// Header.tsx
import React, { useState } from "react";
import styled from "styled-components";
import { FaChevronDown, FaStar } from "react-icons/fa6";

interface HeaderProps {
  teamName: string;
  teams: string[];
  onTeamChange: (team: string) => void;
  favoriteTeams: string[]; // 즐겨찾기된 팀 목록
  onToggleFavorite: (team: string) => void; // 즐겨찾기 토글 함수
}

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: center; /* 가운데 정렬 */
  height: 60px;
  background-color: #f8f9fa;
  position: relative;
`;

const TeamNameWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const TeamName = styled.h1`
  font-size: 24px;
  margin: 0;
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
  background-color: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, 0);
  background-color: #fff;
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
  width: 180px;
  padding: 10px;
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
  font-size: 24px;
  color: ${(props) =>
    props.isFavorite ? "var(--color-sub)" : "var(--color-dark1)"};
  cursor: pointer;
`;

const TeamNameText = styled.span`
  font-size: 18px;
`;

const RightItem = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const NavButton = styled.button`
  background: white;
  border: none;
  border: 1px solid var(--color-sub);
  border-radius: 8px;
  margin: 5px;
  width: 80px;
  height: 30px;
  cursor: pointer;
  font-size: 16px;
`;

const Header: React.FC<HeaderProps> = ({
  teamName,
  teams,
  onTeamChange,
  favoriteTeams,
  onToggleFavorite,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleTeamSelect = (team: string) => {
    onTeamChange(team);
    setIsModalOpen(false);
  };

  const isFavorite = (team: string) => favoriteTeams.includes(team);

  return (
    <>
      <HeaderContainer>
        <TeamNameWrapper>
          <TeamName>{teamName}</TeamName>
          <DropdownButton onClick={toggleModal}>
            <FaChevronDown />
          </DropdownButton>
        </TeamNameWrapper>
      </HeaderContainer>

      <ModalBackground isOpen={isModalOpen} onClick={toggleModal}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <TeamList>
            {teams.map((team) => (
              <TeamListItem
                key={team}
                isSelected={team === teamName}
                onClick={() => handleTeamSelect(team)}
              >
                <StarIcon
                  isFavorite={isFavorite(team)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(team);
                  }}
                >
                  {isFavorite(team) ? <FaStar /> : <FaStar />}
                </StarIcon>
                <TeamNameText>{team}</TeamNameText>
                <RightItem>
                  <NavButton
                    className="border-df shadow-df"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 공지사항으로 이동하는 로직 구현
                      console.log(`${team}의 공지사항으로 이동`);
                    }}
                  >
                    공지사항
                  </NavButton>
                  <NavButton
                    className="border-df shadow-df"
                    onClick={(e) => {
                      e.stopPropagation();
                      // 팀 달력으로 이동하는 로직 구현
                      console.log(`${team}의 팀 달력으로 이동`);
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

export default Header;
