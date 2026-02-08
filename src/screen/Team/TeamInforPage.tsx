import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import {
  HiMapPin,
  HiUserGroup,
  HiTrophy,
  HiChevronLeft,
  HiShare,
  HiCheckBadge,
  HiCalendarDays,
  HiCurrencyDollar,
} from "react-icons/hi2";
import apiClient from "../../api/apiClient";
import MainButton from "../../components/Button/MainButton";

// --- Types ---
interface TeamData {
  teamId: number;
  teamName: string;
  teamImageUrl: string;
  teamGender: string;
  ageRange: string;
  region: string;
  town: string;
  teamLevel: string;
  memberCount: number;
  dues: number;
  team_introduce: string;
  activitySchedule: any[]; // [day, startTime, endTime][] or similar structure from backend
  positionRequired: string[];
}

// --- Mock Data for Dev/Fallback ---
const MOCK_TEAM_DATA: TeamData = {
  teamId: 1,
  teamName: "FC 개발자들",
  teamImageUrl: "", // Empty string to test fallback
  teamGender: "남성",
  ageRange: "20대~30대",
  region: "서울",
  town: "송파구",
  teamLevel: "아마추어 중급",
  memberCount: 24,
  dues: 30000,
  team_introduce:
    "저희는 개발자 위주로 구성된 풋살 팀입니다. 매주 수요일 저녁 8시부터 10시까지 잠실 풋살장에서 차고 있습니다. 실력보다는 매너와 출석률을 중요하게 생각합니다! 끝나고 맥주 한 잔은 자유입니다 🍺",
  activitySchedule: [["수요일", "20:00", "22:00"]],
  positionRequired: ["GK", "DF"],
};

const TeamInfoPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      try {
        // Use Mock data for specific IDs or if fetch fails in dev
        if (teamId === "1" || !teamId) {
          setTimeout(() => {
            setTeamData(MOCK_TEAM_DATA);
            setLoading(false);
          }, 600);
          return;
        }

        const response = await apiClient.get(`api/team/${teamId}`);
        setTeamData(response.data);
      } catch (err) {
        console.error("Error fetching team data:", err);
        // Fallback to mock on error for demo purposes
        setTeamData(MOCK_TEAM_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId]);

  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner />
      </LoadingWrapper>
    );
  }

  if (!teamData) return <div>팀 정보를 찾을 수 없습니다.</div>;

  return (
    <PageWrapper>
      {/* Header Navigation */}
      <NavHeader>
        <NavButton onClick={() => navigate(-1)}>
          <HiChevronLeft size={24} />
        </NavButton>
        <NavTitle>{teamData.teamName}</NavTitle>
        <NavButton>
          <HiShare size={24} />
        </NavButton>
      </NavHeader>

      <ContentScroll>
        {/* Cover Section */}
        <CoverSection>
          <CoverFilter />
          <CoverContent>
            <TeamLogo
              src={teamData.teamImageUrl || "/default-team.png"}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23e8e8e8' width='100' height='100' rx='20'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='12'%3ETEAM%3C/text%3E%3C/svg%3E";
              }}
            />
            <TeamHeaderInfo>
              <TeamName>{teamData.teamName}</TeamName>
              <TeamTags>
                <Tag>#{teamData.region}</Tag>
                <Tag>#{teamData.teamGender}</Tag>
                <Tag>#{teamData.ageRange}</Tag>
              </TeamTags>
            </TeamHeaderInfo>
          </CoverContent>
        </CoverSection>

        <Container>
          {/* Quick Stats Grid */}
          <StatsGrid>
            <StatItem>
              <StatIconBox color="var(--color-main)">
                <HiUserGroup />
              </StatIconBox>
              <StatLabel>팀원</StatLabel>
              <StatValue>{teamData.memberCount}명</StatValue>
            </StatItem>
            <StatItem>
              <StatIconBox color="#ff922b">
                <HiTrophy />
              </StatIconBox>
              <StatLabel>실력</StatLabel>
              <StatValue>{teamData.teamLevel}</StatValue>
            </StatItem>
            <StatItem>
              <StatIconBox color="#51cf66">
                <HiCurrencyDollar />
              </StatIconBox>
              <StatLabel>회비</StatLabel>
              <StatValue>
                {parseInt(String(teamData.dues)).toLocaleString()}원
              </StatValue>
            </StatItem>
            <StatItem>
              <StatIconBox color="#339af0">
                <HiMapPin />
              </StatIconBox>
              <StatLabel>지역</StatLabel>
              <StatValue>{teamData.town}</StatValue>
            </StatItem>
          </StatsGrid>

          <Divider />

          {/* About Section */}
          <Section>
            <SectionTitle>팀 소개</SectionTitle>
            <Description>{teamData.team_introduce}</Description>
          </Section>

          {/* Schedule Section */}
          <Section>
            <SectionTitle>주요 활동 일정</SectionTitle>
            <ScheduleCard>
              <ScheduleIcon>
                <HiCalendarDays size={20} />
              </ScheduleIcon>
              <ScheduleInfo>
                <ScheduleDay>매주 수요일</ScheduleDay>
                <ScheduleTime>20:00 ~ 22:00</ScheduleTime>
              </ScheduleInfo>
            </ScheduleCard>
            <ScheduleNotice>
              * 경기 일정에 따라 변경될 수 있습니다.
            </ScheduleNotice>
          </Section>

          {/* Recruitment Section */}
          <Section>
            <SectionTitle>
              이런 분을 찾고 있어요
              <BadgeCount>{teamData.positionRequired.length}</BadgeCount>
            </SectionTitle>
            <PositionGrid>
              {teamData.positionRequired.map((pos) => (
                <PositionCard key={pos}>
                  <PositionIcon>{pos}</PositionIcon>
                  <PositionLabel>
                    {pos === "GK"
                      ? "골키퍼"
                      : pos === "FW"
                        ? "공격수"
                        : pos === "MF"
                          ? "미드필더"
                          : "수비수"}
                  </PositionLabel>
                  <HiCheckBadge color="var(--color-main)" />
                </PositionCard>
              ))}
            </PositionGrid>
          </Section>
        </Container>
      </ContentScroll>

      {/* Bottom Action Bar */}
      <BottomAction>
        <MainButton onClick={() => navigate(`/team/list/${teamId}/join`)}>
          가입 신청하기
        </MainButton>
      </BottomAction>
    </PageWrapper>
  );
};

export default TeamInfoPage;

// --- Styled Components ---

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #fff;
  position: relative;
`;

const NavHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f1f3f5;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: #333;
`;

const ContentScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 120px; /* Space for BottomAction */
`;

const LoadingWrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--color-main);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const CoverSection = styled.div`
  position: relative;
  background: linear-gradient(135deg, var(--color-main) 0%, #106c40 100%);
  padding: 40px 20px 30px;
  color: white;
`;

const CoverFilter = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url("https://www.transparenttextures.com/patterns/cubes.png");
  opacity: 0.1;
`;

const CoverContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const TeamLogo = styled.img`
  width: 84px;
  height: 84px;
  border-radius: 24px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  background: white;
  object-fit: cover;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
`;

const TeamHeaderInfo = styled.div`
  text-align: center;
`;

const TeamName = styled.h2`
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 12px;
  letter-spacing: -0.5px;
`;

const TeamTags = styled.div`
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
`;

const Tag = styled.span`
  font-size: 13px;
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
`;

const Container = styled.div`
  padding: 24px 20px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const StatIconBox = styled.div<{ color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: ${(props) => props.color}15;
  color: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: #888;
`;

const StatValue = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: #333;
`;

const Divider = styled.div`
  height: 8px;
  background: #f8f9fa;
  margin: 0 -20px 24px;
`;

const Section = styled.section`
  margin-bottom: 32px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #212529;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BadgeCount = styled.span`
  background: var(--color-main);
  color: white;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
`;

const Description = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: #495057;
  white-space: pre-wrap;
`;

const ScheduleCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 16px;
  border: 1px solid #e9ecef;
`;

const ScheduleIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-main);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const ScheduleInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ScheduleDay = styled.span`
  font-size: 16px;
  font-weight: 700;
  color: #333;
`;

const ScheduleTime = styled.span`
  font-size: 14px;
  color: #666;
  margin-top: 2px;
`;

const ScheduleNotice = styled.p`
  font-size: 12px;
  color: #adb5bd;
  margin-top: 8px;
  margin-left: 4px;
`;

const PositionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const PositionCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  background: white;
`;

const PositionIcon = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: var(--color-main);
  background: var(--color-subtle);
  padding: 4px 8px;
  border-radius: 6px;
`;

const PositionLabel = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: #495057;
`;

const BottomAction = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px 20px 30px;
  border-top: 1px solid #f1f3f5;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  max-width: 600px;
  margin: 0 auto;
  z-index: 1001;
`;
