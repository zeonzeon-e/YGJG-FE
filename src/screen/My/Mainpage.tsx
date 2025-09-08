import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header3 from "../../components/Header/Header3";
// import apiClient from "../../api/apiClient";
import {
  FaLocationDot,
  FaPeopleGroup,
  FaHeart,
  FaRocket,
} from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { TeamRole } from "../../stores/userStore";
import { FaRegUserCircle } from "react-icons/fa";

// ⭐ 1-1. 경기 일정 아이템 타입을 새로 정의합니다.
interface GameScheduleItem {
  id: number;
  date: string; // "YYYY-MM-DD" 형식
  opponent: string;
  location: string;
}

// ⭐ 1-2. 공지사항 타입에 '필독' 여부를 추가합니다.
interface NoticeItem {
  id: number;
  title: string;
  createAt: Date;
  isPinned?: boolean; // 필독 공지 여부
}

// ⭐ 1-3. 팀 상세 정보 타입에 새로운 필드들을 추가합니다.
interface TeamData {
  teamImageUrl: string;
  region: string;
  ageRange: string;
  matchLocation: string; // 홈 그라운드
  playerCount: number; // 선수 수
  dues: number; // 회비
  mainActivityDay: string; // 주요 활동 요일
  mainActivityStartTime: string; // 시작 시간 (예: "오후 3시")
  mainActivityEndTime: string; // 끝나는 시간 (예: "오후 6시")
}
// --- START: 임시 데이터 ---
const mockUserTeams: TeamRole[] = [
  {
    teamId: 1,
    teamName: "서울 퓨리어스",
    role: "MEMBER",
    position: "FW",
    teamColor: "#FF6B6B",
    teamImageUrl:
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=400&q=80",
  },
  {
    teamId: 2,
    teamName: "부산 스톰",
    role: "MANAGER",
    position: "MF",
    teamColor: "#4ECDC4",
    teamImageUrl:
      "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=400&q=80",
  },
  {
    teamId: 3,
    teamName: "인천 유나이티드 팬클럽",
    role: "MEMBER",
    position: "DF",
    teamColor: "#3498DB",
    teamImageUrl:
      "https://plus.unsplash.com/premium_photo-1682125845253-b09a4746853f?w=400&q=80",
  },
];

const mockTeamDetails: { [key: number]: TeamData } = {
  1: {
    teamImageUrl:
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80",
    region: "서울",
    ageRange: "20대, 30대 위주",
    matchLocation: "주 경기장",
    playerCount: 20,
    dues: 30000,
    mainActivityDay: "월",
    mainActivityStartTime: "오후 3시",
    mainActivityEndTime: "오후 6시",
  },
  // 다른 팀 ID에 대한 데이터도 필요시 추가
};

const mockNoticeDetails: { [key: number]: NoticeItem[] } = {
  1: [
    {
      id: 101,
      title: "필독 공지사항",
      createAt: new Date("2025-10-05"),
      isPinned: true,
    },
    { id: 102, title: "포지션 관련 안내", createAt: new Date("2025-10-05") },
    {
      id: 103,
      title: "2024년 하반기 회비 안내",
      createAt: new Date("2025-10-06"),
    },
  ],
};

const mockGameSchedules: { [key: number]: GameScheduleItem[] } = {
  1: [
    {
      id: 1,
      date: "2025-07-15",
      opponent: "아메리카 팀",
      location: "잠실 경기장",
    },
    {
      id: 2,
      date: "2025-07-20",
      opponent: "아메리카 팀",
      location: "잠실 경기장",
    },
    {
      id: 3,
      date: "2026-03-25",
      opponent: "아메리카 팀",
      location: "잠실 경기장",
    }, // D-200 테스트용
  ],
};
// --- END: 임시 데이터 ---

// ⭐ 원인 3 해결: TeamData 인터페이스에 실제 사용하는 필드를 정의합니다.
interface TeamData {
  teamImageUrl: string;
  region: string;
  ageRange: string;
  // 다른 필드들도 필요에 따라 추가할 수 있습니다.
}
interface NoticeItem {
  id: number;
  title: string;
  createAt: Date;
}

const calculateDday = (dateString: string): string => {
  const today = new Date();
  const targetDate = new Date(dateString);

  // 시간, 분, 초를 0으로 설정하여 날짜만 비교
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "D-DAY";
  if (diffDays > 0) return `D-${diffDays}`;
  return `D+${Math.abs(diffDays)}`; // 지난 일정은 D+로 표시
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
  return `${String(month).padStart(2, "0")}/${String(day).padStart(
    2,
    "0"
  )} ${dayOfWeek}요일`;
};

const MainPage: React.FC = () => {
  const { teams: userTeams, isLoading } = useAuth();
  const teams = userTeams && userTeams.length > 0 ? userTeams : mockUserTeams;

  const [selectedTeam, setSelectedTeam] = useState<{
    teamId: number;
    teamName: string;
  } | null>(null);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);
  const [gameScheduleList, setGameScheduleList] = useState<GameScheduleItem[]>(
    []
  );
  const [favoriteTeams, setFavoriteTeams] = useState<number[]>([1]); // '코리아 팀'을 즐겨찾기 한 것처럼 초기 설정
  const navigate = useNavigate();

  useEffect(() => {
    if (teams.length > 0 && !selectedTeam) {
      setSelectedTeam({ teamId: teams[0].teamId, teamName: teams[0].teamName });
    }
  }, [teams, selectedTeam]);

  useEffect(() => {
    if (!selectedTeam) return;
    const teamId = selectedTeam.teamId;
    const fetchMockData = () => {
      setTimeout(() => {
        setTeamData(mockTeamDetails[teamId] || null);
        setNoticeList(mockNoticeDetails[teamId] || []);
        setGameScheduleList(mockGameSchedules[teamId] || []);
      }, 300);
    };
    fetchMockData();
  }, [selectedTeam]);

  // 핸들러 함수들 (기존 로직과 유사)
  const handleTeamChange = (teamId: number, teamName: string) =>
    setSelectedTeam({ teamId, teamName });
  const handleEditClick = (teamId: number) => navigate(`/team-edit/${teamId}`);
  const navigateTo = (path: string) =>
    navigate(path, { state: { teamId: selectedTeam?.teamId } });

  if (isLoading || !selectedTeam || !teamData) {
    return <div>로딩 중...</div>;
  }

  const currentTeamInfo = teams.find((t) => t.teamId === selectedTeam.teamId);

  return (
    <>
      <Header3
        selectedTeam={{ teamId: 1, teamName: "코리아 팀" }} // 시안과 동일하게 고정
        teams={teams}
        onTeamChange={handleTeamChange}
        favoriteTeams={favoriteTeams}
        onToggleFavorite={() => {}}
      />
      <Container>
        <ProfileWrapper>
          <ProfileImage src={teamData.teamImageUrl} alt="Profile" />
          <ProfileInfo>
            <InfoText>
              <FaLocationDot /> 홈그라운드 {teamData.matchLocation}
            </InfoText>
            <InfoText>
              <FaRegUserCircle /> 연령대 {teamData.ageRange}
            </InfoText>
            <InfoText>
              <FaHeart /> 내 포지션 {currentTeamInfo?.position}
            </InfoText>
          </ProfileInfo>
          <SettingsIcon onClick={() => handleEditClick(selectedTeam.teamId)} />
        </ProfileWrapper>

        <StatsWrapper>
          <StatBox onClick={() => navigateTo("members")}>
            <span>선수 수</span>
            <strong>{teamData.playerCount}</strong>
            <ArrowSpan>&gt;</ArrowSpan>
          </StatBox>
          <StatBox>
            <span>회비/월</span>
            <strong>{teamData.dues.toLocaleString()}원</strong>
          </StatBox>
        </StatsWrapper>

        <Section>
          <SectionTitle>주요 활동 일정</SectionTitle>
          <ActivitySchedule>
            <DayBadge>{teamData.mainActivityDay}</DayBadge>
            <TimeRange>
              시작: {teamData.mainActivityStartTime} - 끝:{" "}
              {teamData.mainActivityEndTime}
            </TimeRange>
          </ActivitySchedule>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>공지사항</SectionTitle>
            <MoreLink onClick={() => navigateTo("notice")}>더보기</MoreLink>
          </SectionHeader>
          <NoticeList>
            {noticeList.slice(0, 3).map((notice) => (
              <NoticeItem
                key={notice.id}
                onClick={() => navigateTo(`notice/${notice.id}`)}
              >
                <div>
                  {notice.isPinned && <RocketIcon />}
                  <span>{notice.title}</span>
                </div>
                <DateText>
                  {new Date(notice.createAt)
                    .toISOString()
                    .split("T")[0]
                    .replace(/-/g, ". ")}
                </DateText>
              </NoticeItem>
            ))}
          </NoticeList>
        </Section>

        <Section>
          <SectionHeader>
            <SectionTitle>경기일정</SectionTitle>
            <MoreLink onClick={() => navigateTo("calendar")}>달력보기</MoreLink>
          </SectionHeader>
          <GameList>
            {gameScheduleList.map((game) => (
              <GameItem key={game.id}>
                <GameDateInfo>
                  <span>{formatDate(game.date)}</span>
                  <DdayBadge>{calculateDday(game.date)}</DdayBadge>
                </GameDateInfo>
                <GameOpponent>{game.opponent}</GameOpponent>
                <GameLocation>{game.location}</GameLocation>
              </GameItem>
            ))}
          </GameList>
        </Section>
      </Container>
    </>
  );
};

export default MainPage;

// --- START: 수정된 디자인에 맞춘 Styled Components ---
const Container = styled.div`
  padding: 16px;
  background-color: #fff; /* ⭐ 전체 배경을 흰색으로 변경 */
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;

const ProfileImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--color-dark1);
`;

const ProfileInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const InfoText = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #555;
`;

const SettingsIcon = styled(IoSettingsSharp)`
  font-size: 24px;
  color: #888;
  cursor: pointer;
`;

const StatsWrapper = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const StatBox = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 12px;
  background-color: #f7f7f7; /* ⭐ 배경을 회색으로 변경 */
  border: 1px solid var(--color-dark1);
  box-shadow: 0 1.5px 1.5px 0 var(--color-shabow);
  font-size: 15px;
  color: #333;
  cursor: pointer;

  strong {
    font-weight: 600;
    color: var(--color-main);
  }
`;

const ArrowSpan = styled.span`
  color: #ccc;
  font-weight: 600;
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const MoreLink = styled.a`
  font-size: 14px;
  color: #888;
  cursor: pointer;
`;

const ActivitySchedule = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  margin-top: 8px;
  justify-content: space-between;
  background-color: #f7f7f7;
  border-radius: 12px;
  border: 1px solid var(--color-dark1);
  box-shadow: 0 1.5px 1.5px 0 var(--color-shabow);
  font-size: 15px;
`;

const DayBadge = styled.span`
  padding: 4px 10px;
  background-color: #e9e9e9; /* 회색 배경에 맞춰 좀 더 진한 회색으로 변경 */
  border-radius: 16px;
  font-weight: 500;
`;

const TimeRange = styled.span`
  color: var(--color-main);
  font-weight: 600;
`;

const NoticeList = styled.ul`
  list-style: none;
  padding: 8px;
  margin: 0;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid var(--color-dark1);
  box-shadow: 0 1.5px 1.5px 0 var(--color-shabow);
`;

const NoticeItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid #f5f5f5;
  }
`;

const RocketIcon = styled(FaRocket)`
  color: #ff4d4d;
  margin-right: 8px;
`;

const DateText = styled.span`
  font-size: 13px;
  color: #999;
  white-space: nowrap;
`;

const GameList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GameItem = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  gap: 4px 12px;
  padding: 16px;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid var(--color-dark1);
  box-shadow: 0 1.5px 1.5px 0 var(--color-shabow);
`;

const GameDateInfo = styled.div`
  grid-column: 1 / 2;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
`;

const DdayBadge = styled.span`
  padding: 3px 8px;
  background-color: #ffeeee;
  color: #ff4d4d;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
`;

const GameOpponent = styled.span`
  grid-column: 2 / 3;
  text-align: right;
  font-weight: 500;
`;

const GameLocation = styled.span`
  grid-column: 1 / 3;
  color: #777;
  font-size: 14px;
`;
