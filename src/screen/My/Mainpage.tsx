import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header3 from "../../components/Header/Header3";
import apiClient from "../../api/apiClient";
import { FaRegUserCircle, FaHeart, FaRocket } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { TeamRole } from "../../stores/userStore";
import { FaLocationDot } from "react-icons/fa6";

// --- 최종 타입 정의 ---
// GET /api/team/{teamId} 응답 타입
interface TeamDetailResponse {
  activitySchedule: string[][];
  ageRange: string;
  dues: number;
  inviteCode: string;
  matchLocation: string;
  memberCount: number;
  positionRequired: string[];
  region: string;
  teamGender: string;
  teamImageUrl: string;
  teamLevel: string;
  teamName: string;
  team_introduce: string;
  town: string;
}

// GET /api/announcement/member/get-all 응답 타입
interface AnnouncementListItem {
  id: number;
  title: string;
  createAt: string;
}

// 누락되었던 GameScheduleItem 타입 정의를 추가합니다.
interface GameScheduleItem {
  id: number;
  date: string;
  opponent: string;
  location: string;
}

// --- 헬퍼 함수 ---
const calculateDday = (dateString: string): string => {
  const today = new Date();
  const targetDate = new Date(dateString);
  today.setHours(0, 0, 0, 0);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "D-DAY";
  if (diffDays > 0) return `D-${diffDays}`;
  return `D+${Math.abs(diffDays)}`;
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

// activitySchedule 데이터를 GameScheduleItem 타입으로 변환
const parseActivitySchedule = (schedule: string[][]): GameScheduleItem[] => {
  return schedule.map((item, index) => ({
    id: index, // 고유한 id가 없으므로 배열 인덱스를 사용
    date: item[0],
    opponent: item[1] || "미정",
    location: item[2] || "미정",
  }));
};

const MainPage: React.FC = () => {
  const { teams, isLoading: isAuthLoading } = useAuth();

  // selectedTeam 상태의 타입을 TeamRole로 변경
  const [selectedTeam, setSelectedTeam] = useState<TeamRole | null>(null);
  const [teamData, setTeamData] = useState<TeamDetailResponse | null>(null);
  const [noticeList, setNoticeList] = useState<AnnouncementListItem[]>([]);
  const [gameScheduleList, setGameScheduleList] = useState<GameScheduleItem[]>(
    []
  );
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // 로그인된 유저 정보가 로딩되면 첫 팀을 선택합니다.
  useEffect(() => {
    if (!isAuthLoading && teams && teams.length > 0) {
      if (!selectedTeam) {
        // favoriteTeam 속성 오류를 해결하기 위해 userStore.ts 수정이 필요합니다.
        // 아래 수정 사항을 먼저 적용해주세요.
        setSelectedTeam(teams.find((team) => team.favoriteTeam) || teams[0]);
      }
    }
  }, [teams, isAuthLoading, selectedTeam]);

  // 선택된 팀이 변경될 때마다 데이터를 다시 불러옵니다.
  useEffect(() => {
    if (!selectedTeam) return;

    const fetchPageData = async () => {
      setIsPageLoading(true);
      try {
        const teamId = selectedTeam.teamId;

        // 1. 팀 상세 정보 API 호출 (새로운 명세 적용)
        const teamDetailsRes = await apiClient.get<TeamDetailResponse>(
          `/api/team/${teamId}`
        );

        // 2. 공지사항 목록 API 호출 (새로운 명세 적용)
        const noticesRes = await apiClient.get<AnnouncementListItem[]>(
          "/api/announcement/member/get-all",
          { params: { teamId } }
        );

        // 3. 경기 일정 데이터는 팀 상세 정보 응답에서 파싱
        const parsedGameSchedule = parseActivitySchedule(
          teamDetailsRes.data.activitySchedule
        );
        // const gameSchedule = await apiClient.get<AnnouncementListItem[]>(
        //   "/api/team-strategy/get-strategy/monthly",
        //   { params: { date:"01-01", teamId : teamId } }
        // );

        setTeamData(teamDetailsRes.data);
        setNoticeList(noticesRes.data);
        setGameScheduleList(parsedGameSchedule);
      } catch (error) {
        console.error("Failed to fetch page data:", error);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchPageData();
  }, [selectedTeam]);

  // Header3 컴포넌트의 onTeamChange prop에 맞게 함수 시그니처를 수정합니다.
  const handleTeamChange = (teamId: number, teamName: string) => {
    const newSelectedTeam = teams?.find((team) => team.teamId === teamId);
    if (newSelectedTeam) {
      setSelectedTeam(newSelectedTeam);
    }
  };

  const handleEditClick = (teamId: number) => navigate(`/manager/${teamId}`);

  // 공지사항 상세 페이지로 이동하는 함수
  const navigateToNoticeDetail = (noticeId: number) => {
    navigate(`/team/${selectedTeam?.teamId}/notice/${noticeId}`);
  };

  if (isAuthLoading) {
    return <LoadingContainer>사용자 정보 로딩 중...</LoadingContainer>;
  }

  const currentTeamInfo = selectedTeam;

  return (
    <>
      {teams && teams.length > 0 ? (
        <Header3
          selectedTeam={selectedTeam}
          teams={teams || []}
          onTeamChange={handleTeamChange}
          // favoriteTeams prop에 맞게 teams 배열을 필터링합니다.
          favoriteTeams={teams
            .filter((t) => t.favoriteTeam)
            .map((t) => t.teamId)}
          onToggleFavorite={() => {}}
        />
      ) : (
        // 팀이 없을 때의 헤더
        <Header3
          selectedTeam={null}
          teams={[]}
          onTeamChange={handleTeamChange}
          favoriteTeams={[]}
          onToggleFavorite={() => {}}
        />
      )}
      {isPageLoading ? (
        <LoadingContainer>
          페이지 데이터를 불러오는 중입니다...
        </LoadingContainer>
      ) : teamData && currentTeamInfo ? (
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
            <SettingsIcon
              onClick={() => handleEditClick(currentTeamInfo.teamId)}
            />
          </ProfileWrapper>

          <StatsWrapper>
            <StatBox
              onClick={() => navigate(`/team/${currentTeamInfo.teamId}/member`)}
            >
              <span>선수 수</span>
              <strong>{teamData.memberCount}</strong>
              <ArrowSpan>&gt;</ArrowSpan>
            </StatBox>
            <StatBox>
              <span>회비/월</span>
              <strong>{teamData.dues.toLocaleString()}원</strong>
            </StatBox>
          </StatsWrapper>
          <Section>
            <SectionTitle>팀 소개</SectionTitle>
            <TeamIntroduce>
              {teamData.team_introduce || "등록된 팀 소개가 없습니다."}
            </TeamIntroduce>
          </Section>
          <Section>
            <SectionTitle>주요 활동 일정</SectionTitle>
            {/* teamData의 activitySchedule을 사용하도록 수정 */}
            {teamData &&
            teamData.activitySchedule &&
            teamData.activitySchedule.length > 0 ? (
              <ActivitySchedule>
                {/* activitySchedule의 첫 번째 요소에서 요일과 시간을 추출하여 표시합니다. */}
                <DayBadge>{teamData.activitySchedule[0][0]}</DayBadge>
                <TimeRange>
                  시작: {teamData.activitySchedule[0][1] || "미정"} - 끝:{" "}
                  {teamData.activitySchedule[0][2] || "미정"}
                </TimeRange>
              </ActivitySchedule>
            ) : (
              <NoDataText>등록된 활동 일정이 없습니다.</NoDataText>
            )}
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>공지사항</SectionTitle>
              <MoreLink
                onClick={() =>
                  navigate(`/team/${currentTeamInfo.teamId}/notice`)
                }
              >
                더보기
              </MoreLink>
            </SectionHeader>
            <NoticeList>
              {noticeList && noticeList.length > 0 ? (
                noticeList.slice(0, 3).map((notice) => (
                  <NoticeItem
                    key={notice.id}
                    onClick={() => navigateToNoticeDetail(notice.id)}
                  >
                    <div>
                      {/* isPinned 필드가 없으므로 로직 삭제 */}
                      <span>{notice.title}</span>
                    </div>
                    <DateText>
                      {new Date(notice.createAt)
                        .toISOString()
                        .split("T")[0]
                        .replace(/-/g, ". ")}
                    </DateText>
                  </NoticeItem>
                ))
              ) : (
                <NoDataText>등록된 공지사항이 없습니다.</NoDataText>
              )}
            </NoticeList>
          </Section>

          <Section>
            <SectionHeader>
              <SectionTitle>경기일정</SectionTitle>
              <MoreLink
                onClick={() =>
                  navigate(`/team/${currentTeamInfo.teamId}/calendar`, {
                    state: { teamName: teamData.teamName },
                  })
                }
              >
                달력보기
              </MoreLink>
            </SectionHeader>
            <GameList>
              {gameScheduleList && gameScheduleList.length > 0 ? (
                gameScheduleList.map((game) => (
                  <GameItem key={game.id}>
                    <GameDateInfo>
                      <span>{formatDate(game.date)}</span>
                      <DdayBadge>{calculateDday(game.date)}</DdayBadge>
                    </GameDateInfo>
                    <GameOpponent>{game.opponent}</GameOpponent>
                    <GameLocation>{game.location}</GameLocation>
                  </GameItem>
                ))
              ) : (
                <NoDataBox>등록된 경기 일정이 없습니다.</NoDataBox>
              )}
            </GameList>
          </Section>
        </Container>
      ) : (
        <LoadingContainer>
          소속된 팀이 없거나 데이터를 불러올 수 없습니다.
        </LoadingContainer>
      )}
    </>
  );
};

export default MainPage;

// --- Styled Components (최종 수정) ---
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50vh;
  color: #888;
`;
const Container = styled.div`
  padding: 16px;
  background-color: #fff;
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
  border: 1px solid #eee;
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
  background-color: #f7f7f7;
  border: 1px solid var(--color-border);
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
const TeamIntroduce = styled.p`
  padding: 16px;
  margin-top: 8px;
  background-color: #f7f7f7;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: #555;
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
  justify-content: space-between;
  padding: 16px;
  margin-top: 8px;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  box-shadow: 0 1.5px 1.5px 0 var(--color-shabow);
  font-size: 15px;
`;
const DayBadge = styled.span`
  padding: 4px 10px;
  background-color: #e9e9e9;
  border-radius: 16px;
  font-weight: 500;
`;
const TimeRange = styled.span`
  color: var(--color-main);
  font-weight: 600;
`;
const NoticeList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid var(--color-border);
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
  color: var(--color-error);
  margin-right: 8px;
`;
const DateText = styled.span`
  font-size: 13px;
  color: #999;
  white-space: nowrap;
`;
const NoDataText = styled.div`
  text-align: center;
  padding: 20px;
  color: #888;
  font-size: 14px;
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
  border: 1px solid var(--color-border);
  box-shadow: 0 1.5px 1.5px 0 var(--color-shabow);
`;
const NoDataBox = styled(NoDataText)`
  background-color: #fff;
  border: 1px solid var(--color-border);
  box-shadow: 0 1.5px 1.5px 0 var(--color-shabow);
  border-radius: 12px;
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