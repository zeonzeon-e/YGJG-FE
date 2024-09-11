import React, { useState } from "react";
import GlobalStyles from "../../components/Styled/GlobalStyled";
import Calendar from "../../components/Calendar/Calendar";
import Header2 from "../../components/Header/Header2/Header2";
import MatchCard from "../../components/MatchCard/MatchCard";

/**
 * Match 인터페이스 - 경기 데이터를 위한 타입 정의
 * @interface Match
 * @property {string} date - 경기 날짜 (형식: YYYY-MM-DD)
 * @property {string} time - 경기 시간
 * @property {string} teams - 팀 정보
 * @property {string} color - 경기 유형을 나타내는 색상 (점 색상)
 */
interface Match {
  date: string;
  time: string;
  teams: string;
  color: string;
}

// 경기 일정 데이터
const matches: Match[] = [
  {
    date: "2024-08-03",
    time: "10:00-13:00",
    teams: "대한민국 팀 vs 다음 팀",
    color: "#D500F9",
  },
  {
    date: "2024-08-05",
    time: "10:00-13:00",
    teams: "대한민국 팀 vs 다음 팀",
    color: "#00C853",
  },
  {
    date: "2024-08-10",
    time: "20:00-22:00",
    teams: "대한민국 팀 vs 호주 팀",
    color: "#D500F9",
  },
  {
    date: "2024-08-12",
    time: "15:00-17:00",
    teams: "한국 팀 vs 일본 팀",
    color: "#FFD700",
  },
  {
    date: "2024-08-15",
    time: "18:00-20:00",
    teams: "중국 팀 vs 러시아 팀",
    color: "#1E90FF",
  },
  {
    date: "2024-08-20",
    time: "12:00-14:00",
    teams: "대한민국 팀 vs 독일 팀",
    color: "#00C853",
  },
  {
    date: "2024-09-02",
    time: "12:00-14:00",
    teams: "대한민국 팀 vs 독일 팀",
    color: "#00C853",
  },
  {
    date: "2024-09-02",
    time: "12:00-14:00",
    teams: "대한민국 팀 vs 독일 팀",
    color: "#1E90FF",
  },
  {
    date: "2024-07-20",
    time: "12:00-14:00",
    teams: "대한민국 팀 vs 독일 팀",
    color: "#FF4500",
  },
  {
    date: "2024-08-23",
    time: "12:00-14:00",
    teams: "대한민국 팀 vs 독일 팀",
    color: "#FF4500",
  },
];

/**
 * CalendarPage 컴포넌트 - 캘린더와 경기 일정을 표시하는 페이지
 * @returns {JSX.Element} CalendarPage 컴포넌트
 */
const PersonalCalendarPage: React.FC = () => {
  // 현재 선택된 날짜를 저장하는 state
  const [selectedDate, setSelectedDate] = useState<string>("");

  /**
   * handleDateSelect - 날짜 선택 시 호출되는 함수
   * @param {string} date - 선택된 날짜 (형식: YYYY-MM-DD)
   */
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  // 선택된 날짜에 맞는 경기 필터링
  const filteredMatches = matches.filter(
    (match) => match.date === selectedDate
  );

  return (
    <>
      <GlobalStyles />
      <div className="CalendarPage">
        <Header2 text="내 경기 일정" />
        <Calendar matches={matches} onDateSelect={handleDateSelect} />
        {filteredMatches.map((match, index) => (
          <MatchCard
            key={index}
            time={match.time}
            teams={match.teams}
            color={match.color}
          />
        ))}
      </div>
    </>
  );
};

export default PersonalCalendarPage;
