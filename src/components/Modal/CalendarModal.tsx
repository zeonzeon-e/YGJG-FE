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
  isSameMonth,
} from "date-fns";

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  onClose: () => void; // Callback to close the modal
}

const CalendarModal: React.FC<CalendarProps> = ({ onDateSelect, onClose }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handlePrevMonth = () => {
    const prevMonth = subMonths(currentMonth, 1);
    if (isBefore(prevMonth, new Date())) {
      return;
    }
    setCurrentMonth(prevMonth);
  };

  const handleDayClick = (date: Date) => {
    if (isBefore(date, new Date()) && !isSameDay(date, new Date())) {
      return;
    }
    onDateSelect(date); // Pass the selected date back to the parent component
    onClose(); // Close the modal after date selection
  };

  const renderDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];

    let day = startDate;
    while (day <= endDate) {
      const formattedDate = format(day, "d");
      const cloneDay = new Date(day);

      days.push(
        <Day
          key={cloneDay.toString()}
          isDisabled={
            isBefore(cloneDay, new Date()) && !isSameDay(cloneDay, new Date())
          }
          isSelected={isSameMonth(cloneDay, monthStart)}
          onClick={() => handleDayClick(cloneDay)}
        >
          {formattedDate}
        </Day>
      );
      day = addDays(day, 1);
    }
    return <DaysGrid>{days}</DaysGrid>;
  };

  return (
    <>
      <Overlay onClick={onClose}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <CalendarHeader>
            <Button
              onClick={handlePrevMonth}
              disabled={isBefore(subMonths(currentMonth, 1), new Date())}
            >
              이전 달
            </Button>
            <CurrentMonth>{format(currentMonth, "MMMM yyyy")}</CurrentMonth>
            <Button onClick={handleNextMonth}>다음 달</Button>
          </CalendarHeader>
          {renderDays()}
        </Modal>
      </Overlay>
    </>
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
  background-color: rgba(0, 0, 0, 0.5); // Semi-transparent background
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
  margin-bottom: 20px;
`;

const CurrentMonth = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const DaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
`;

const Day = styled.div<{ isSelected: boolean; isDisabled: boolean }>`
  padding: 10px;
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
