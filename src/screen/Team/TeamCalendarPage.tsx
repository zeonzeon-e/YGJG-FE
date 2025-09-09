import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header2 from "../../components/Header/Header2/Header2";
import Calendar from "../../components/Calendar/Calendar";
import { useAuth } from "../../hooks/useAuth";
import apiClient from "../../api/apiClient";
import { TeamRole } from "../../stores/userStore"; // TeamRole 타입 임포트

// 데이터 타입을 명확하게 정의합니다.
interface CalendarEvent {
  id: number;
  date: string;
  title: string;
  startTime: string;
  endTime: string;
  location?: string;
  teamId: number;
}

const TeamCalendarPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  // 이전 페이지에서 teamName을 전달받지 못한 경우를 대비하여 기본값 설정
  const teamName = location.state?.teamName || "팀";

  const { getRoleByTeamId } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  useEffect(() => {
    const fetchTeamEvents = async () => {
      if (!teamId) return;
      setIsLoading(true);
      try {
        const response = await apiClient.get<CalendarEvent[]>(
          `/api/teams/${teamId}/calendar`
        );
        setEvents(response.data);
      } catch (error) {
        console.error("팀 일정을 불러오는 데 실패했습니다.", error);
        // 필요시 에러 처리 UI 추가
      } finally {
        setIsLoading(false);
      }
    };
    fetchTeamEvents();
  }, [teamId]);

  const handleAddSchedule = () => {
    // 일정 추가 페이지로 이동하는 로직
    // navigate(`/team/${teamId}/calendar/new`);
    alert("일정 추가 기능 구현 예정");
  };

  const filteredEvents = events.filter((event) => event.date === selectedDate);

  const userRole = getRoleByTeamId(Number(teamId));
  const isAdmin =
    userRole?.role === "MANAGER" || userRole?.role === "SUB_MANAGER";

  return (
    <PageContainer>
      <Header2 text={`${teamName} 경기 일정`} />

      <CalendarContainer>
        <Calendar
          events={events.map((e) => ({ ...e, color: "#0e6244" }))}
          onDateSelect={setSelectedDate}
        />
      </CalendarContainer>

      <ScheduleListContainer>
        <ScheduleHeader>
          {new Date(selectedDate).toLocaleDateString("ko-KR", {
            month: "long",
            day: "numeric",
          })}{" "}
          일정
        </ScheduleHeader>
        {isLoading ? (
          <InfoText>일정을 불러오는 중입니다...</InfoText>
        ) : filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard key={event.id}>
              <EventTime>
                {event.startTime} - {event.endTime}
              </EventTime>
              <EventDetails>
                <EventTitle>{event.title}</EventTitle>
                {event.location && (
                  <EventLocation>{event.location}</EventLocation>
                )}
              </EventDetails>
            </EventCard>
          ))
        ) : (
          <InfoText>선택된 날짜에 일정이 없습니다.</InfoText>
        )}
      </ScheduleListContainer>

      {isAdmin && (
        <AddScheduleButton onClick={handleAddSchedule}>+</AddScheduleButton>
      )}
    </PageContainer>
  );
};

export default TeamCalendarPage;

// --- Styled Components ---

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f9f9f9;
`;

const CalendarContainer = styled.div`
  padding: 0 16px;
  background-color: #fff;
`;

const ScheduleListContainer = styled.div`
  flex-grow: 1;
  padding: 24px 16px;
  overflow-y: auto;
`;

const ScheduleHeader = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
`;

const EventCard = styled.div`
  display: flex;
  gap: 16px;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
  border-left: 5px solid var(--color-main);
`;

const EventTime = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: var(--color-main);
  white-space: nowrap;
`;

const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const EventTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin: 0;
`;

const EventLocation = styled.p`
  font-size: 14px;
  color: #888;
  margin: 0;
`;

const InfoText = styled.p`
  text-align: center;
  color: #999;
  padding: 32px 0;
`;

const AddScheduleButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-color: var(--color-main);
  color: white;
  border: none;
  font-size: 32px;
  font-weight: 300;
  line-height: 56px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;
