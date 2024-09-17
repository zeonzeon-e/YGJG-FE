//playersData에 role까지 받기
//매니저, 부매니저, 선수로 role 나눠져 있는 팀 선수 목록 컴포넌트
//프로필사진(원형) 이름 - 디테일 포지션

import React from "react";
import styled from "styled-components";

const playersData = [
  {
    id: 1,
    name: "이지현",
    position: "공격수",
    detail_position: "ST",
    profileImageUrl: "https://example.com/player1.jpg",
    role: "매니저"
  },
  {
    id: 2,
    name: "이지현",
    position: "수비수",
    detail_position: "WD",
    profileImageUrl: "https://example.com/player2.jpg"
    ,
    role: "부매니저"
  },
  {
    id: 3,
    name: "최민석",
    position: "수비수",
    detail_position: "WD",
    profileImageUrl: "https://example.com/player2.jpg",
    role: "부매니저"
  },
  {
    id: 4,
    name: "김유성",
    position: "미드필더",
    detail_position: "MF",
    profileImageUrl: "https://example.com/player2.jpg",
    role: "선수"
  },
  {
    id: 5,
    name: "김민기",
    position: "골키퍼",
    detail_position: "GK",
    profileImageUrl: "https://example.com/player2.jpg",
    role: "선수"
  }
];

// 역할별 우선순위 지정
const positionPriority: { [key: string]: number } = {
  "매니저": 1,
  "부매니저": 2,
  "선수": 3
};

// 역할별 색상 가져오기
const getColorByPosition = (position: string): string => {
  switch (position) {
    default: return "var(--color-sub)";
  }
};

interface TeamList2Props {
    onPlayerSelect: (player: { detail_position: string; name: string }) => void;
  }

const TeamList2: React.FC<TeamList2Props> = ({ onPlayerSelect }) => {
  // 역할에 따라 그룹화 및 정렬
  const roleGroups = playersData.reduce((acc, player) => {
    acc[player.role] = acc[player.role] || [];
    acc[player.role].push(player);
    return acc;
  }, {} as { [key: string]: typeof playersData });

  // 역할 정렬
  const sortedPositions = Object.keys(roleGroups).sort(
    (a, b) => positionPriority[a] - positionPriority[b]
  );


  return (
    <PageContainer>
      {sortedPositions.map(detail_position => (
        <React.Fragment key={detail_position}>
          <PositionHeader color={getColorByPosition(detail_position)}>
            {detail_position}
          </PositionHeader>
          <PlayerListContainer>
            {roleGroups[detail_position].map(player => (
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

export default TeamList2;

// Styled Components
const PageContainer = styled.div`
`;

const PositionHeader = styled.div<{ color: string }>`
  font-size: 18px;
  font-weight: bold;
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
