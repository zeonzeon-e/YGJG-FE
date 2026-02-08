import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { format } from "date-fns";
import Header2 from "../../components/Header/Header2/Header2";
import Calendar from "../../components/Calendar/Calendar";
import apiClient from "../../api/apiClient";
import { getAccessToken } from "../../utils/authUtils";
import { useUserStore } from "../../stores/userStore";
import { HiPlus, HiXMark } from "react-icons/hi2";

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
    new Date().toISOString().split("T")[0]
  );
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [canEdit, setCanEdit] = useState(false);

  const userRole = teamId ? getRoleByTeamId(Number(teamId)) : undefined;
  const isManager =
    userRole &&
    ["ROLE_MANAGER", "ROLE_SUBMANAGER", "MANAGER", "SUB_MANAGER"].includes(
      userRole.role
    );
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
            matchStartTime: `${currentYear}-${String(currentMonthNum).padStart(2,"0")}-${day} ${item.matchStartTime.split(" ")[1]}`,
            matchEndTime: `${currentYear}-${String(currentMonthNum).padStart(2,"0")}-${day} ${item.matchEndTime.split(" ")[1]}`,
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
          }
        );
        rawData = response.data;
      }
      console.log('월 데이터',rawData)
      const mappedEvents: CalendarEvent[] = rawData.map((item) => {
        const start = new Date(item.matchStartTime.replace(" ", "T"));
        const end = new Date(item.matchEndTime.replace(" ", "T"));
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
            matchStartTime: `${currentYear}-${String(currentMonthNum).padStart(2,"0")}-${day} ${item.matchStartTime.split(" ")[1]}`,
            matchEndTime: `${currentYear}-${String(currentMonthNum).padStart(2,"0")}-${day} ${item.matchEndTime.split(" ")[1]}`,
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
          }
        );
        rawData = response.data;
      }

      const mappedEvents: CalendarEvent[] = rawData.map((item) => {
        const start = new Date(item.matchStartTime.replace(" ", "T"));
        const end = new Date(item.matchEndTime.replace(" ", "T"));
        const dateStr = selectedDate;
        const startTimeStr = `${String(start.getHours()).padStart(
          2,
          "0"
        )}:${String(start.getMinutes()).padStart(2, "0")}`;
        const endTimeStr = `${String(end.getHours()).padStart(2, "0")}:${String(
          end.getMinutes()
        ).padStart(2, "0")}`;

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
      })
    );
  };
console.log("monthlyEvents",monthlyEvents)
  return (
    <PageWrapper>
      <Header2 text="팀 일정" />

      <CalendarContainer>
        <Calendar 
          events={monthlyEvents} 
          onDateSelect={setSelectedDate}
          onMonthChange={setCurrentMonth}
        />
      </CalendarContainer>

      <ScheduleSection>
        <SectionHeader>
          {new Date(selectedDate).toLocaleDateString("ko-KR", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </SectionHeader>

        {loading ? (
          <EmptyState>일정을 불러오는 중...</EmptyState>
        ) : dailyEvents.length > 0 ? (
          <EventList>
            {dailyEvents.map((event) => (
              <CustomEventCard
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event);
                  setIsDetailModalOpen(true);
                }}
              >
                <CardLeft>
                  <TimeRow>
                    <StatusDot status={event.participation || "NONE"} />
                    <TimeText>
                      {event.startTime}-{event.endTime}
                    </TimeText>
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
                      event.participation === "ATTENDING" ? "active" : "primary"
                    }
                    onClick={(e) => toggleParticipation(e, event.id)}
                  >
                    {event.participation === "ATTENDING"
                      ? "참여 완료"
                      : "참여하기"}
                  </ActionButton>
                </CardRight>
              </CustomEventCard>
            ))}
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
              <DetailRow>
                <Label>일시</Label>
                <Value>
                  {selectedEvent.date} {selectedEvent.startTime} ~{" "}
                  {selectedEvent.endTime}
                </Value>
              </DetailRow>
              <DetailRow>
                <Label>매치업</Label>
                <Value>우리 팀 vs {selectedEvent.opposingTeam}</Value>
              </DetailRow>
              <DetailRow>
                <Label>장소</Label>
                <Value>{selectedEvent.location}</Value>
              </DetailRow>
              {selectedEvent.matchStrategy && (
                <DetailRow>
                  <Label>전략 메모</Label>
                  <StrategyBox>{selectedEvent.matchStrategy}</StrategyBox>
                </DetailRow>
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
  margin-bottom: 16px;
  padding-left: 4px;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

// NEW Custom Card Design based on User Image
const CustomEventCard = styled.div`
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
  bottom:100px;
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
 // padding: 16px 20px;
  border-bottom: 1px solid #eee;
`;
const ModalTitle = styled.h4`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  margin: 0;
`;
const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
`;
const DetailBody = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;
const DetailRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
const Label = styled.div`
  font-size: 13px;
  color: #888;
`;
const Value = styled.div`
  font-size: 16px;
  color: #333;
  font-weight: 500;
`;
const StrategyBox = styled.div`
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  color: #555;
`;
