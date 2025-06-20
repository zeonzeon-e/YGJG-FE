import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import FilterBar from "../../../components/Filter/FilterBar";
import HorizontalLine from "../../../components/Styled/HorizontalLine";
import Header2 from "../../../components/Header/Header2/Header2";
import apiClient from "../../../api/apiClient";

interface Player {
  id: number;
  name: string;
  position: string; // 예: "ST", "CF", "LW", "RW", "GK" 등
  profileUrl?: string; // 프로필 이미지 URL
  role?: string; // 다른 필드가 필요하면 추가
}
interface JoinRequest {
  id: number;
  name: string;
  gender: string;
  age: number;
  address: string;
  experience: string;
  level: string;
  message: string;
  profileUrl?: string;
  position: string;
  joinTeamId: number;
}

const AdminJoinListPage: React.FC = () => {
  // URL 파라미터에서 teamId 추출

  const { teamId } = useParams<{ teamId: string }>();
  const numericTeamId = Number(teamId);

  // 서버에서 받아온 전체 플레이어 목록
  const [allPlayers, setAllPlayers] = useState<JoinRequest[]>([]);

  // 포지션, 정렬 필터 (백엔드에 전달)
  const [positionFilter, setPositionFilter] = useState<string>("전체");
  const [sortFilter, setSortFilter] = useState<string>("최신 가입순");

  // 100명씩 표시하는 무한 스크롤 관련 상태
  const [itemsToShow, setItemsToShow] = useState<number>(100);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Intersection Observer 관찰 대상
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const [request, setRequest] = useState<JoinRequest[]>([]);
  // 포지션이나 정렬이 바뀌면 서버에 다시 요청하여 데이터를 새로 받아옴
  const navigate = useNavigate();

  useEffect(() => {
    // API 호출로 가입 요청 상세 가져오기
    async function fetchRequest() {
      try {
        const res = await apiClient.get(
          `/api/admin/joinTeam/getPendingRequests/${teamId}`
        );
        setRequest(res.data);
      } catch (err) {
        console.error("신청서 로드 실패", err);
      }
    }
    fetchRequest();
  }, [teamId, navigate]);

  // itemsToShow가 변경되면, 이미 전체 길이를 초과했는지 확인해 hasMore 업데이트
  useEffect(() => {
    if (itemsToShow >= allPlayers.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [itemsToShow, allPlayers]);

  // IntersectionObserver로 스크롤 끝에 닿을 때 itemsToShow += 100
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setItemsToShow((prev) => prev + 100);
        }
      },
      { threshold: 1.0 }
    );

    if (sentinelRef.current) observer.observe(sentinelRef.current);

    return () => {
      if (sentinelRef.current) observer.unobserve(sentinelRef.current);
    };
  }, [hasMore]);

  // 실제로 화면에 표시할 목록
  const displayedPlayers = request && request.slice(0, itemsToShow);

  // FilterBar에서 포지션 변경 시 호출
  const handleFilterChange = (value: string) => {
    setPositionFilter(value);
  };

  /**
   * 포지션별로 배경색을 지정하는 함수
   * - ST, CF, LW, RW 등 공격수 계열은 빨강
   * - CM, CDM, CAM 등 미드필더 계열은 초록
   * - CB, LB, RB 등 수비수 계열은 파랑
   * - GK는 노랑
   * - 그 외는 회색
   */
  const getColorByPosition = (pos: string): string => {
    const position = pos.toUpperCase().trim();

    // 공격수 계열
    if (["ST", "CF", "LW", "RW", "SS", "LF", "RF"].includes(position)) {
      return "var(--color-sk)"; // 빨강 (공격수)
    }

    // 미드필더 계열
    if (["CM", "CAM", "CDM", "LM", "RM", "AM", "DM"].includes(position)) {
      return "var(--color-mf)"; // 초록 (미드필더)
    }

    // 수비수 계열
    if (["CB", "LB", "RB", "LWB", "RWB", "WB", "SW"].includes(position)) {
      return "var(--color-dp)"; // 파랑 (수비수)
    }

    // 골키퍼
    if (position === "GK") {
      return "var(--color-gk)"; // 노랑 (골키퍼)
    }

    // 그 외
    return "#95a5a6";
  };

  return (
    <PageContainer>
      <Header2 text="가입 선수 대기 목록" />
      <div style={{ padding: "12px 0" }}></div>

      {/* 포지션 필터 전용 컴포넌트 */}
      <FilterBar onFilterChange={handleFilterChange} />

      <PlayerListContainer>
        <PlayerCount>총 {allPlayers.length}명</PlayerCount>
        <HorizontalLine color="#333" />

        {displayedPlayers.map((player) => (
          <PlayerItem
            key={player.id}
            onClick={() => navigate(`${player.joinTeamId}`)}
          >
            <PlayerInfo>
              <PlayerImage
                src={player.profileUrl || "https://via.placeholder.com/50"}
                alt={player.name}
              />
              <PlayerName>{player.name}</PlayerName>
            </PlayerInfo>
            <PlayerRole roleColor={getColorByPosition(player.position)}>
              {player.position}
            </PlayerRole>
          </PlayerItem>
        ))}

        {hasMore && <div ref={sentinelRef} style={{ height: "1px" }} />}
      </PlayerListContainer>
    </PageContainer>
  );
};

export default AdminJoinListPage;

/* ---------------- 스타일 컴포넌트 정의 ---------------- */
const PageContainer = styled.div`
  padding: 0px 10px;
`;

const PlayerListContainer = styled.div`
  background-color: #fff;
  border-radius: 8px;
  padding: 7px;
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
