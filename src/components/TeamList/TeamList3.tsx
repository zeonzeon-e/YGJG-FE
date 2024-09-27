//경기전략 페이지 안에 들어가는 선수 목록 컴포넌트
//선수 모양이 동그라미 모양

import React from "react";
import styled from "styled-components";
//나중에 백엔드에서 가져올 정보
const playersData = [
  {
    id: 1,
    name: "이지현",
    position: "공격수",
    detail_position: "ST",
  },
  {
    id: 2,
    name: "이지현",
    position: "수비수",
    detail_position: "WD",
  },
  {
    id: 3,
    name: "최민석",
    position: "수비수",
    detail_position: "WD",
  },
  {
    id: 4,
    name: "김유성",
    position: "미드필더",
    detail_position: "MF",
  },
  {
    id: 5,
    name: "김민기",
    position: "골키퍼",
    detail_position: "GK",
  },
];

// 포지션별 우선순위 지정
const positionPriority: { [key: string]: number } = {
  공격수: 1,
  수비수: 2,
  미드필더: 3,
  골키퍼: 4,
};

// 포지션별 색상 가져오기
const getColorByPosition = (position: string): string => {
  switch (position) {
    case "공격수":
      return "var(--color-sk)";
    case "수비수":
      return "var(--color-dp)";
    case "미드필더":
      return "var(--color-mf)";
    case "골키퍼":
      return "var(--color-gk)";
    default:
      return "#9E9E9E";
  }
};

interface TeamList3Props {
  players: {
    id: number;
    name: string;
    position: string;
    detail_position: string;
  }[];
  onPlayerSelect: (player: {
    detail_position: string;
    name: string;
    position: string;
  }) => void;
}

const TeamList3: React.FC<TeamList3Props> = ({ players, onPlayerSelect }) => {
  // 포지션에 따라 그룹화 및 정렬
  const positionGroups = players.reduce((acc, player) => {
    acc[player.position] = acc[player.position] || [];
    acc[player.position].push(player);
    return acc;
  }, {} as { [key: string]: typeof players });

  // 포지션 정렬
  const sortedPositions = Object.keys(positionGroups).sort(
    (a, b) => positionPriority[a] - positionPriority[b]
  );

  return (
    <PageContainer>
      {sortedPositions.map((position) => (
        <React.Fragment key={position}>
          <PositionHeader color={getColorByPosition(position)}>
            {position}
          </PositionHeader>
          <PlayerListContainer>
            {positionGroups[position].map((player) => (
              <PlayerItem
                key={player.id}
                onClick={() =>
                  onPlayerSelect({
                    detail_position: player.detail_position,
                    name: player.name,
                    position: player.position,
                  })
                }
              >
                <PlayerName>
                  {player.detail_position}
                  <br />
                  {player.name}
                </PlayerName>
              </PlayerItem>
            ))}
          </PlayerListContainer>
        </React.Fragment>
      ))}
    </PageContainer>
  );
};

export default TeamList3;

// Styled Components
const PageContainer = styled.div``;

const PositionHeader = styled.div<{ color: string }>`
  font-size: 16px;
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
  display: flex;
`;

const PlayerItem = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
  text-align: center;
  border-radius: 100px;
  background-color: var(--color-light1);
  width: 50px;
  height: 50px;
  margin: 10px;
`;

const PlayerName = styled.div`
  font-size: 16px;
  margin: auto;
`;
