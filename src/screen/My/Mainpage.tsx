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

// --- 타입 정의 ---
interface GameScheduleItem {
  id: number;
  date: string;
  opponent: string;
  location: string;
}
interface NoticeItem {
  id: number;
  title: string;
  createAt: Date;
  isPinned?: boolean;
}
interface TeamData {
  teamImageUrl: string;
  region: string;
  ageRange: string;
  matchLocation: string;
  playerCount: number;
  dues: number;
  mainActivityDay: string;
  mainActivityStartTime: string;
  mainActivityEndTime: string;
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

const MainPage: React.FC = () => {
  const { teams, isLoading: isAuthLoading } = useAuth();

  const [selectedTeam, setSelectedTeam] = useState<{
    teamId: number;
    teamName: string;
  } | null>(null);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);
  const [gameScheduleList, setGameScheduleList] = useState<GameScheduleItem[]>(
    []
  );
  const [favoriteTeams, setFavoriteTeams] = useState<number[]>([1]);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (teams && teams.length > 0 && !selectedTeam) {
      setSelectedTeam({ teamId: teams[0].teamId, teamName: teams[0].teamName });
    }
  }, [teams, selectedTeam]);

  useEffect(() => {
    if (!selectedTeam) return;

    const fetchPageData = async () => {
      setIsPageLoading(true);
      try {
        const teamId = selectedTeam.teamId;
        const [teamDetailsRes, noticesRes, gamesRes] = await Promise.all([
          apiClient.get<TeamData>(`/api/teams/${teamId}/details`),
          apiClient.get<NoticeItem[]>(`/api/teams/${teamId}/notices`),
          apiClient.get<GameScheduleItem[]>(`/api/teams/${teamId}/games`),
        ]);
        setTeamData(teamDetailsRes.data);
        setNoticeList(noticesRes.data);
        setGameScheduleList(gamesRes.data);
      } catch (error) {
        console.error("Failed to fetch page data:", error);
      } finally {
        setIsPageLoading(false);
      }
    };

    fetchPageData();
  }, [selectedTeam]);

  const handleTeamChange = (teamId: number, teamName: string) =>
    setSelectedTeam({ teamId, teamName });
  const handleEditClick = (teamId: number) => navigate(`/team-edit/${teamId}`);

  // 공지사항 이동을 위한 navigateTo 함수는 유지합니다.
  const navigateToNotice = (path: string) =>
    navigate(path, { state: { teamId: selectedTeam?.teamId } });

  if (isAuthLoading) {
    return <div>사용자 정보 로딩 중...</div>;
  }

  const currentTeamInfo = teams?.find((t) => t.teamId === selectedTeam?.teamId);

  return (
    <>
      <Header3
        selectedTeam={selectedTeam}
        teams={teams || []}
        onTeamChange={handleTeamChange}
        favoriteTeams={favoriteTeams}
        onToggleFavorite={() => {}}
      />
      {isPageLoading ? (
        <LoadingContainer>
          페이지 데이터를 불러오는 중입니다...
        </LoadingContainer>
      ) : teamData && selectedTeam ? (
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
              onClick={() => handleEditClick(selectedTeam.teamId)}
            />
          </ProfileWrapper>

<<<<<<< HEAD
      <Container>
        {teamData && (
          <>
            <ProfileWrapper>
              <TeamProfile>
                <TeamProfileImg src={teamData.teamImageUrl} />
                <TeamProfileInfor>
                  <TeamProfileText>
                    <FaLocationDot size={15} /> 홈그라운드
                    <ColorText>{teamData.region}</ColorText>
                  </TeamProfileText>
                  <TeamProfileText>
                    <FaPeopleGroup /> 연령대{" "}
                    <ColorText>{teamData.ageRange}</ColorText>
                  </TeamProfileText>
                  <TeamProfileText>
                    <FaHeart /> 내 포지션
                  </TeamProfileText>
                </TeamProfileInfor>
              </TeamProfile>
              <TeamProfileSetting
                onClick={() => handleEditClick(selectedTeam.teamId)}
              >
                <IoSettingsSharp size={30} />
              </TeamProfileSetting>
            </ProfileWrapper>
=======
          <StatsWrapper>
            <StatBox
              onClick={() => navigate(`/team/${selectedTeam.teamId}/members`)}
            >
              <span>선수 수</span>
              <strong>{teamData.playerCount}</strong>
              <ArrowSpan>&gt;</ArrowSpan>
            </StatBox>
            <StatBox>
              <span>회비/월</span>
              <strong>{teamData.dues.toLocaleString()}원</strong>
            </StatBox>
          </StatsWrapper>
>>>>>>> master

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

<<<<<<< HEAD
            {/* <>
          <TeamTitle>활동 시간</TeamTitle>
          <TimeWrapper>
        {timeBlock.map((hour, idx) => {
          const isActive = teamData.activityTime.includes(hour); // 활성 상태 확인
          return (
            <TimeItemWrpper>
            <TimeTitle>{hour === 0 ? "오전\n12시" : hour === 12 ? "오후\n12시" : hour === 6||hour === 9||hour === 15||hour === 18||hour === 21||hour === 3 ? `${hour}시` : ""}</TimeTitle>
            <TimeItem key={hour} isActive={isActive}>

            </TimeItem>
            </TimeItemWrpper>

          );
        })}
      </TimeWrapper>
          </> */}

            <TeamDetails className="shadow-df border-df">
              <TeamTitle>
                <div>공지사항</div>
                <div
                  style={{ color: "var(--color-info)" }}
                  className="h5"
                  onClick={() => handleNoticeClick(selectedTeam.teamId)}
                >
                  더보기
                </div>
              </TeamTitle>
              {noticeList.length > 0 ? (
                <NoticeList>
                  {noticeList.slice(0, 2).map((notice) => (
                    <NoticeItem
                      className="shadow-df border-df"
                      key={notice.id}
                      onClick={() =>
                        navigate(`notice/${notice.id}`, {
                          state: {
                            id: notice.id,
                            teamId: selectedTeam.teamId,
                          },
                        })
                      }
                    >
                      <NoticeTitle>{notice.title}</NoticeTitle>
                      <NoticeDate>
                        {new Date(notice.createAt).toLocaleDateString("ko-KR")}
                      </NoticeDate>
                    </NoticeItem>
                  ))}
                </NoticeList>
              ) : (
                <NoticeTitle>결과가 없습니다.</NoticeTitle>
              )}
            </TeamDetails>
            <TeamDetails className="shadow-df border-df">
              <TeamTitle>
                <div>경기일정</div>
                <div
                  style={{ color: "var(--color-info)" }}
                  className="h5"
                  onClick={(e) => {
                    e.stopPropagation();
                    // 팀 달력으로 이동하는 로직 구현
                    navigate(`/team/${selectedTeam.teamId}/calendar`);
                  }}
                >
                  달력보기
                </div>
              </TeamTitle>
            </TeamDetails>
          </>
        )}
      </Container>
=======
          <Section>
            <SectionHeader>
              <SectionTitle>공지사항</SectionTitle>
              <MoreLink onClick={() => navigateToNotice("notice")}>
                더보기
              </MoreLink>
            </SectionHeader>
            <NoticeList>
              {noticeList && noticeList.length > 0 ? (
                noticeList.slice(0, 3).map((notice) => (
                  <NoticeItem
                    key={notice.id}
                    onClick={() => navigateToNotice(`notice/${notice.id}`)}
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
                  navigate(`/team/${selectedTeam.teamId}/calendar`, {
                    state: { teamName: selectedTeam.teamName },
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
>>>>>>> master
    </>
  );
};

export default MainPage;

// --- Styled Components (이전과 동일) ---
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
<<<<<<< HEAD
  justify-content: space-between;
  margin-top: 10px;
`;
const TeamProfile = styled.div`
  display: flex;
  justify-content: space-around;
`;
const TeamTitle = styled.div`
  display: flex;
  justify-content: space-between;
=======
>>>>>>> master
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`;
<<<<<<< HEAD
const TeamProfileImg = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-left: 30px;
=======
const ProfileImage = styled.img`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
>>>>>>> master
`;
const ProfileInfo = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
<<<<<<< HEAD
  margin-left: 50px;
  gap: 10px;
  color: var(--color-dark2);
`;
const TeamProfileText = styled.div`
  font-size: 16px;
  align-items: center;
  display: flex;
  gap: 5px;
`;
const TeamProfileSetting = styled.div`
  right: 0;
`;

const ColorText = styled.span`
  color: var(--color-main);
`;

const ItemWrapper = styled.div`
=======
  gap: 6px;
`;
const InfoText = styled.span`
>>>>>>> master
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
  border: 1px solid #eee;
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
  justify-content: space-between;
  padding: 16px;
  background-color: #f7f7f7;
  border-radius: 12px;
  border: 1px solid #eee;
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
  padding: 8px;
  margin: 0;
  background-color: #fff;
  border-radius: 12px;
  border: 1px solid #eee;
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
  border: 1px solid #eee;
`;
const NoDataBox = styled(NoDataText)`
  background-color: #fff;
  border: 1px solid #eee;
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
