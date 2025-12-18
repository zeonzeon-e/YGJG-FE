// import React from "react";
// import styled from "styled-components";

// // 포지션별 우선순위 지정 객체 (포지션 순서에 따라 정렬할 때 사용)
// const positionPriority: { [key: string]: number } = {
//   공격수: 1,
//   수비수: 2,
//   미드필더: 3,
//   골키퍼: 4,
// };

// // 포지션별 색상을 반환하는 함수 (UI에서 포지션에 따라 다른 색을 표시하기 위함)
//   /**
//    * 포지션별로 배경색을 지정하는 함수
//    * - ST, CF, LW, RW 등 공격수 계열은 빨강
//    * - CM, CDM, CAM 등 미드필더 계열은 초록
//    * - CB, LB, RB 등 수비수 계열은 파랑
//    * - GK는 노랑
//    * - 그 외는 회색
//    */
//   const getColorByPosition = (pos: string): string => {
//     if (pos === null) return "#95a5a6";
//     const position = pos.toUpperCase().trim() || "";

//     // 공격수 계열
//     if (["ST", "CF", "LW", "RW", "SS", "LF", "RF", "공격수"].includes(position)) {
//       return "var(--color-sk)"; // 빨강 (공격수)
//     }

//     // 미드필더 계열
//     if (["CM", "CAM", "CDM", "LM", "RM", "AM", "DM", "미드필더"].includes(position)) {
//       return "var(--color-mf)"; // 초록 (미드필더)
//     }

//     // 수비수 계열
//     if (["CB", "LB", "RB", "LWB", "RWB", "WB", "SW", "수비수"].includes(position)) {
//       return "var(--color-dp)"; // 파랑 (수비수)
//     }

//     // 골키퍼
//     if (["GK", "골키퍼"].includes(position)) {
//       return "var(--color-gk)"; // 노랑 (골키퍼)
//     }

//     // 그 외
//     return "#95a5a6";
//   };

// //포지션 합치기
//   const comPosition = (pos: string): string => {
//     if (pos === null) return "#95a5a6";
//     const position = pos.toUpperCase().trim() || "";

//     // 공격수 계열
//     if (["ST", "CF", "LW", "RW", "SS", "LF", "RF"].includes(position)) {
//       return "공격수"; // 빨강 (공격수)
//     }

//     // 미드필더 계열
//     if (["CM", "CAM", "CDM", "LM", "RM", "AM", "DM"].includes(position)) {
//       return "미드필더"; // 초록 (미드필더)
//     }

//     // 수비수 계열
//     if (["CB", "LB", "RB", "LWB", "RWB", "WB", "SW"].includes(position)) {
//       return "수비수"; // 파랑 (수비수)
//     }

//     // 골키퍼
//     if (["GK"].includes(position)) {
//       return "골키퍼"; // 노랑 (골키퍼)
//     }

//     // 그 외
//     return "";
//   };

// // 모든 포지션 리스트를 미리 정의
// const allPositions = ["공격수", "수비수", "미드필더", "골키퍼"];

// interface TeamList3Props {
//   players: {
//     id: number;
//     name: string;
//     position: string; // 예: "ST", "CF", "LW", "RW", "GK" 등
//     profileUrl?: string; // 프로필 이미지 URL
//     role?: string; // 다른 필드가 필요하면 추가
//   }[];
//   onPlayerSelect: (player: {
//     detail_position: string;
//     name: string;
//     position: string;
//   }) => void;
// }

// // 팀 목록을 보여주는 TeamList3 컴포넌트
// const TeamList3: React.FC<TeamList3Props> = ({ players, onPlayerSelect }) => {
//   // 포지션별로 선수들을 그룹화
//   const positionGroups = players.reduce((acc, player) => {
//     acc[player.position] = acc[player.position] || []; // 포지션 그룹이 없다면 빈 배열 생성
//     acc[player.position].push(player); // 해당 포지션에 속하는 선수 추가
//     return acc;
//   }, {} as { [key: string]: typeof players });

//   // 포지션별로 우선순위에 따라 정렬
//   const sortedPositions = allPositions.sort(
//     (a, b) => positionPriority[a] - positionPriority[b] // 우선순위 값을 비교하여 정렬
//   );

//   return (
//     <PageContainer>
//       {/* 모든 포지션을 순서대로 출력, 선수가 없으면 빈 배열을 보여줌 */}
//       {sortedPositions.map((position) => (
//         <React.Fragment key={position}>
//           {/* 포지션 헤더 출력 (포지션별로 다른 색상을 사용) */}
//           <PositionHeader color={getColorByPosition(position)}>
//             {position}
//           </PositionHeader>

//           {/* 해당 포지션에 선수가 있을 경우 출력, 없으면 빈 상태로 */}
//           <PlayerListContainer>
//             {positionGroups[position]?.length ? (
//               positionGroups[position].map((player) => (
//                 <PlayerItem
//                   key={player.id}
//                   onClick={() =>
//                     onPlayerSelect({
//                       detail_position: player.position,
//                       name: player.name,
//                       position: player.position,
//                     })
//                   }
//                 >
//                   {/* 선수의 상세 포지션 및 이름 출력 */}
//                   <PlayerName>
//                     {player.position}
//                     <br />
//                     {player.name}
//                   </PlayerName>
//                 </PlayerItem>
//               ))
//             ) : (
//               <EmptyPlayerMessage>선수가 없습니다</EmptyPlayerMessage> // 빈 경우 출력될 메시지
//             )}
//           </PlayerListContainer>
//         </React.Fragment>
//       ))}
//     </PageContainer>
//   );
// };

// export default TeamList3;

// // Styled Components (스타일링 부분)
// const PageContainer = styled.div``;

// const PositionHeader = styled.div<{ color: string }>`
//   font-size: 16px;
//   color: white;
//   background-color: ${({ color }) => color}; // 포지션에 따라 배경색이 달라짐
//   padding: 8px;
//   border-radius: 50px;
//   text-align: center;
//   &:first-child {
//     margin-top: 10px;
//   }
// `;

// const PlayerListContainer = styled.div`
//   background-color: #fff;
//   border-radius: 8px;
//   display: flex;
// `;

// const PlayerItem = styled.div`
//   display: flex;
//   padding: 10px;
//   align-items: center;
//   text-align: center;
//   border-radius: 100px; // 동그라미 모양을 만들기 위해 border-radius를 100%로 설정
//   background-color: var(--color-light1); // 기본 배경색
//   width: 50px;
//   height: 50px;
//   margin: 10px;
//   cursor: pointer; // 클릭 가능하도록 커서 변경
// `;

// const PlayerName = styled.div`
//   font-size: 16px;
//   margin: auto; // 중앙 정렬
// `;

// const EmptyPlayerMessage = styled.div`
//   color: #ccc;
//   text-align: center;
//   padding: 10px;
//   font-size: 14px;
// `;
import React from "react";
import styled from "styled-components";

// 포지션별 우선순위 (그룹 헤더 정렬용)
const positionPriority: { [key: string]: number } = {
  공격수: 1,
  미드필더: 2,
  수비수: 3,
  골키퍼: 4,
  기타: 5, // ← 매핑 실패 시 마지막에 오도록
};

// 포지션별 색상
const getColorByPosition = (pos: string): string => {
  if (pos == null) return "#95a5a6";
  const position = pos.toUpperCase().trim() || "";

  if (["ST","CF","LW","RW","SS","LF","RF","공격수"].includes(position)) return "var(--color-sk)";
  if (["CM","CAM","CDM","LM","RM","AM","DM","미드필더"].includes(position)) return "var(--color-mf)";
  if (["CB","LB","RB","LWB","RWB","WB","SW", "WD", "수비수"].includes(position)) return "var(--color-dp)";
  if (["GK","골키퍼"].includes(position)) return "var(--color-gk)";
  return "#95a5a6";
};

// ✅ 포지션 통합 매핑 (BUG FIX: null일 때 색상코드가 아니라 그룹명 반환)
const comPosition = (pos: string | null | undefined): string => {
  if (pos == null) return "기타";
  const position = pos.toUpperCase().trim() || "";

  if (["ST","CF","LW","RW","SS","LF","RF","공격수"].includes(position)) return "공격수";
  if (["CM","CAM","CDM","LM","RM","AM","DM","미드필더"].includes(position)) return "미드필더";
  if (["CB","LB","RB","LWB","RWB","WB","SW", "WD", "수비수"].includes(position)) return "수비수";
  if (["GK","골키퍼"].includes(position)) return "골키퍼";
  return "기타";
};

// 모든 그룹(정렬 기준)
const allPositions = ["공격수", "미드필더", "수비수", "골키퍼", "기타"] as const;

interface TeamList3Props {
  players: {
    id: number;
    name: string;
    position: string;      // 세부 포지션 (ST, CM, ...)
    profileUrl?: string;
    role?: string;
    teamMemberId: number;
  }[];
  onPlayerSelect: (player: {
    detail_position: string; // 세부 포지션 그대로 넘김 (예: "ST")
    name: string;
    position: string;        // ✅ 통합 포지션으로 넘김 (예: "공격수")
    teamMemberId: number; // memberId
  }) => void;
}

const TeamList3: React.FC<TeamList3Props> = ({ players, onPlayerSelect }) => {
  // ✅ 1) 그룹 키를 통합 포지션으로 변경
  const positionGroups = players.reduce((acc, player) => {
    const groupKey = comPosition(player.position) || "기타";
    (acc[groupKey] ||= []).push(player);
    return acc;
  }, {} as { [key: string]: typeof players });

  // 2) 그룹 헤더 정렬
  const sortedPositions = [...allPositions].sort(
    (a, b) => positionPriority[a] - positionPriority[b]
  );

  return (
    <PageContainer>
      {sortedPositions.map((group) => (
        <React.Fragment key={group}>
          {/* ✅ 헤더는 통합 포지션명으로 표시, 색상도 그룹명으로 계산 */}
          <PositionHeader color={getColorByPosition(group)}>{group}</PositionHeader>

          <PlayerListContainer>
            {positionGroups[group]?.length ? (
              positionGroups[group].map((player) => (
                <PlayerItem
                  key={player.id}
                  onClick={() =>
                    onPlayerSelect({
                      detail_position: player.position,     // 세부 포지션(ST 등)
                      name: player.name,
                      position: comPosition(player.position), // ✅ 통합 포지션으로 전달
                      teamMemberId: player.teamMemberId
                    })
                  }
                >
                  <PlayerName>
                    {player.position}
                    <br />
                    {player.name}
                  </PlayerName>
                </PlayerItem>
              ))
            ) : (
              <EmptyPlayerMessage>선수가 없습니다</EmptyPlayerMessage>
            )}
          </PlayerListContainer>
        </React.Fragment>
      ))}
    </PageContainer>
  );
};

export default TeamList3;

/* ===== styled ===== */

const PageContainer = styled.div``;

const PositionHeader = styled.div<{ color: string }>`
  font-size: 16px;
  color: white;
  background-color: ${({ color }) => color};
  padding: 8px;
  border-radius: 50px;
  text-align: center;
  &:first-child { margin-top: 10px; }
`;

const PlayerListContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  display: flex;
  flex-wrap: wrap;      /* 카드가 넘칠 때 줄바꿈되도록 (선택) */
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
  cursor: pointer;
`;

const PlayerName = styled.div`
  font-size: 14px;
  margin: auto;
  line-height: 1.15;
`;

const EmptyPlayerMessage = styled.div`
  color: #999;
  text-align: center;
  padding: 10px;
  font-size: 14px;
`;
