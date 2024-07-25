import React, { useState } from "react";
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
import "./Calendar.css";

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // 헤더를 렌더링하는 함수
  const renderHeader = () => {
    const monthFormat = "MMMM"; // 월 형식
    const yearFormat = "yyyy";  // 년도 형식

    return (
      <div className="header row flex-middle">
        <div className="col col-start">
          <div className="icon" onClick={prevMonth}>
            <FaChevronLeft />
          </div>
        </div>
        <div className="col col-center">
          <div className="month">{format(currentMonth, monthFormat)}</div>
          <div className="year">{format(currentMonth, yearFormat)}</div>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="icon"><FaChevronRight /></div>
        </div>
      </div>
    );
  };

  // 요일 헤더를 렌더링하는 함수
  const renderDays = () => {
    const dateFormat = "EEEE"; // 요일 형식
    const days = [];

    let startDate = startOfWeek(currentMonth, { locale: ko }); // 한 주의 시작일 설정

    // 요일을 한글로 렌더링
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="col col-center week" key={i}>
          {format(addDays(startDate, i), dateFormat, { locale: ko }).charAt(0)}
        </div>
      );
    }

    return <div className="days row">{days}</div>;
  };

  // 달력의 날짜 셀을 렌더링하는 함수
  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth); // 현재 월의 시작일
    const monthEnd = endOfMonth(monthStart); // 현재 월의 마지막일
    const startDate = startOfWeek(monthStart, { locale: ko }); // 현재 월의 시작일이 포함된 주의 시작일
    const endDate = endOfWeek(monthEnd, { locale: ko }); // 현재 월의 마지막일이 포함된 주의 마지막일

    const rows = [];
    let days = [];
    let day = startDate;

    // 날짜 셀을 생성
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = day;
        const isDisabled = !isSameMonth(day, monthStart); // 현재 월이 아닌 날짜는 비활성화
        days.push(
          <div
            className={`col cell ${
              isDisabled
                ? "disabled"
                : isSameDay(day, new Date())
                ? "selected"
                : ""
            }`}
            key={day.toString()}
            onClick={() => !isDisabled && onDateClick(cloneDay)}
          >
            <span className="number">{format(day, "d")}</span>
            {!isDisabled && (
              <div className="dots">
                {/* 조건에 따라 점 표시 */}
                <div className="dot green"></div>
                <div className="dot blue"></div>
                <div className="dot purple"></div>
              </div>
            )}
          </div>
        );
        day = addDays(day, 1); // 다음 날짜로 이동
      }
      rows.push(
        <div className="row" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    return <div className="body">{rows}</div>;
  };

  // 날짜 클릭 시 현재 월을 해당 날짜로 변경하는 함수
  const onDateClick = (day: Date) => {
    setCurrentMonth(day);
  };

  // 다음 달로 이동하는 함수
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // 이전 달로 이동하는 함수
  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default Calendar;
