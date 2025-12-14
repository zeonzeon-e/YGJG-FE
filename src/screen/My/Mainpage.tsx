import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import Header3 from "../../components/Header/Header3";
import apiClient from "../../api/apiClient";
import {
  HiMapPin,
  HiUserGroup,
  HiHeart,
  HiCog6Tooth,
  HiMegaphone,
  HiCalendarDays,
  HiChevronRight,
  HiClipboardDocumentList,
  HiUserCircle,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { TeamRole } from "../../stores/userStore";

// --- Types ---
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

interface AnnouncementListItem {
  id: number;
  title: string;
  createAt: string;
}

interface GameScheduleItem {
  id: number;
  date: string;
  opponent: string;
  location: string;
}

// --- Helper Functions ---
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
  )} ${dayOfWeek}`;
};

const parseActivitySchedule = (schedule: string[][]): GameScheduleItem[] => {
  return schedule.map((item, index) => ({
    id: index,
    date: item[0],
    opponent: item[1] || "미정",
    location: item[2] || "미정",
  }));
};

const MainPage: React.FC = () => {
  const { teams, isLoading: isAuthLoading } = useAuth();
  const [selectedTeam, setSelectedTeam] = useState<TeamRole | null>(null);
  const [teamData, setTeamData] = useState<TeamDetailResponse | null>(null);
  const [noticeList, setNoticeList] = useState<AnnouncementListItem[]>([]);
  const [gameScheduleList, setGameScheduleList] = useState<GameScheduleItem[]>(
    []
  );
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && teams && teams.length > 0) {
      if (!selectedTeam) {
        setSelectedTeam(teams.find((team) => team.favoriteTeam) || teams[0]);
      }
    }
  }, [teams, isAuthLoading, selectedTeam]);

  useEffect(() => {
    if (!selectedTeam) return;

    const fetchPageData = async () => {
      setIsPageLoading(true);
      try {
        const teamId = selectedTeam.teamId;
        const teamDetailsRes = await apiClient.get<TeamDetailResponse>(
          `/api/team/${teamId}`
        );
        const noticesRes = await apiClient.get<AnnouncementListItem[]>(
          "/api/announcement/member/get-all",
          { params: { teamId } }
        );
        const parsedGameSchedule = parseActivitySchedule(
          teamDetailsRes.data.activitySchedule
        );

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

  const handleTeamChange = (teamId: number, teamName: string) => {
    const newSelectedTeam = teams?.find((team) => team.teamId === teamId);
    if (newSelectedTeam) {
      setSelectedTeam(newSelectedTeam);
    }
  };

  const handleEditClick = (teamId: number) => navigate(`/manager/${teamId}`);

  const navigateToNoticeDetail = (noticeId: number) => {
    navigate(`/team/${selectedTeam?.teamId}/notice/${noticeId}`);
  };

  if (isAuthLoading) {
    return (
      <LoadingWrapper>
        <LoadingSpinner />
        <LoadingText>로딩 중...</LoadingText>
      </LoadingWrapper>
    );
  }

  const currentTeamInfo = selectedTeam;

  return (
    <PageWrapper>
      {teams && teams.length > 0 ? (
        <Header3
          selectedTeam={selectedTeam}
          teams={teams || []}
          onTeamChange={handleTeamChange}
          favoriteTeams={teams
            .filter((t) => t.favoriteTeam)
            .map((t) => t.teamId)}
          onToggleFavorite={() => {}}
        />
      ) : (
        <Header3
          selectedTeam={null}
          teams={[]}
          onTeamChange={handleTeamChange}
          favoriteTeams={[]}
          onToggleFavorite={() => {}}
        />
      )}

      {isPageLoading ? (
        <LoadingWrapper>
          <LoadingSpinner />
          <LoadingText>팀 정보를 불러오는 중...</LoadingText>
        </LoadingWrapper>
      ) : teamData && currentTeamInfo ? (
        <ContentContainer>
          {/* 팀 프로필 카드 */}
          <TeamProfileCard>
            <TeamProfileHeader>
              <TeamLogo
                src={teamData.teamImageUrl || "/default-team.png"}
                alt={teamData.teamName}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = "true";
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect fill='%23e8e8e8' width='80' height='80' rx='16'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='10'%3ETEAM%3C/text%3E%3C/svg%3E";
                  }
                }}
              />
              <TeamBasicInfo>
                <TeamInfoRow>
                  <InfoIcon>
                    <HiMapPin size={16} />
                  </InfoIcon>
                  <InfoLabel>{teamData.matchLocation || "위치 미정"}</InfoLabel>
                </TeamInfoRow>
                <TeamInfoRow>
                  <InfoIcon>
                    <HiUserGroup size={16} />
                  </InfoIcon>
                  <InfoLabel>
                    {teamData.ageRange} · {teamData.teamGender}
                  </InfoLabel>
                </TeamInfoRow>
                <TeamInfoRow>
                  <InfoIcon>
                    <HiHeart size={16} />
                  </InfoIcon>
                  <InfoLabel>
                    내 포지션:{" "}
                    <PositionBadge>{currentTeamInfo?.position}</PositionBadge>
                  </InfoLabel>
                </TeamInfoRow>
              </TeamBasicInfo>
              <SettingsButton
                onClick={() => handleEditClick(currentTeamInfo.teamId)}
              >
                <HiCog6Tooth size={22} />
              </SettingsButton>
            </TeamProfileHeader>
          </TeamProfileCard>

          {/* 빠른 통계 */}
          <QuickStatsGrid>
            <StatCard
              onClick={() => navigate(`/team/${currentTeamInfo.teamId}/member`)}
            >
              <StatIconWrapper color="var(--color-info)">
                <HiUserCircle size={24} />
              </StatIconWrapper>
              <StatContent>
                <StatValue>{teamData.memberCount}</StatValue>
                <StatLabel>선수 수</StatLabel>
              </StatContent>
              <HiChevronRight size={20} color="#ccc" />
            </StatCard>
            <StatCard>
              <StatIconWrapper color="var(--color-success)">
                <HiClipboardDocumentList size={24} />
              </StatIconWrapper>
              <StatContent>
                <StatValue>{teamData.dues.toLocaleString()}원</StatValue>
                <StatLabel>월 회비</StatLabel>
              </StatContent>
            </StatCard>
          </QuickStatsGrid>

          {/* 팀 소개 */}
          <Section>
            <SectionTitle>팀 소개</SectionTitle>
            <IntroduceCard>
              {teamData.team_introduce || "등록된 팀 소개가 없습니다."}
            </IntroduceCard>
          </Section>

          {/* 활동 일정 */}
          <Section>
            <SectionTitle>주요 활동 일정</SectionTitle>
            {teamData?.activitySchedule?.length > 0 ? (
              <ActivityCard>
                <ActivityDay>{teamData.activitySchedule[0][0]}</ActivityDay>
                <ActivityTime>
                  {teamData.activitySchedule[0][1] || "미정"} -{" "}
                  {teamData.activitySchedule[0][2] || "미정"}
                </ActivityTime>
              </ActivityCard>
            ) : (
              <EmptyCard>등록된 활동 일정이 없습니다.</EmptyCard>
            )}
          </Section>

          {/* 공지사항 */}
          <Section>
            <SectionHeader>
              <SectionTitleWithIcon>
                <HiMegaphone color="var(--color-error)" />
                공지사항
              </SectionTitleWithIcon>
              <MoreButton
                onClick={() =>
                  navigate(`/team/${currentTeamInfo.teamId}/notice`)
                }
              >
                더보기 <HiChevronRight size={16} />
              </MoreButton>
            </SectionHeader>
            <NoticeList>
              {noticeList?.length > 0 ? (
                noticeList.slice(0, 3).map((notice, index) => (
                  <NoticeItem
                    key={notice.id}
                    onClick={() => navigateToNoticeDetail(notice.id)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <NoticeContent>
                      <NoticeTitle>{notice.title}</NoticeTitle>
                      <NoticeDate>
                        {new Date(notice.createAt)
                          .toISOString()
                          .split("T")[0]
                          .replace(/-/g, ". ")}
                      </NoticeDate>
                    </NoticeContent>
                    <HiChevronRight size={18} color="#ccc" />
                  </NoticeItem>
                ))
              ) : (
                <EmptyCard>등록된 공지사항이 없습니다.</EmptyCard>
              )}
            </NoticeList>
          </Section>

          {/* 경기 일정 */}
          <Section>
            <SectionHeader>
              <SectionTitleWithIcon>
                <HiCalendarDays color="var(--color-info)" />
                경기 일정
              </SectionTitleWithIcon>
              <MoreButton
                onClick={() =>
                  navigate(`/team/${currentTeamInfo.teamId}/calendar`, {
                    state: { teamName: teamData.teamName },
                  })
                }
              >
                달력보기 <HiChevronRight size={16} />
              </MoreButton>
            </SectionHeader>
            <GameList>
              {gameScheduleList?.length > 0 ? (
                gameScheduleList.map((game, index) => (
                  <GameCard
                    key={game.id}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <GameHeader>
                      <GameDate>{formatDate(game.date)}</GameDate>
                      <DdayBadge dday={calculateDday(game.date)}>
                        {calculateDday(game.date)}
                      </DdayBadge>
                    </GameHeader>
                    <GameDetails>
                      <GameOpponent>vs {game.opponent}</GameOpponent>
                      <GameLocation>
                        <HiMapPin size={14} />
                        {game.location}
                      </GameLocation>
                    </GameDetails>
                  </GameCard>
                ))
              ) : (
                <EmptyCard>등록된 경기 일정이 없습니다.</EmptyCard>
              )}
            </GameList>
          </Section>
        </ContentContainer>
      ) : (
        <EmptyTeamWrapper>
          <EmptyTeamIcon>⚽</EmptyTeamIcon>
          <EmptyTeamTitle>소속된 팀이 없어요</EmptyTeamTitle>
          <EmptyTeamDesc>
            팀에 가입하거나 새로운 팀을 만들어보세요!
          </EmptyTeamDesc>
          <JoinTeamButton onClick={() => navigate("/team/list")}>
            팀 찾아보기
          </JoinTeamButton>
        </EmptyTeamWrapper>
      )}
    </PageWrapper>
  );
};

export default MainPage;

/* ========== Animations ========== */
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/* ========== Styled Components ========== */
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 100px;
`;

const LoadingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60vh;
  gap: 16px;
`;

const LoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid #e8e8e8;
  border-top-color: var(--color-main);
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const LoadingText = styled.p`
  color: var(--color-dark1);
  font-size: 14px;
`;

const ContentContainer = styled.div`
  padding: 16px 20px;
`;

/* Team Profile Card */
const TeamProfileCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  animation: ${fadeInUp} 0.4s ease;
`;

const TeamProfileHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const TeamLogo = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  object-fit: cover;
  background: #f0f0f0;
  flex-shrink: 0;
`;

const TeamBasicInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const TeamInfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: var(--color-dark2);
`;

const InfoIcon = styled.span`
  display: flex;
  align-items: center;
  color: var(--color-main);
`;

const InfoLabel = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const PositionBadge = styled.span`
  background: var(--color-subtle);
  color: var(--color-main);
  font-size: 12px;
  font-family: "Pretendard-Bold";
  padding: 2px 8px;
  border-radius: 4px;
`;

const SettingsButton = styled.button`
  background: #f5f5f5;
  border: none;
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  color: var(--color-dark1);
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-main);
    color: white;
  }
`;

/* Quick Stats */
const QuickStatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 20px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
  transition: all 0.2s ease;
  animation: ${fadeInUp} 0.4s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const StatIconWrapper = styled.div<{ color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: ${(props) => props.color}15;
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatValue = styled.div`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--color-dark1);
`;

/* Sections */
const Section = styled.section`
  margin-bottom: 24px;
  animation: ${fadeInUp} 0.4s ease;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  margin: 0 0 12px 0;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const SectionTitleWithIcon = styled.h2`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  margin: 0;
`;

const MoreButton = styled.button`
  display: flex;
  align-items: center;
  gap: 2px;
  background: none;
  border: none;
  font-size: 13px;
  color: var(--color-dark1);
  cursor: pointer;
  padding: 4px;
`;

const IntroduceCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--color-dark2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ActivityCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const ActivityDay = styled.span`
  background: var(--color-main);
  color: white;
  font-size: 13px;
  font-family: "Pretendard-SemiBold";
  padding: 6px 12px;
  border-radius: 8px;
`;

const ActivityTime = styled.span`
  font-size: 15px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2);
`;

const EmptyCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 32px 20px;
  text-align: center;
  color: var(--color-dark1);
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

/* Notice List */
const NoticeList = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
`;

const NoticeItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: ${fadeInUp} 0.3s ease forwards;
  opacity: 0;

  &:not(:last-child) {
    border-bottom: 1px solid #f5f5f5;
  }

  &:hover {
    background: #fafafa;
  }
`;

const NoticeContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NoticeTitle = styled.div`
  font-size: 14px;
  font-family: "Pretendard-Medium";
  color: var(--color-dark2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
`;

const NoticeDate = styled.div`
  font-size: 12px;
  color: var(--color-dark1);
`;

/* Game List */
const GameList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const GameCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  animation: ${fadeInUp} 0.3s ease forwards;
  opacity: 0;
`;

const GameHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const GameDate = styled.span`
  font-size: 15px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2);
`;

const DdayBadge = styled.span<{ dday: string }>`
  font-size: 12px;
  font-family: "Pretendard-Bold";
  padding: 4px 10px;
  border-radius: 8px;
  background: ${(props) =>
    props.dday === "D-DAY"
      ? "var(--color-error)"
      : props.dday.startsWith("D-")
      ? "#fff0f0"
      : "#f0f0f0"};
  color: ${(props) =>
    props.dday === "D-DAY"
      ? "white"
      : props.dday.startsWith("D-")
      ? "var(--color-error)"
      : "var(--color-dark1)"};
`;

const GameDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const GameOpponent = styled.span`
  font-size: 16px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
`;

const GameLocation = styled.span`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: var(--color-dark1);
`;

/* Empty Team State */
const EmptyTeamWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
`;

const EmptyTeamIcon = styled.div`
  font-size: 56px;
  margin-bottom: 16px;
`;

const EmptyTeamTitle = styled.h2`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  margin-bottom: 8px;
`;

const EmptyTeamDesc = styled.p`
  font-size: 14px;
  color: var(--color-dark1);
  margin-bottom: 24px;
`;

const JoinTeamButton = styled.button`
  background: var(--color-main);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 15px;
  font-family: "Pretendard-SemiBold";
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-main-darker);
  }
`;
