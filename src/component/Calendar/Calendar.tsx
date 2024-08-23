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

/**
 * Match 인터페이스 - 경기 정보를 나타내는 타입
 * @interface Match
 * @property {string} date - 경기 날짜 (형식: YYYY-MM-DD)
 * @property {string} time - 경기 시간
 * @property {string} teams - 팀 정보
 * @property {string} color - 색상 (경기 유형을 나타냄)
 */
interface Match {
  date: string;
  time: string;
  teams: string;
  color: string;
}

/**
 * CalendarProps 인터페이스 - Calendar 컴포넌트의 props
 * @interface CalendarProps
 * @property {Match[]} matches - 경기 목록
 * @property {function} onDateSelect - 날짜 선택 시 호출되는 함수
 */
interface CalendarProps {
  matches: Match[];
  onDateSelect: (date: string) => void;
}

/**
 * Calendar 컴포넌트 - 달력을 표시하고 경기 정보를 관리
 * @param {CalendarProps} props - Calendar 컴포넌트에 전달되는 props
 * @param {Match[]} props.matches - 경기 목록
 * @param {function} props.onDateSelect - 날짜 선택 시 호출되는 함수
 * @returns {JSX.Element} Calendar 컴포넌트
 */
const Calendar: React.FC<CalendarProps> = ({ matches, onDateSelect }) => {
  // 현재 날짜를 저장하는 state
  const [currentDate, setCurrentDate] = useState(new Date());
  onDateSelect(format(currentDate, "yyyy-MM-dd"));

  /**
   * renderHeader - 달력 헤더를 렌더링하는 함수
   * @returns {JSX.Element} 헤더 컴포넌트
   */
  const renderHeader = () => {
    const monthFormat = "MMMM"; // 월 형식
    const yearFormat = "yyyy"; // 년도 형식

    return (
      <div className="header row flex-middle">
        <div className="col col-start" onClick={prevMonth}>
          <div className="icon-wrap">
            <div className="icon">
              <FaChevronLeft />
            </div>
          </div>
        </div>
        <div className="col col-center">
          <div className="month">{format(currentDate, monthFormat)}</div>
          <div className="year">{format(currentDate, yearFormat)}</div>
        </div>
        <div className="col col-end" onClick={nextMonth}>
          <div className="icon-wrap">
            <div className="icon">
              <FaChevronRight />
            </div>
          </div>
        </div>
      </div>
    );
  };

  /**
   * renderDays - 요일 헤더를 렌더링하는 함수
   * @returns {JSX.Element} 요일 헤더 컴포넌트
   */
  const renderDays = () => {
    const dateFormat = "EEEE"; // 요일 형식
    const days = [];

    let startDate = startOfWeek(currentDate, { locale: ko }); // 한 주의 시작일 설정

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

  /**
   * renderCells - 달력의 날짜 셀을 렌더링하는 함수
   * @returns {JSX.Element} 날짜 셀 컴포넌트
   */
  const renderCells = () => {
    const monthStart = startOfMonth(currentDate); // 현재 월의 시작일
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
        const dateString = format(day, "yyyy-MM-dd");

        // 현재 날짜에 맞는 경기를 찾음
        const dayMatches = matches.filter((match) => match.date === dateString);

        days.push(
          <div
            className={`col cell ${
              isDisabled
                ? "disabled"
                : isSameDay(day, new Date())
                ? "today"
                : isSameDay(day, currentDate)
                ? "selected"
                : ""
            }`}
            key={day.toString()}
            onClick={() => {
              if (!isDisabled) {
                onDateClick(cloneDay);
                onDateSelect(dateString);
              }
            }}
          >
            <div className="number-wrap">
              <span className="number">{format(day, "d")}</span>
            </div>
            {/* 조건에 따라 점 표시 */}
            {!isDisabled && dayMatches.length > 0 && (
              <div className="dots">
                {dayMatches.map((match, idx) => (
                  <div
                    key={idx}
                    className="dot"
                    style={{ backgroundColor: match.color }}
                  ></div>
                ))}
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

  /**
   * onDateClick - 날짜 클릭 시 현재 월을 해당 날짜로 변경하는 함수
   * @param {Date} day - 클릭한 날짜
   */
  const onDateClick = (day: Date) => {
    setCurrentDate(day);
  };

  /**
   * nextMonth - 다음 달로 이동하는 함수
   */
  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  /**
   * prevMonth - 이전 달로 이동하는 함수
   */
  const prevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  return (
    <div className="calendar">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <div className="calendar-underline" />
    </div>
  );
};

export default Calendar;
