import React from "react";
import styled from "styled-components";

/**
 * MatchCardProps 인터페이스 - MatchCard 컴포넌트의 props
 * @interface MatchCardProps
 * @property {string} time - 경기 시간 (예: '10:00-13:00')
 * @property {string} teams - 경기하는 두 팀의 정보 (예: '대한민국 팀 vs 다음 팀')
 * @property {string} color - 경기 유형을 나타내는 색상 (점 색상)
 */
interface MatchCardProps {
  time: string;
  teams: string;
  color: string;
}

/**
 * MatchCard 컴포넌트 - 경기 정보를 카드 형식으로 표시
 * @param {MatchCardProps} props - MatchCard 컴포넌트에 전달되는 props
 * @param {string} props.time - 경기 시간 (예: '10:00-13:00')
 * @param {string} props.teams - 경기하는 두 팀의 정보 (예: '대한민국 팀 vs 다음 팀')
 * @param {string} props.color - 경기 유형을 나타내는 색상 (점 색상)
 * @returns {JSX.Element} MatchCard 컴포넌트
 */
const MatchCard: React.FC<MatchCardProps> = ({ time, teams, color }) => {
  return (
    <CardContainer>
      <InfoSection>
        <TimeContainer>
          <Dot color={color} />
          <Time>{time}</Time>
        </TimeContainer>
        <Teams>{teams}</Teams>
      </InfoSection>
      <Button>전략 보기</Button>
    </CardContainer>
  );
};

// 스타일 컴포넌트 정의
const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 16px 24px;
  margin: 10px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.1);
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const TimeContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`;

const Dot = styled.span<{ color: string }>`
  height: 8px;
  width: 8px;
  background-color: ${(props) => props.color};
  border-radius: 50%;
  margin-right: 8px;
  display: inline-block;
`;

const Time = styled.span`
  font-size: 10px;
  font-weight: bold;
  color: #9e9e9e;
`;

const Teams = styled.div`
  font-size: 14px;
  font-weight: bold;
  color: #212121;
  margin-top: 5px;
`;

const Button = styled.button`
  background-color: #005e30;
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #004422;
  }
`;

export default MatchCard;
