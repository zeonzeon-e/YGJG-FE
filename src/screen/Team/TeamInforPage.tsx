import React, { useEffect, useMemo, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import {
  HiCalendarDays,
  HiCurrencyDollar,
  HiTicket,
  HiUserGroup,
} from "react-icons/hi2";

import Header2 from "../../components/Header/Header2/Header2";
import apiClient from "../../api/apiClient";

interface TeamData {
  activitySchedule: string[] | string | null;
  // activityTime: number[];
  ageRange: string;
  dues: string;
  invitedCode: string;
  matchLocation: string;
  positionRequired: string[] | string | null;
  region: string;
  teamGender: string;
  teamImageUrl: string;
  teamLevel: string;
  teamName: string;
  team_introduce: string;
  town: string;
  memberCount: string;
}

const TeamInfoPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const resolvedTeamId = teamId ?? "13";
  const navigate = useNavigate();

  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeamData = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const response = await apiClient.get(`/api/team/${resolvedTeamId}`);
        setTeamData(response.data);
      } catch (err) {
        console.error("Error fetching team data:", err);
        setHasError(true);
        setTeamData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [resolvedTeamId]);

  const dayLabels = ["월", "화", "수", "목", "금", "토", "일"];

  const scheduleList = useMemo<string[]>(() => {
    if (!teamData) return [];
    const schedule = teamData.activitySchedule;

    if (Array.isArray(schedule)) {
      return schedule.filter(
        (item: string) => !!item && item.length > 0
      );
    }

    if (typeof schedule === "string") {
      return schedule
        .split("|")
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0);
    }

    return [];
  }, [teamData]);

  const positionList = useMemo<string[]>(() => {
    if (!teamData) return [];
    const positions = teamData.positionRequired;

    if (Array.isArray(positions)) {
      return positions.filter(
        (item: string) => !!item && item.length > 0
      );
    }

    if (typeof positions === "string") {
      return positions
        .split(",")
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0);
    }

    return [];
  }, [teamData]);

  return (
    <PageWrapper>
      <Header2 text={teamData?.teamName || "팀 정보"} />

      <HeroSection>
        <HeroContent>
          {isLoading ? (
            <HeroSkeleton>
              <HeroAvatarSkeleton />
              <HeroTextSkeleton>
                <HeroTitleSkeleton />
                <HeroMetaSkeleton />
              </HeroTextSkeleton>
            </HeroSkeleton>
          ) : hasError || !teamData ? (
            <HeroError>
              <HeroErrorTitle>팀 정보를 불러오지 못했어요</HeroErrorTitle>
              <HeroErrorDesc>잠시 후 다시 시도해주세요.</HeroErrorDesc>
            </HeroError>
          ) : (
            <HeroRow>
              <TeamAvatar
                src={teamData.teamImageUrl || "/default-team.png"}
                alt={teamData.teamName}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = "true";
                    target.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72' viewBox='0 0 72 72'%3E%3Crect fill='%23ffffff' fill-opacity='.2' width='72' height='72' rx='18'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23ffffff' fill-opacity='.8' font-size='12'%3ETEAM%3C/text%3E%3C/svg%3E";
                  }
                }}
              />
              <HeroText>
                <HeroTitle>{teamData.teamName}</HeroTitle>
                <HeroMeta>
                  <HeroMetaItem>
                    <FaLocationDot />
                    {teamData.region} {teamData.town}
                  </HeroMetaItem>
                  <HeroMetaItem>
                    <HiUserGroup />
                    {teamData.teamGender} · {teamData.teamLevel}
                  </HeroMetaItem>
                </HeroMeta>
              </HeroText>
            </HeroRow>
          )}
        </HeroContent>
      </HeroSection>

      <ContentContainer>
        {isLoading ? (
          <>
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </>
        ) : hasError || !teamData ? (
          <ErrorCard>
            <ErrorTitle>데이터를 표시할 수 없어요</ErrorTitle>
            <ErrorDesc>네트워크 상태를 확인하고 다시 시도해주세요.</ErrorDesc>
          </ErrorCard>
        ) : (
          <>
            <StatsGrid>
              <StatCard>
                <StatIcon color="var(--color-info)">
                  <HiUserGroup size={18} />
                </StatIcon>
                <StatLabel>팀원</StatLabel>
                <StatValue>{teamData.memberCount}명</StatValue>
              </StatCard>
              <StatCard>
                <StatIcon color="var(--color-warning)">
                  <HiCurrencyDollar size={18} />
                </StatIcon>
                <StatLabel>회비/월</StatLabel>
                <StatValue>{teamData.dues}원</StatValue>
              </StatCard>
              <StatCard>
                <StatIcon color="var(--color-success)">
                  <HiCalendarDays size={18} />
                </StatIcon>
                <StatLabel>주요 일정</StatLabel>
                <StatValue>{scheduleList.length}회</StatValue>
              </StatCard>
              <StatCard>
                <StatIcon color="var(--color-sub)">
                  <HiTicket size={18} />
                </StatIcon>
                <StatLabel>초대코드</StatLabel>
                <StatValue>{teamData.invitedCode || "-"}</StatValue>
              </StatCard>
            </StatsGrid>

            <Card>
              <CardHeader>
                <CardTitle>팀 소개</CardTitle>
              </CardHeader>
              <CardBody>
                <CardText>
                  {teamData.team_introduce || "소개가 없어요."}
                </CardText>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>주요 활동 일정</CardTitle>
              </CardHeader>
              <CardBody>
                {scheduleList.length > 0 ? (
                  <ScheduleList>
                    {scheduleList.map((raw, idx) => {
                      const times = raw.split(",").join(", ");
                      return (
                        <ScheduleRow key={`${raw}-${idx}`}>
                          <DayChip>
                            {dayLabels[idx % dayLabels.length] ?? `${idx + 1}`}
                          </DayChip>
                          <ScheduleText>{times}</ScheduleText>
                        </ScheduleRow>
                      );
                    })}
                  </ScheduleList>
                ) : (
                  <CardMuted>등록된 일정이 없어요.</CardMuted>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>팀 정보</CardTitle>
              </CardHeader>
              <CardBody>
                <InfoGrid>
                  <InfoItem>
                    <InfoLabel>연령대</InfoLabel>
                    <InfoValue>{teamData.ageRange || "-"}</InfoValue>
                  </InfoItem>
                  <InfoItem>
                    <InfoLabel>주 활동 지역</InfoLabel>
                    <InfoValue>{teamData.matchLocation || "-"}</InfoValue>
                  </InfoItem>
                </InfoGrid>

                {positionList.length > 0 && (
                  <ChipSection>
                    <ChipTitle>모집 포지션</ChipTitle>
                    <ChipRow>
                      {positionList.map((pos) => (
                        <Chip key={pos}>{pos}</Chip>
                      ))}
                    </ChipRow>
                  </ChipSection>
                )}
              </CardBody>
            </Card>

            <JoinButton
              onClick={() => navigate(`/team/list/${resolvedTeamId}/join`)}
            >
              팀 가입하기
            </JoinButton>
          </>
        )}
      </ContentContainer>
    </PageWrapper>
  );
};

export default TeamInfoPage;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 100px;
`;

const HeroSection = styled.section`
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-darker) 100%
  );
  padding: 24px 20px 34px;
  border-radius: 0 0 28px 28px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -60%;
    right: -30%;
    width: 320px;
    height: 320px;
    background: rgba(255, 255, 255, 0.06);
    border-radius: 50%;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const TeamAvatar = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 18px;
  object-fit: cover;
  background: rgba(255, 255, 255, 0.15);
  border: 2px solid rgba(255, 255, 255, 0.25);
`;

const HeroText = styled.div`
  min-width: 0;
  flex: 1;
`;

const HeroTitle = styled.h1`
  color: white;
  font-size: 22px;
  font-family: "Pretendard-Bold";
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const HeroMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const HeroMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.85);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  svg {
    flex-shrink: 0;
    color: rgba(255, 255, 255, 0.9);
  }
`;

const ContentContainer = styled.div`
  padding: 0 20px;
  margin-top: -18px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Card = styled.section`
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  overflow: hidden;
`;

const CardHeader = styled.div`
  padding: 16px 16px 0;
`;

const CardTitle = styled.h2`
  font-size: 16px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
`;

const CardBody = styled.div`
  padding: 14px 16px 16px;
`;

const CardText = styled.p`
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-dark2);
  white-space: pre-wrap;
`;

const CardMuted = styled.p`
  font-size: 14px;
  color: var(--color-dark1);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 14px 14px 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 10px;
  row-gap: 4px;
  align-items: center;
`;

const StatIcon = styled.div<{ color: string }>`
  grid-row: 1 / span 2;
  width: 34px;
  height: 34px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(p) => `${p.color}15`};
  color: ${(p) => p.color};
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: var(--color-dark1);
`;

const StatValue = styled.div`
  font-size: 15px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ScheduleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ScheduleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 12px;
  border-radius: 14px;
  background: #f8faf9;
  border: 1px solid #eef1f4;
`;

const DayChip = styled.div`
  width: 40px;
  height: 28px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-family: "Pretendard-Bold";
  color: var(--color-main);
  background: var(--color-subtle);
  flex-shrink: 0;
`;

const ScheduleText = styled.div`
  font-size: 14px;
  color: var(--color-dark2);
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
`;

const InfoLabel = styled.div`
  font-size: 13px;
  color: var(--color-dark1);
  flex-shrink: 0;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: var(--color-dark2);
  font-family: "Pretendard-SemiBold";
  text-align: right;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ChipSection = styled.div`
  margin-top: 14px;
`;

const ChipTitle = styled.div`
  font-size: 13px;
  color: var(--color-dark1);
  margin-bottom: 10px;
`;

const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.div`
  padding: 6px 10px;
  background: #f0f0f0;
  color: var(--color-dark2);
  border-radius: 999px;
  font-size: 12px;
  font-family: "Pretendard-SemiBold";
`;

const JoinButton = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-darker) 100%
  );
  color: white;
  font-size: 16px;
  font-family: "Pretendard-Bold";
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(14, 98, 68, 0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 26px rgba(14, 98, 68, 0.32);
  }

  &:active {
    transform: translateY(0);
  }
`;

const CardSkeleton = styled.div`
  height: 140px;
  border-radius: 18px;
  background: linear-gradient(90deg, #f5f5f5 25%, #eee 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const HeroSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const HeroAvatarSkeleton = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.15);
`;

const HeroTextSkeleton = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HeroTitleSkeleton = styled.div`
  width: 60%;
  height: 18px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.18);
`;

const HeroMetaSkeleton = styled.div`
  width: 80%;
  height: 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.14);
`;

const ErrorCard = styled.div`
  background: white;
  border-radius: 18px;
  padding: 18px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  text-align: center;
`;

const ErrorTitle = styled.div`
  font-size: 15px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  margin-bottom: 8px;
`;

const ErrorDesc = styled.div`
  font-size: 13px;
  color: var(--color-dark1);
`;

const HeroError = styled.div`
  padding: 6px 0 2px;
`;

const HeroErrorTitle = styled.div`
  color: white;
  font-size: 18px;
  font-family: "Pretendard-Bold";
  margin-bottom: 6px;
`;

const HeroErrorDesc = styled.div`
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
`;
