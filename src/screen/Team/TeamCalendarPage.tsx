import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  format,
  differenceInDays,
  isToday,
  isPast,
  startOfDay,
} from "date-fns";
import Header2 from "../../components/Header/Header2/Header2";
import Calendar from "../../components/Calendar/Calendar";
import apiClient from "../../api/apiClient";
import { getAccessToken } from "../../utils/authUtils";
import { useUserStore } from "../../stores/userStore";
import {
  HiPlus,
  HiXMark,
  HiCalendar,
  HiMapPin,
  HiUserGroup,
  HiClipboardDocumentList,
  HiClock,
  HiChevronRight,
} from "react-icons/hi2";

// --- Utility Functions ---
const getDDayText = (
  dateStr: string,
): { text: string; type: "today" | "upcoming" | "past" | "future" } => {
  const eventDate = startOfDay(new Date(dateStr));
  const today = startOfDay(new Date());
  const diff = differenceInDays(eventDate, today);

  if (isToday(eventDate)) {
    return { text: "D-Day", type: "today" };
  } else if (diff > 0 && diff <= 7) {
    return { text: `D-${diff}`, type: "upcoming" };
  } else if (diff > 7) {
    return { text: `${diff}일 후`, type: "future" };
  } else {
    return { text: "완료", type: "past" };
  }
};

const getEventStatus = (dateStr: string): "today" | "upcoming" | "past" => {
  const eventDate = startOfDay(new Date(dateStr));
  const today = startOfDay(new Date());

  if (isToday(eventDate)) return "today";
  if (isPast(eventDate)) return "past";
  return "upcoming";
};

// --- Types ---
interface ScheduleApiData {
  id: number;
  matchStartTime: string;
  matchEndTime: string;
  opposingTeam: string;
  team: string;
  matchLocation?: string;
  address?: string;
  matchStrategy?: string;
}

interface CalendarEvent {
  id: number;
  date: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  teamId: number;
  color: string; // Required
  opposingTeam: string;
  matchStrategy?: string;
  // UI ONLY: Participation Status (Attending, Absent, None)
  participation?: "ATTENDING" | "ABSENT" | "NONE";
}

// --- Mock Data ---
const DEV_MOCK_SCHEDULES: ScheduleApiData[] = [
  {
    id: 1,
    matchStartTime: "2024-05-15 14:00:00",
    matchEndTime: "2024-05-15 16:00:00",
    opposingTeam: "FC 바르셀로나",
    team: "FC 개발자들",
    address: "상암 월드컵 보조경기장",
    matchStrategy: "패스 위주의 점유율 축구",
  },
  {
    id: 2,
    matchStartTime: "2024-05-20 19:00:00",
    matchEndTime: "2024-05-20 21:00:00",
    opposingTeam: "맨체스터 시티",
    team: "FC 개발자들",
    address: "잠실 풋살장 A구장",
    matchStrategy: "강한 압박과 역습",
  },
  {
    id: 3,
    matchStartTime: "2024-05-25 10:00:00",
    matchEndTime: "2024-05-25 12:00:00",
    opposingTeam: "자체 청백전",
    team: "FC 개발자들",
    address: "한강공원 축구장",
    matchStrategy: "즐겜 모드",
  },
];

const TeamCalendarPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const getRoleByTeamId = useUserStore((state) => state.getRoleByTeamId);
  const [monthlyEvents, setMonthlyEvents] = useState<CalendarEvent[]>([]); // For Calendar dots
  const [dailyEvents, setDailyEvents] = useState<CalendarEvent[]>([]); // For List below
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null,
  );
  const [canEdit, setCanEdit] = useState(false);

  const userRole = teamId ? getRoleByTeamId(Number(teamId)) : undefined;
  const isManager =
    userRole &&
    ["ROLE_MANAGER", "MANAGER", "SUB_MANAGER"].includes(userRole.role);
  const isDevMode = getAccessToken()?.startsWith("dev-");

  useEffect(() => {
    setCanEdit(Boolean(isManager || isDevMode));
  }, [isManager, isDevMode]);
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (isDetailModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow || "";
    }
    return () => {
      document.body.style.overflow = originalOverflow || "";
    };
  }, [isDetailModalOpen]);

  // 1. Fetch Monthly Schedules (For Calendar Dots)
  const fetchMonthlySchedules = async () => {
    if (!teamId) return;

    try {
      const token = getAccessToken();
      let rawData: ScheduleApiData[] = [];

      if (token?.startsWith("dev-")) {
        // ... (Dev mock logic if needed, skipping for brevity or keeping same as before but for month)
        // For now, let's just reuse the same mock logic or rely on real API
        // To match previous dev logic:
        await new Promise((resolve) => setTimeout(resolve, 300));
        const today = new Date();
        const currentMonthNum = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        rawData = DEV_MOCK_SCHEDULES.map((item, idx) => {
          const day = 15 + idx * 5;
          return {
            ...item,
            matchStartTime: `${currentYear}-${String(currentMonthNum).padStart(2, "0")}-${day} ${item.matchStartTime.split(" ")[1]}`,
            matchEndTime: `${currentYear}-${String(currentMonthNum).padStart(2, "0")}-${day} ${item.matchEndTime.split(" ")[1]}`,
          };
        });
      } else {
        const response = await apiClient.get<ScheduleApiData[]>(
          `/api/team-strategy/get-strategy/monthly`,
          {
            params: {
              date: format(currentMonth, "yyyy-MM"),
              teamId,
            },
          },
        );
        rawData = response.data;
      }
      console.log("월 데이터", rawData);
      const mappedEvents: CalendarEvent[] = rawData.map((item) => {
        const start = new Date(item.matchStartTime.replace(" ", "T"));
        // For monthly view, we need the actual date of the event
        const dateStr = start.toISOString().split("T")[0];

        return {
          id: item.id,
          date: dateStr,
          title: `vs ${item.opposingTeam}`,
          startTime: "", // Not needed for dots
          endTime: "",
          location: "",
          teamId: Number(teamId),
          color: "#0e6244",
          opposingTeam: item.opposingTeam,
          matchStrategy: "",
          participation: "NONE",
        };
      });

      setMonthlyEvents(mappedEvents);
    } catch (error) {
      console.error("월간 일정 로드 실패:", error);
    }
  };

  // 2. Fetch Daily Schedules (For List)
  const fetchDailySchedules = async () => {
    if (!teamId) return;
    setLoading(true);

    try {
      const token = getAccessToken();
      let rawData: ScheduleApiData[] = [];

      if (token?.startsWith("dev-")) {
        // ... (Dev mock logic)
        await new Promise((resolve) => setTimeout(resolve, 300));
        // Return same mock data for simplicity in dev mode
        const today = new Date();
        const currentMonthNum = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        rawData = DEV_MOCK_SCHEDULES.map((item, idx) => {
          const day = 15 + idx * 5;
          return {
            ...item,
            matchStartTime: `${currentYear}-${String(currentMonthNum).padStart(2, "0")}-${day} ${item.matchStartTime.split(" ")[1]}`,
            matchEndTime: `${currentYear}-${String(currentMonthNum).padStart(2, "0")}-${day} ${item.matchEndTime.split(" ")[1]}`,
          };
        });
        // Filter manually for dev mock
        // rawData = rawData.filter(...)
      } else {
        const response = await apiClient.get<ScheduleApiData[]>(
          `/api/team-strategy/get-strategy/monthly-day`,
          {
            params: {
              date: selectedDate,
              teamId,
            },
          },
        );
        rawData = response.data;
      }

      const mappedEvents: CalendarEvent[] = rawData.map((item) => {
        const dateStr = selectedDate;

        // 시간 파싱 헬퍼 함수: 다양한 형식 지원
        const parseTimeString = (timeValue: string): string => {
          if (!timeValue) return "";

          // 이미 "HH:MM" 형식인지 확인
          const timeOnlyRegex = /^(\d{1,2}):(\d{2})$/;
          const timeMatch = timeValue.match(timeOnlyRegex);
          if (timeMatch) {
            const hours = timeMatch[1].padStart(2, "0");
            const minutes = timeMatch[2];
            return `${hours}:${minutes}`;
          }

          // "YYYY-MM-DD HH:MM:SS" 또는 ISO 형식 시도
          const dateTimeStr = timeValue.replace(" ", "T");
          const date = new Date(dateTimeStr);
          if (!isNaN(date.getTime())) {
            return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
          }

          // 파싱 실패 시 빈 문자열 반환
          return "";
        };

        const startTimeStr = parseTimeString(item.matchStartTime);
        const endTimeStr = parseTimeString(item.matchEndTime);

        return {
          id: item.id,
          date: dateStr,
          title: `vs ${item.opposingTeam}`,
          startTime: startTimeStr,
          endTime: endTimeStr,
          location: item.address || item.matchLocation || "장소 미정",
          teamId: Number(teamId),
          color: "#0e6244",
          opposingTeam: item.opposingTeam,
          matchStrategy: item.matchStrategy,
          participation: "NONE", // Default value
        };
      });
      setDailyEvents(mappedEvents);
    } catch (error) {
      console.error("일간 일정 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonthlySchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, currentMonth]);

  useEffect(() => {
    fetchDailySchedules();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, selectedDate]);

  const toggleParticipation = (e: React.MouseEvent, eventId: number) => {
    e.stopPropagation();
    setDailyEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const nextStatus =
            ev.participation === "ATTENDING" ? "NONE" : "ATTENDING";
          return { ...ev, participation: nextStatus };
        }
        return ev;
      }),
    );
  };

  // 다가오는 경기 계산 (오늘 이후 가장 가까운 경기)
  const upcomingMatch = useMemo(() => {
    const today = startOfDay(new Date());
    const futureEvents = monthlyEvents
      .filter((event) => {
        const eventDate = startOfDay(new Date(event.date));
        return eventDate >= today;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return futureEvents[0] || null;
  }, [monthlyEvents]);

  // 이번 달 경기 통계
  const monthStats = useMemo(() => {
    const today = startOfDay(new Date());
    const total = monthlyEvents.length;
    const remaining = monthlyEvents.filter((event) => {
      const eventDate = startOfDay(new Date(event.date));
      return eventDate >= today;
    }).length;
    const completed = total - remaining;

    return { total, remaining, completed };
  }, [monthlyEvents]);

  console.log("monthlyEvents", monthlyEvents);
  return (
    <PageWrapper>
      <Header2 text="팀 일정" />

      {/* 다가오는 경기 하이라이트 섹션 */}
      {upcomingMatch && (
        <UpcomingMatchSection
          onClick={() => {
            setSelectedDate(upcomingMatch.date);
            setSelectedEvent(upcomingMatch);
            setIsDetailModalOpen(true);
          }}
        >
          <UpcomingMatchHeader>
            <UpcomingLabel>
              <HiClock />
              <span>다음 경기</span>
            </UpcomingLabel>
            <UpcomingDDay $type={getDDayText(upcomingMatch.date).type}>
              {getDDayText(upcomingMatch.date).text}
            </UpcomingDDay>
          </UpcomingMatchHeader>
          <UpcomingMatchContent>
            <UpcomingMatchInfo>
              <UpcomingOpponent>
                vs {upcomingMatch.opposingTeam}
              </UpcomingOpponent>
              <UpcomingDate>
                {new Date(upcomingMatch.date).toLocaleDateString("ko-KR", {
                  month: "long",
                  day: "numeric",
                  weekday: "short",
                })}
              </UpcomingDate>
            </UpcomingMatchInfo>
            <HiChevronRight style={{ color: "#0e6244", fontSize: "20px" }} />
          </UpcomingMatchContent>
        </UpcomingMatchSection>
      )}

      <CalendarContainer>
        <Calendar
          events={monthlyEvents}
          onDateSelect={setSelectedDate}
          onMonthChange={setCurrentMonth}
        />
      </CalendarContainer>

      <ScheduleSection>
        <SectionHeaderRow>
          <SectionHeader>
            {new Date(selectedDate).toLocaleDateString("ko-KR", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </SectionHeader>
          {monthStats.total > 0 && (
            <MonthStats>
              이번 달 <strong>{monthStats.remaining}</strong>경기 남음
            </MonthStats>
          )}
        </SectionHeaderRow>

        {loading ? (
          <EmptyState>일정을 불러오는 중...</EmptyState>
        ) : dailyEvents.length > 0 ? (
          <EventList>
            {dailyEvents.map((event) => {
              const eventStatus = getEventStatus(event.date);
              const dDay = getDDayText(event.date);

              return (
                <CustomEventCard
                  key={event.id}
                  $status={eventStatus}
                  onClick={() => {
                    setSelectedEvent(event);
                    setIsDetailModalOpen(true);
                  }}
                >
                  <CardLeft>
                    <TimeRow>
                      <StatusDot status={event.participation || "NONE"} />
                      <TimeText>
                        {event.startTime && event.endTime
                          ? `${event.startTime} - ${event.endTime}`
                          : "시간 미정"}
                      </TimeText>
                      <DDayBadge $type={dDay.type}>{dDay.text}</DDayBadge>
                    </TimeRow>
                    <TitleText>
                      vs <OpponentName>{event.opposingTeam}</OpponentName>
                    </TitleText>
                  </CardLeft>

                  <CardRight>
                    <ActionButton
                      className="secondary"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                        setIsDetailModalOpen(true);
                      }}
                    >
                      전략 보기
                    </ActionButton>
                    <ActionButton
                      className={
                        event.participation === "ATTENDING"
                          ? "active"
                          : "primary"
                      }
                      onClick={(e) => toggleParticipation(e, event.id)}
                    >
                      {event.participation === "ATTENDING"
                        ? "참여 완료"
                        : "참여하기"}
                    </ActionButton>
                  </CardRight>
                </CustomEventCard>
              );
            })}
          </EventList>
        ) : (
          <EmptyState>
            <EmptyIcon>😴</EmptyIcon>
            <EmptyText>일정이 없는 조용한 하루네요.</EmptyText>
          </EmptyState>
        )}
      </ScheduleSection>

      {canEdit && (
        <FloatingActionButton
          onClick={() =>
            navigate(`/manager/${teamId}/team-strategy/create`, {
              state: { selectedDate },
            })
          }
        >
          <HiPlus />
        </FloatingActionButton>
      )}

      {/* Modals are represented with the same structure but simplified for brevity in this full file write */}
      {isDetailModalOpen && selectedEvent && (
        <ModalOverlay
          onClick={() => setIsDetailModalOpen(false)}
          role="presentation"
        >
          <DetailModalContent
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <ModalHeader>
              <ModalTitle>경기 상세 정보</ModalTitle>
              <CloseBtn onClick={() => setIsDetailModalOpen(false)}>
                <HiXMark />
              </CloseBtn>
            </ModalHeader>
            <DetailBody>
              <DetailSection>
                <DetailItem>
                  <DetailIconWrapper $variant="calendar">
                    <HiCalendar />
                  </DetailIconWrapper>
                  <DetailContent>
                    <DetailLabel>일시</DetailLabel>
                    <DetailValue>
                      {selectedEvent.date}
                      {selectedEvent.startTime && selectedEvent.endTime
                        ? ` / ${selectedEvent.startTime} - ${selectedEvent.endTime}`
                        : " 시간 미정"}
                    </DetailValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIconWrapper $variant="team">
                    <HiUserGroup />
                  </DetailIconWrapper>
                  <DetailContent>
                    <DetailLabel>매치업</DetailLabel>
                    <MatchupValue>
                      <TeamName>우리 팀</TeamName>
                      <VsText>VS</VsText>
                      <TeamName $isOpponent>
                        #{selectedEvent.opposingTeam}
                      </TeamName>
                    </MatchupValue>
                  </DetailContent>
                </DetailItem>

                <DetailItem>
                  <DetailIconWrapper $variant="location">
                    <HiMapPin />
                  </DetailIconWrapper>
                  <DetailContent>
                    <DetailLabel>장소</DetailLabel>
                    <DetailValue>
                      {selectedEvent.location || "장소 미정"}
                    </DetailValue>
                  </DetailContent>
                </DetailItem>
              </DetailSection>

              {selectedEvent.matchStrategy && (
                <StrategySection>
                  <StrategyHeader>
                    <HiClipboardDocumentList />
                    <span>전략 메모</span>
                  </StrategyHeader>
                  <StrategyBox>{selectedEvent.matchStrategy}</StrategyBox>
                </StrategySection>
              )}
            </DetailBody>
          </DetailModalContent>
        </ModalOverlay>
      )}
    </PageWrapper>
  );
};

export default TeamCalendarPage;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafb;
  position: relative;
  padding-bottom: 80px;
`;

// 다가오는 경기 하이라이트 섹션
const UpcomingMatchSection = styled.div`
  margin: 16px;
  padding: 16px 20px;
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #a5d6a7;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 98, 68, 0.15);
  }
`;

const UpcomingMatchHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const UpcomingLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #2e7d32;
`;

const UpcomingDDay = styled.span<{
  $type: "today" | "upcoming" | "past" | "future";
}>`
  font-size: 12px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 12px;

  ${({ $type }) => {
    switch ($type) {
      case "today":
        return `background: #d32f2f; color: white;`;
      case "upcoming":
        return `background: #0e6244; color: white;`;
      case "past":
        return `background: #9e9e9e; color: white;`;
      default:
        return `background: #1565c0; color: white;`;
    }
  }}
`;

const UpcomingMatchContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UpcomingMatchInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const UpcomingOpponent = styled.span`
  font-size: 17px;
  font-family: "Pretendard-Bold";
  color: #1b5e20;
`;

const UpcomingDate = styled.span`
  font-size: 13px;
  color: #388e3c;
`;

// 섹션 헤더
const SectionHeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
`;

const MonthStats = styled.span`
  font-size: 13px;
  color: #666;

  strong {
    color: #0e6244;
    font-family: "Pretendard-Bold";
  }
`;

const CalendarContainer = styled.div`
  background: white;
  padding-bottom: 20px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  z-index: 10;
  position: relative;
`;

const ScheduleSection = styled.div`
  padding: 24px 16px;
`;

const SectionHeader = styled.h3`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  color: #333;
  margin: 0;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// D-Day 배지
const DDayBadge = styled.span<{
  $type: "today" | "upcoming" | "past" | "future";
}>`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  margin-left: auto;

  ${({ $type }) => {
    switch ($type) {
      case "today":
        return `background: #ffebee; color: #c62828;`;
      case "upcoming":
        return `background: #e8f5e9; color: #2e7d32;`;
      case "past":
        return `background: #f5f5f5; color: #9e9e9e;`;
      default:
        return `background: #e3f2fd; color: #1565c0;`;
    }
  }}
`;

// NEW Custom Card Design based on User Image
const CustomEventCard = styled.div<{ $status?: "today" | "upcoming" | "past" }>`
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 16px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 0.2s ease;

  ${({ $status }) => {
    switch ($status) {
      case "today":
        return `
          border-color: #0e6244;
          border-width: 2px;
          background: linear-gradient(135deg, #ffffff 0%, #f0fdf5 100%);
        `;
      case "past":
        return `
          opacity: 0.6;
          background: #fafafa;
        `;
      default:
        return "";
    }
  }}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }
`;

const CardLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const TimeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StatusDot = styled.div<{ status: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid
    ${(props) => (props.status === "ATTENDING" ? "#00c853" : "#bbb")};
  background-color: transparent;
`;

const TimeText = styled.span`
  color: #888;
  font-size: 14px;
  font-weight: 500;
`;

const TitleText = styled.div`
  font-size: 17px;
  color: #333;
`;

const OpponentName = styled.span`
  font-family: "Pretendard-Bold";
`;

const CardRight = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  border: none;
  border-radius: 20px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;

  &.primary {
    background-color: #0e6244;
    color: white;
  }

  &.secondary {
    background-color: #0e6244;
    color: white;
  }

  &.active {
    background-color: #fff;
    color: #0e6244;
    border: 1px solid #0e6244;
  }

  &:hover {
    opacity: 0.9;
  }
`;

// ... Other Styles (EmptyState, FAB, Modal) same as before but ensured to be included ...
const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  gap: 12px;
`;
const EmptyIcon = styled.div`
  font-size: 40px;
`;
const EmptyText = styled.p`
  color: #999;
  font-size: 15px;
`;
const FloatingActionButton = styled.button`
  position: fixed;
  bottom: 100px;
  right: 25px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-main);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(14, 98, 68, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  z-index: 100;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 20px 20px 100px;
  overflow-y: auto;
`;
const ModalBase = styled.div`
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 320px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;
const DetailModalContent = styled(ModalBase)`
  max-height: 90vh;
  overflow-y: auto;
`;
const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
  background: linear-gradient(135deg, #0e6244 0%, #0a4d35 100%);
`;
const ModalTitle = styled.h4`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  margin: 0;
  color: white;
`;
const CloseBtn = styled.button`
  background: rgba(255, 255, 255, 0.2);
  border: none;
  font-size: 20px;
  color: white;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;
const DetailBody = styled.div`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const DetailItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 14px;
`;

const DetailIconWrapper = styled.div<{
  $variant: "calendar" | "team" | "location";
}>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-size: 18px;

  ${({ $variant }) => {
    switch ($variant) {
      case "calendar":
        return `
          background: #e8f5e9;
          color: #2e7d32;
        `;
      case "team":
        return `
          background: #e3f2fd;
          color: #1565c0;
        `;
      case "location":
        return `
          background: #fff3e0;
          color: #ef6c00;
        `;
      default:
        return `
          background: #f5f5f5;
          color: #666;
        `;
    }
  }}
`;

const DetailContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
  min-width: 0;
`;

const DetailLabel = styled.span`
  font-size: 12px;
  color: #888;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const DetailValue = styled.span`
  font-size: 15px;
  color: #333;
  font-weight: 500;
  line-height: 1.4;
`;

const MatchupValue = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const TeamName = styled.span<{ $isOpponent?: boolean }>`
  font-size: 15px;
  font-family: "Pretendard-Bold";
  color: ${({ $isOpponent }) => ($isOpponent ? "#d32f2f" : "#0e6244")};
`;

const VsText = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #999;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 4px;
`;

const StrategySection = styled.div`
  margin-top: 4px;
  padding-top: 20px;
  border-top: 1px dashed #e0e0e0;
`;

const StrategyHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #0e6244;

  svg {
    font-size: 18px;
  }
`;

const StrategyBox = styled.div`
  background: linear-gradient(135deg, #f8faf9 0%, #f0f4f2 100%);
  padding: 16px;
  border-radius: 12px;
  font-size: 14px;
  color: #444;
  line-height: 1.6;
  border-left: 3px solid #0e6244;
`;
