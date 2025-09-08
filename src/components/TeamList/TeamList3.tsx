import React from "react";
import styled from "styled-components";

// 포지션별 우선순위 지정 객체 (포지션 순서에 따라 정렬할 때 사용)
const positionPriority: { [key: string]: number } = {
  공격수: 1,
  수비수: 2,
  미드필더: 3,
  골키퍼: 4,
};

// 포지션별 색상을 반환하는 함수 (UI에서 포지션에 따라 다른 색을 표시하기 위함)
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
      return "#9E9E9E"; // 기본 색상
  }
};

// 모든 포지션 리스트를 미리 정의
const allPositions = ["ST", "WD", "미드필더", "골키퍼"];

interface TeamList3Props {
  players: {
    id: number;
    name: string;
    position: string; // 예: "ST", "CF", "LW", "RW", "GK" 등
    profileUrl?: string; // 프로필 이미지 URL
    role?: string; // 다른 필드가 필요하면 추가
  }[];
  onPlayerSelect: (player: {
    detail_position: string;
    name: string;
    position: string;
  }) => void;
}

// 팀 목록을 보여주는 TeamList3 컴포넌트
const TeamList3: React.FC<TeamList3Props> = ({ players, onPlayerSelect }) => {
  // 포지션별로 선수들을 그룹화
  const positionGroups = players.reduce((acc, player) => {
    acc[player.position] = acc[player.position] || []; // 포지션 그룹이 없다면 빈 배열 생성
    acc[player.position].push(player); // 해당 포지션에 속하는 선수 추가
    return acc;
  }, {} as { [key: string]: typeof players });

  // 포지션별로 우선순위에 따라 정렬
  const sortedPositions = allPositions.sort(
    (a, b) => positionPriority[a] - positionPriority[b] // 우선순위 값을 비교하여 정렬
  );

  return (
    <PageContainer>
      {/* 모든 포지션을 순서대로 출력, 선수가 없으면 빈 배열을 보여줌 */}
      {sortedPositions.map((position) => (
        <React.Fragment key={position}>
          {/* 포지션 헤더 출력 (포지션별로 다른 색상을 사용) */}
          <PositionHeader color={getColorByPosition(position)}>
            {position}
          </PositionHeader>

          {/* 해당 포지션에 선수가 있을 경우 출력, 없으면 빈 상태로 */}
          <PlayerListContainer>
            {positionGroups[position]?.length ? (
              positionGroups[position].map((player) => (
                <PlayerItem
                  key={player.id}
                  onClick={() =>
                    onPlayerSelect({
                      detail_position: player.position,
                      name: player.name,
                      position: player.position,
                    })
                  }
                >
                  {/* 선수의 상세 포지션 및 이름 출력 */}
                  <PlayerName>
                    {player.position}
                    <br />
                    {player.name}
                  </PlayerName>
                </PlayerItem>
              ))
            ) : (
              <EmptyPlayerMessage>선수가 없습니다</EmptyPlayerMessage> // 빈 경우 출력될 메시지
            )}
          </PlayerListContainer>
        </React.Fragment>
      ))}
    </PageContainer>
  );
};

export default TeamList3;

// Styled Components (스타일링 부분)
const PageContainer = styled.div``;

const PositionHeader = styled.div<{ color: string }>`
  font-size: 16px;
  color: white;
  background-color: ${({ color }) => color}; // 포지션에 따라 배경색이 달라짐
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
  border-radius: 100px; // 동그라미 모양을 만들기 위해 border-radius를 100%로 설정
  background-color: var(--color-light1); // 기본 배경색
  width: 50px;
  height: 50px;
  margin: 10px;
  cursor: pointer; // 클릭 가능하도록 커서 변경
`;

const PlayerName = styled.div`
  font-size: 16px;
  margin: auto; // 중앙 정렬
`;

const EmptyPlayerMessage = styled.div`
  color: #ccc;
  text-align: center;
  padding: 10px;
  font-size: 14px;
`;
