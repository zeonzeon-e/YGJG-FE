import React, { useState } from "react";
import styled from "styled-components";
import Header3 from "../../components/Header/Header3";

const TeamInfoPage: React.FC = () => {
  const [currentTeam, setCurrentTeam] = useState("팀 A");
  const teams = ["팀 A", "팀 B", "팀 C"];
  const [favoriteTeams, setFavoriteTeams] = useState<string[]>(["팀 B"]);

  const handleTeamChange = (team: string) => {
    setCurrentTeam(team);
    console.log(`현재 선택된 팀: ${team}`);
  };

  const handleToggleFavorite = (team: string) => {
    setFavoriteTeams((prevFavorites) => {
      if (prevFavorites.includes(team)) {
        return prevFavorites.filter((favTeam) => favTeam !== team);
      } else {
        return [...prevFavorites, team];
      }
    });
  };
  return (
    <Container>
      <Header3
        teamName={currentTeam}
        teams={teams}
        onTeamChange={handleTeamChange}
        favoriteTeams={favoriteTeams}
        onToggleFavorite={handleToggleFavorite}
      />
    </Container>
  );
};

export default TeamInfoPage;

// Styled Components
const Container = styled.div`
  margin: auto;
`;
