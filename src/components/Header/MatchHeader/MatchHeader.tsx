import React from "react";
import "./MatchHeader.css";

interface MatchHeaderProps {
  date: string;
  time: string;
  team1: string;
  team2: string;
}

/**
 * MatchHeader 컴포넌트 - 경기 일정을 표시
 * @param {MatchHeaderProps} props - 컴포넌트에 전달되는 props
 * @param {string} props.date - 경기 날짜
 * @param {string} props.time - 경기 시간
 * @param {string} props.team1 - 첫 번째 팀 이름
 * @param {string} props.team2 - 두 번째 팀 이름
 * @returns {JSX.Element} MatchHeader 컴포넌트
 */
const MatchHeader: React.FC<MatchHeaderProps> = ({
  date,
  time,
  team1,
  team2,
}) => {
  return (
    <div className="match-card">
      <div className="match-date">
        {date} {time}
      </div>
      <div className="match-teams">
        {team1} vs {team2}
      </div>
    </div>
  );
};

export default MatchHeader;
