import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { HiMapPin, HiClock } from "react-icons/hi2";

import Header2 from "../../components/Header/Header2/Header2";
import Calendar from "../../components/Calendar/Calendar";
import apiClient from "../../api/apiClient";
import { getAccessToken } from "../../utils/authUtils";

interface CalendarEvent {
  id: number;
  date: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  teamId: number;
  teamName: string;
  teamColor: string;
}

// Dev Mock Data
const DEV_MOCK_EVENTS: CalendarEvent[] = [
  {
    id: 1,
    date: new Date().toISOString().split("T")[0],
    title: "FC 개발자들 정기 훈련",
    startTime: "19:00",
    endTime: "21:00",
    location: "서울 월드컵 경기장 보조구장",
    teamId: 1,
    teamName: "FC 개발자들",
    teamColor: "#0e6244",
  },
  {
    id: 2,
    date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0], // 2 days later
    title: "친선 경기 vs 디자이너 유나이티드",
    startTime: "14:00",
    endTime: "16:00",
    location: "망원 유수지 체육공원",
    teamId: 1,
    teamName: "FC 개발자들",
    teamColor: "#0e6244",
  },
  {
    id: 3,
    date: new Date(Date.now() - 86400000).toISOString().split("T")[0], // Yesterday
    title: "테스트 유나이티드 회식",
    startTime: "18:00",
    endTime: "20:00",
    location: "홍대 입구",
    teamId: 2,
    teamName: "테스트 유나이티드",
    teamColor: "#3b82f6",
  },
];

const PersonalCalendarPage: React.FC = () => {
  const [allEvents, setAllEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Format Date for Header
  const formattedDateHeader = new Date(selectedDate).toLocaleDateString(
    "ko-KR",
    {
      month: "long",
      day: "numeric",
      weekday: "long",
    }
  );

  useEffect(() => {
    const fetchAllMyEvents = async () => {
      setIsLoading(true);
      const token = getAccessToken();

      // Dev Mock Bypass
      if (token?.startsWith("dev-")) {
        await new Promise((resolve) => setTimeout(resolve, 600));
        setAllEvents(DEV_MOCK_EVENTS);
        setIsLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<CalendarEvent[]>(
          "/api/my/calendar"
        );
        setAllEvents(response.data);
      } catch (error) {
        console.error("전체 일정을 불러오는 데 실패했습니다.", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllMyEvents();
  }, []);

  const filteredEvents = allEvents.filter(
    (event) => event.date === selectedDate
  );

  const calendarDisplayEvents = allEvents.map((event) => ({
    ...event,
    color: event.teamColor,
  }));

  return (
    <PageWrapper>
      <Header2 text="내 경기 일정" />

      <ScrollArea>
        <CalendarSection>
          <Calendar
            events={calendarDisplayEvents}
            onDateSelect={setSelectedDate}
          />
        </CalendarSection>

        <ScheduleListContainer>
          <ListHeader>
            <DateTitle>{formattedDateHeader}</DateTitle>
            <EventCount>{filteredEvents.length}개의 일정</EventCount>
          </ListHeader>

          {isLoading ? (
            <LoadingState>일정을 불러오는 중입니다...</LoadingState>
          ) : filteredEvents.length > 0 ? (
            <EventsGrid>
              {filteredEvents.map((event) => (
                <EventCard key={event.id} teamColor={event.teamColor}>
                  <CardHeader>
                    <TeamBadge color={event.teamColor}>
                      {event.teamName}
                    </TeamBadge>
                    <TimeBadge>
                      <HiClock />
                      {event.startTime} - {event.endTime}
                    </TimeBadge>
                  </CardHeader>

                  <EventContent>
                    <EventTitle>{event.title}</EventTitle>
                    {event.location && (
                      <LocationRow>
                        <HiMapPin />
                        {event.location}
                      </LocationRow>
                    )}
                  </EventContent>
                </EventCard>
              ))}
            </EventsGrid>
          ) : (
            <EmptyState>
              <EmptyIcon>📅</EmptyIcon>
              <EmptyText>선택한 날짜에 예정된 일정이 없습니다.</EmptyText>
            </EmptyState>
          )}
        </ScheduleListContainer>
      </ScrollArea>
    </PageWrapper>
  );
};

export default PersonalCalendarPage;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafb;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
`;

const ScrollArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
`;

const CalendarSection = styled.div`
  background: white;
  padding: 0 16px 24px 16px;
  border-bottom-left-radius: 24px;
  border-bottom-right-radius: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
  margin-bottom: 24px;
  z-index: 10;
  position: relative;
`;

const ScheduleListContainer = styled.div`
  padding: 0 20px;
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const DateTitle = styled.h2`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  color: #333;
`;

const EventCount = styled.span`
  font-size: 13px;
  color: #888;
  background: #fff;
  padding: 4px 10px;
  border-radius: 12px;
  border: 1px solid #eee;
`;

const EventsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const EventCard = styled.div<{ teamColor?: string }>`
  background: white;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
  position: relative;
  overflow: hidden;
  transition: transform 0.2s;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background-color: ${(props) => props.teamColor || "#ccc"};
  }

  &:hover {
    transform: translateY(-2px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const TeamBadge = styled.span<{ color: string }>`
  font-size: 11px;
  font-weight: 700;
  color: ${(props) => props.color};
  background: ${(props) => `${props.color}15`}; // 15% opacity
  padding: 4px 8px;
  border-radius: 6px;
`;

const TimeBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #888;
  font-family: "Pretendard-SemiBold";

  svg {
    font-size: 14px;
  }
`;

const EventContent = styled.div`
  padding-left: 4px;
`;

const EventTitle = styled.h3`
  font-size: 16px;
  font-family: "Pretendard-Bold";
  color: #333;
  margin-bottom: 6px;
`;

const LocationRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #666;

  svg {
    color: #999;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px;
  color: #aaa;
  font-size: 14px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 40px;
`;

const EmptyText = styled.p`
  color: #999;
  font-size: 14px;
`;
