import React from "react";
import styled from "styled-components";

const playersData = [
  {
    id: 1,
    name: "이지현",
    position: "공격수",
    detail_position: "ST",
    profileImageUrl: "https://example.com/player1.jpg"
  },
  {
    id: 2,
    name: "이지현",
    position: "수비수",
    detail_position: "WD",
    profileImageUrl: "https://example.com/player2.jpg"
  },
  {
    id: 3,
    name: "최민석",
    position: "수비수",
    detail_position: "WD",
    profileImageUrl: "https://example.com/player2.jpg"
  },
  {
    id: 4,
    name: "김유성",
    position: "미드필더",
    detail_position: "MF",
    profileImageUrl: "https://example.com/player2.jpg"
  },
  {
    id: 5,
    name: "김민기",
    position: "골키퍼",
    detail_position: "GK",
    profileImageUrl: "https://example.com/player2.jpg"
  }
];

// 포지션별 우선순위 지정
const positionPriority: { [key: string]: number } = {
  "공격수": 1,
  "수비수": 2,
  "미드필더": 3,
  "골키퍼": 4
};

// 포지션별 색상 가져오기
const getColorByPosition = (position: string): string => {
  switch (position) {
    case "공격수": return "var(--color-sk)";
    case "수비수": return "var(--color-dp)";
    case "미드필더": return "var(--color-mf)";
    case "골키퍼": return "var(--color-gk)";
    default: return "#9E9E9E";
  }
};

interface TeamList1Props {
    onPlayerSelect: (player: { detail_position: string; name: string }) => void;
  }

const TeamList1: React.FC<TeamList1Props> = ({ onPlayerSelect }) => {
  // 포지션에 따라 그룹화 및 정렬
  const positionGroups = playersData.reduce((acc, player) => {
    acc[player.position] = acc[player.position] || [];
    acc[player.position].push(player);
    return acc;
  }, {} as { [key: string]: typeof playersData });

  // 포지션 정렬
  const sortedPositions = Object.keys(positionGroups).sort(
    (a, b) => positionPriority[a] - positionPriority[b]
  );

  return (
    <PageContainer>
      {sortedPositions.map(position => (
        <React.Fragment key={position}>
          <PositionHeader color={getColorByPosition(position)}>
            {position}
          </PositionHeader>
          <PlayerListContainer>
            {positionGroups[position].map(player => (
              <PlayerItem key={player.id} onClick={() => onPlayerSelect({ detail_position: player.detail_position, name: player.name })}>
                <PlayerInfo>
                  <PlayerImage src={player.profileImageUrl} alt={player.name} />
                  <PlayerName>{player.name} - {player.detail_position}</PlayerName>
                </PlayerInfo>
              </PlayerItem>
            ))}
          </PlayerListContainer>
        </React.Fragment>
      ))}
    </PageContainer>
  );
};

export default TeamList1;

// Styled Components
const PageContainer = styled.div`
`;

const PositionHeader = styled.div<{ color: string }>`
  font-size: 18px;
  font-weight: bold;
  color: white;
  background-color: ${({ color }) => color};
  padding: 8px;
  border-radius: 50px;
  text-align: center;
  &:first-child {
    margin-top: 10px;
  }
`;

const PlayerListContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
`;

const PlayerItem = styled.div`
  display: flex;
  align-items: center;
  padding:10px;
  border-bottom: 1px solid #ddd;
  &:last-child {
    border-bottom: none;
  }
`;

const PlayerInfo = styled.div`
  display: flex;
  align-items: center;
`;

const PlayerImage = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 20px;
`;

const PlayerName = styled.div`
  font-size: 16px;
  font-weight: bold;
`;
