import React, { useState } from "react";
import styled from "styled-components";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ko } from "date-fns/locale";

// ⭐ 2. 재사용성을 위해 범용적인 Event 타입으로 변경
interface CalendarEvent {
  date: string;
  color: string;
}

interface CalendarProps {
  events: CalendarEvent[];
  onDateSelect: (date: string) => void;
  onMonthChange?: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ events, onDateSelect, onMonthChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  // ⭐ 1. 무한 렌더링을 유발하는 코드를 제거했습니다.

  const handleDateClick = (day: Date) => {
    setCurrentDate(day);
    setSelectedDate(day);
    onDateSelect(format(day, "yyyy-MM-dd"));
  };

  const nextMonth = () => {
    const newDate = addMonths(currentDate, 1);
    setCurrentDate(newDate);
    if (onMonthChange) onMonthChange(newDate);
  };

  const prevMonth = () => {
    const newDate = subMonths(currentDate, 1);
    setCurrentDate(newDate);
    if (onMonthChange) onMonthChange(newDate);
  };

  const renderHeader = () => (
    <HeaderRow>
      <ArrowButton onClick={prevMonth}>
        <FaChevronLeft />
      </ArrowButton>
      <MonthYear>
        <span>{format(currentDate, "yyyy년")}</span>
        <span>{format(currentDate, "MMMM", { locale: ko })}</span>
      </MonthYear>
      <ArrowButton onClick={nextMonth}>
        <FaChevronRight />
      </ArrowButton>
    </HeaderRow>
  );

  const renderDaysOfWeek = () => {
    const days = [];
    const startDate = startOfWeek(currentDate, { locale: ko });
    for (let i = 0; i < 7; i++) {
      days.push(
        <DayOfWeek key={i}>
          {format(addDays(startDate, i), "E", { locale: ko })}
        </DayOfWeek>
      );
    }
    return <DaysRow>{days}</DaysRow>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { locale: ko });
    const endDate = endOfWeek(monthEnd, { locale: ko });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const dateString = format(day, "yyyy-MM-dd");
        const dayEvents = events.filter((event) => event.date === dateString);

        days.push(
          <Cell
            key={day.toString()}
            isOtherMonth={!isSameMonth(day, monthStart)}
            isSelected={isSameDay(day, selectedDate)}
            isToday={isSameDay(day, new Date())}
            onClick={() => handleDateClick(cloneDay)}
          >
            <DateNumber>{format(day, "d")}</DateNumber>
            <DotsContainer>
              {dayEvents.slice(0, 3).map((event, index) => (
                <Dot key={index} color={event.color} />
              ))}
            </DotsContainer>
          </Cell>
        );
        day = addDays(day, 1);
      }
      rows.push(<CalendarRow key={day.toString()}>{days}</CalendarRow>);
      days = [];
    }
    return <CalendarBody>{rows}</CalendarBody>;
  };

  return (
    <CalendarContainer>
      {renderHeader()}
      {renderDaysOfWeek()}
      {renderCells()}
      <Underline />
    </CalendarContainer>
  );
};

export default Calendar;

// ⭐ 3. 기존 CSS를 Styled-components로 전환하여 일관성 유지
const CalendarContainer = styled.div`
  width: 100%;
  background-color: #fff;
  padding: 16px;
  box-sizing: border-box;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ArrowButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: #333;
`;

const MonthYear = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  span:first-child {
    font-size: 14px;
    color: #888;
  }
  span:last-child {
    font-size: 20px;
    font-weight: 600;
  }
`;

const DaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 8px;
`;

const DayOfWeek = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #999;
`;

const CalendarBody = styled.div``;
const CalendarRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const Cell = styled.div<{
  isOtherMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
}>`
  height: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 4px;
  cursor: pointer;
  opacity: ${(props) => (props.isOtherMonth ? 0.3 : 1)};
  background-color: ${(props) =>
    props.isSelected ? "var(--color-subtle)" : "transparent"};
  border-radius: 8px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f7f7f7;
  }
`;

const DateNumber = styled.span`
  font-size: 14px;
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 3px;
  margin-top: 4px;
`;

const Dot = styled.div<{ color: string }>`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const Underline = styled.div`
  height: 1px;
  background-color: #eee;
  margin-top: 16px;
`;
