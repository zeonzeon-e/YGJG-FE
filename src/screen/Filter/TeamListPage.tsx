import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import FilterBar from "../../component/Filter/FilterBar";
import HorizontalLine from "../../component/Styled/HorizontalLine";
import Header2 from "../../component/Header/Header2/Header2";

// [
//     {
//       "id": 1,
//       "name": "이지현",
//       "position": "공격수",
//       "detail_position": "ST",
//       "profileImageUrl": "https://example.com/player1.jpg"
//     },
//     {
//       "id": 2,
//       "name": "이지현",
//       "position": "수비수",
//       "detail_position": "WD",
//       "profileImageUrl": "https://example.com/player2.jpg"
//     },
//     ...
//   ]

interface Player {
  id: number;
  name: string;
  position: string;
  detail_position: string;
  profileImageUrl: string;
}

const TeamListPage: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filter, setFilter] = useState<string>("전체");

  // 백엔드에서 데이터를 받아오는 함수
  const fetchPlayers = async () => {
    try {
      const response = await axios.get<Player[]>(
        "https://your-backend-api.com/players"
      );
      setPlayers(response.data);
    } catch (error) {
      console.error("Failed to fetch players:", error);
    }
  };

  useEffect(() => {
    fetchPlayers(); // 컴포넌트가 마운트될 때 플레이어 데이터를 가져옴
  }, []);

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const getColorByPosition = (position: string): string => {
    switch (position) {
      case "공격수":
        return "var(--color-sk)"; // 빨강
      case "수비수":
        return "var(--color-dp)"; // 파랑
      case "미드필더":
        return "var(--color-mf)"; // 초록
      case "골키퍼":
        return "var(--color-gk)"; // 노랑
      default:
        return "#95a5a6"; // 기본 회색
    }
  };

  const filteredPlayers = players.filter((player) =>
    filter === "전체" ? true : player.position === filter
  );

  return (
    <PageContainer>
      <Header2 text="선수 목록" />
      <div style={{ padding: "12px 0" }}></div>
      <FilterBar onFilterChange={handleFilterChange} />
      <PlayerListContainer>
        <PlayerCount>총 {filteredPlayers.length}명</PlayerCount>
        <HorizontalLine color="#333" />
        {filteredPlayers.map((player) => (
          <PlayerItem key={player.id}>
            <PlayerInfo>
              <PlayerImage
                src={player.profileImageUrl || "https://via.placeholder.com/50"}
                alt={player.name}
              />
              <PlayerName>{player.name}</PlayerName>
            </PlayerInfo>
            <PlayerRole roleColor={getColorByPosition(player.position)}>
              {player.detail_position}
            </PlayerRole>
          </PlayerItem>
        ))}
      </PlayerListContainer>
    </PageContainer>
  );
};

export default TeamListPage;

// 스타일 컴포넌트 정의

const PageContainer = styled.div`
  padding: 20px 5px;
`;

const PlayerListContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
`;

const PlayerCount = styled.div`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
  margin-left: 10px;
`;

const PlayerItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
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

const PlayerRole = styled.div<{ roleColor?: string }>`
  width: 66px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  border-radius: 15px;
  color: #fff;
  background-color: ${({ roleColor }) => roleColor || "#00b894"};
  margin-left: 10px;
  text-align: center;
`;
