import React, { useState } from "react";
import styled, { keyframes, css } from "styled-components";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isBefore,
  isSameDay,
} from "date-fns";

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  onClose: () => void;
  selectedDate?: Date | null;
}

// 아이콘 컴포넌트 (SVG)
const ChevronLeft = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRight = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarModal: React.FC<CalendarProps> = ({
  onDateSelect,
  onClose,
  selectedDate,
}) => {
  const today = new Date();
  const minMonth = startOfMonth(today);
  const selectedDateObj: Date | null = selectedDate ?? null;

  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (selectedDateObj) {
      const startOfSelectedMonth = startOfMonth(selectedDateObj);
      if (isBefore(startOfSelectedMonth, minMonth)) {
        return today;
      }
      return selectedDateObj;
    }
    return today;
  });

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handlePrevMonth = () => {
    const prevMonth = subMonths(currentMonth, 1);
    if (isBefore(startOfMonth(prevMonth), minMonth)) return;
    setCurrentMonth(prevMonth);
  };

  const handleDayClick = (date: Date) => {
    if (isBefore(date, today) && !isSameDay(date, today)) return;
    onDateSelect(date);
    setTimeout(onClose, 150);
  };

  const handleTodayClick = () => {
    setCurrentMonth(today);
  };

  const isPrevDisabled = isBefore(
    startOfMonth(subMonths(currentMonth, 1)),
    minMonth
  );

  // ⭐️ [수정된 부분] 날짜 형식을 "yyyy년"으로 변경
  const yearLabel = format(currentMonth, "yyyy년"); 
  const monthLabel = format(currentMonth, "M월");

  const renderWeekDays = () => {
    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    return (
      <WeekDaysRow>
        {weekDays.map((dayLabel, index) => (
          <WeekDay
            key={dayLabel}
            isSunday={index === 0}
            isSaturday={index === 6}
          >
            {dayLabel}
          </WeekDay>
        ))}
      </WeekDaysRow>
    );
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days: JSX.Element[] = [];
    let day = startDate;

    while (day <= endDate) {
      const cloneDay = new Date(day);
      const isCurrentMonth = format(currentMonth, "M") === format(cloneDay, "M");
      const isDisabled =
        isBefore(cloneDay, today) && !isSameDay(cloneDay, today);
      const isSelected =
        selectedDateObj !== null ? isSameDay(cloneDay, selectedDateObj) : false;
      const isToday = isSameDay(cloneDay, today);

      days.push(
        <DayWrapper key={cloneDay.toString()}>
          <Day
            isCurrentMonth={isCurrentMonth}
            isDisabled={isDisabled}
            isSelected={isSelected}
            isToday={isToday}
            onClick={() => !isDisabled && handleDayClick(cloneDay)}
          >
            {format(cloneDay, "d")}
          </Day>
        </DayWrapper>
      );
      day = addDays(day, 1);
    }
    
    return <DaysGrid key={currentMonth.toString()}>{days}</DaysGrid>;
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <NavButton onClick={handlePrevMonth} disabled={isPrevDisabled}>
            <ChevronLeft />
          </NavButton>

          <MonthDisplay>
            {/* ⭐️ [수정된 부분] 점(.)을 제거하고 띄어쓰기로 연결 */}
            <span className="label">
              {yearLabel} {monthLabel}
            </span>
            {!isSameDay(currentMonth, today) && (
              <TodayBadge onClick={handleTodayClick}>오늘</TodayBadge>
            )}
          </MonthDisplay>

          <NavButton onClick={handleNextMonth}>
            <ChevronRight />
          </NavButton>
        </Header>

        <CalendarBody>
          {renderWeekDays()}
          {renderDays()}
        </CalendarBody>
      </Modal>
    </Overlay>
  );
};

export default CalendarModal;

/* --- Styled Components --- */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
`;

const popIn = keyframes`
  0% { transform: scale(0.9); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const Modal = styled.div`
  background: white;
  padding: 24px;
  border-radius: 24px;
  width: 340px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1), 0 4px 12px rgba(0,0,0,0.05);
  z-index: 1001;
  user-select: none;
  animation: ${popIn} 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 4px;
`;

const MonthDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  .label {
    font-size: 18px;
    font-weight: 700;
    color: #111;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
`;

const TodayBadge = styled.button`
  background: #f0f2f5;
  border: none;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  color: #555;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e4e6eb;
    color: #333;
  }
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #f3f4f6;
  }

  &:active:not(:disabled) {
    transform: scale(0.9);
  }

  &:disabled {
    color: #e0e0e0;
    cursor: default;
  }
`;

const CalendarBody = styled.div`
  /* 컨텐츠 영역 */
`;

const WeekDaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 12px;
`;

const WeekDay = styled.div<{ isSunday?: boolean; isSaturday?: boolean }>`
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: ${({ isSunday, isSaturday }) =>
    isSunday ? "#ff4d4f" : isSaturday ? "#1890ff" : "#8c8c8c"};
  padding: 8px 0;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 8px;
  animation: ${fadeIn} 0.3s ease;
`;

const DayWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  aspect-ratio: 1;
`;

interface DayProps {
  isSelected: boolean;
  isDisabled: boolean;
  isCurrentMonth: boolean;
  isToday: boolean;
}

const Day = styled.div<DayProps>`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;

  color: ${({ isDisabled, isCurrentMonth }) =>
    isDisabled
      ? "#d1d5db"
      : !isCurrentMonth
      ? "#9ca3af"
      : "#1f2937"};

  background-color: ${({ isSelected }) =>
    isSelected ? "#3b82f6" : "transparent"};

  color: ${({ isSelected, isDisabled }) =>
    isSelected && !isDisabled ? "#ffffff" : undefined};

  border: ${({ isToday, isSelected }) =>
    isToday && !isSelected ? "1.5px solid #3b82f6" : "1.5px solid transparent"};
  
  ${({ isDisabled }) =>
    isDisabled &&
    css`
      cursor: default;
      pointer-events: none;
    `}

  &:hover {
    background-color: ${({ isSelected, isDisabled }) =>
      !isDisabled && !isSelected ? "#eff6ff" : undefined};
    color: ${({ isSelected, isDisabled }) =>
      !isDisabled && !isSelected ? "#3b82f6" : undefined};
  }

  &:active {
    transform: ${({ isDisabled }) => (!isDisabled ? "scale(0.9)" : "none")};
  }
`;