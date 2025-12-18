import React, { useState } from "react";
import styled from "styled-components";
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
  onClose: () => void; // Callback to close the modal
  selectedDate?: Date | null; // 선택된 날짜 (Date 타입)
}

const CalendarModal: React.FC<CalendarProps> = ({
  onDateSelect,
  onClose,
  selectedDate,
}) => {
  // 오늘 기준
  const today = new Date();
  const minMonth = startOfMonth(today); // 오늘이 속한 달의 1일

  // props로 들어온 selectedDate 사용 (없으면 null)
  const selectedDateObj: Date | null = selectedDate ?? null;

  // 처음 열릴 때 보여줄 달: selectedDate가 있으면 그 달, 없으면 오늘
  const [currentMonth, setCurrentMonth] = useState<Date>(() => {
    if (selectedDateObj) {
      const startOfSelectedMonth = startOfMonth(selectedDateObj);
      // selectedDate의 달이 오늘보다 과거면 오늘 달을 기준으로
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
    // 이전 달의 시작일이 오늘이 속한 달의 시작일보다 이전이면 이동 금지
    if (isBefore(startOfMonth(prevMonth), minMonth)) {
      return;
    }
    setCurrentMonth(prevMonth);
  };

  const handleDayClick = (date: Date) => {
    // 오늘보다 이전 날짜는 선택 불가 (단, 오늘은 허용)
    if (isBefore(date, today) && !isSameDay(date, today)) {
      return;
    }
    onDateSelect(date);
    onClose();
  };

  // [오늘] 버튼: 모달은 그대로, "보는 달"만 오늘이 속한 달로 이동
  const handleTodayClick = () => {
    setCurrentMonth(today);
  };

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
    const startDate = startOfWeek(monthStart); // 기본: 일요일 시작
    const endDate = endOfWeek(monthEnd);

    const days: JSX.Element[] = [];

    let day = startDate;
    while (day <= endDate) {
      const formattedDate = format(day, "d");
      const cloneDay = new Date(day);

      const isDisabled =
        isBefore(cloneDay, today) && !isSameDay(cloneDay, today);

      // props로 들어온 selectedDate와 같은 날이면 하이라이트
      const isSelected =
        selectedDateObj !== null ? isSameDay(cloneDay, selectedDateObj) : false;

      days.push(
        <Day
          key={cloneDay.toString()}
          isDisabled={isDisabled}
          isSelected={isSelected}
          onClick={() => handleDayClick(cloneDay)}
        >
          {formattedDate}
        </Day>
      );
      day = addDays(day, 1);
    }
    return <DaysGrid>{days}</DaysGrid>;
  };

  // 현재 보고 있는 달 기준으로 이전 달 버튼 비활성화 여부 계산
  const isPrevDisabled = isBefore(
    startOfMonth(subMonths(currentMonth, 1)),
    minMonth
  );

  const yearLabel = format(currentMonth, "yyyy년");
  const monthLabel = format(currentMonth, "M월"); // 1월, 2월, 3월 ...

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <CalendarHeader>
          <Button onClick={handlePrevMonth} disabled={isPrevDisabled}>
            이전 달
          </Button>

          <CurrentMonth>
            <span className="year">{yearLabel}</span>
            <span className="month">{monthLabel}</span>
            <TodayButton type="button" onClick={handleTodayClick}>
              오늘
            </TodayButton>
          </CurrentMonth>

          <Button onClick={handleNextMonth}>다음 달</Button>
        </CalendarHeader>

        {renderWeekDays()}
        {renderDays()}
      </Modal>
    </Overlay>
  );
};

export default CalendarModal;

// Styled components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  z-index: 1001;
  position: relative;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const CurrentMonth = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .year {
    font-size: 12px;
    color: #999;
    margin-bottom: 2px;
  }

  .month {
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 4px;
  }
`;

const TodayButton = styled.button`
  padding: 2px 10px;
  border-radius: 999px;
  border: 1px solid #ddd;
  background-color: #f5f5f5;
  font-size: 11px;
  cursor: pointer;
`;

const WeekDaysRow = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 4px;
`;

const WeekDay = styled.div<{ isSunday?: boolean; isSaturday?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
  color: ${({ isSunday, isSaturday }) =>
    isSunday ? "#e53935" : isSaturday ? "#1e88e5" : "#666"};
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`;

const Day = styled.div<{ isSelected: boolean; isDisabled: boolean }>`
  padding: 8px 5px;
  background: ${({ isSelected, isDisabled }) =>
    isDisabled ? "#e0e0e0" : isSelected ? "#a4d65e" : "none"};
  color: ${({ isDisabled }) => (isDisabled ? "#ccc" : "black")};
  cursor: ${({ isDisabled }) => (isDisabled ? "default" : "pointer")};
  text-align: center;

  &:hover {
    background-color: ${({ isDisabled }) =>
      isDisabled ? "#e0e0e0" : "#a4d65e"};
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  border: none;
  background-color: #a4d65e;
  color: black;
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 10px;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;
