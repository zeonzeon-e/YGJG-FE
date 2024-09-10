import React, { useState, useEffect } from "react";
import styled from "styled-components";

/**
 * ActivityDaysSelector 컴포넌트 - 주요 활동 요일을 선택하는 컴포넌트
 * @returns {JSX.Element} ActivityDaysSelector 컴포넌트
 */
const ActivityDaysSelector: React.FC = () => {
  // 평일(월~금) 요일 리스트
  const weekdays = ["월", "화", "수", "목", "금"];

  // 주말(토, 일) 요일 리스트
  const weekendDays = ["토", "일"];

  // 전체 요일 리스트 (평일 + 주말)
  const allDays = [...weekdays, ...weekendDays];

  // "평일 모두"와 "주말 모두" 옵션 리스트
  const periodOptions = ["평일 모두", "주말 모두"];

  // 선택된 요일의 상태를 관리하는 상태 변수
  const [selectedDayStates, setSelectedDayStates] = useState<boolean[]>(
    Array(allDays.length).fill(false)
  );

  // 선택된 "평일 모두", "주말 모두" 상태를 관리하는 상태 변수
  const [selectedPeriodStates, setSelectedPeriodStates] = useState<boolean[]>(
    Array(periodOptions.length).fill(false)
  );

  /**
   * handleDayToggle - 개별 요일 버튼 클릭 시 상태를 토글하는 함수
   * @param {number} dayIndex - 클릭된 요일의 인덱스
   */
  const handleDayToggle = (dayIndex: number) => {
    const updatedDayStates = [...selectedDayStates];
    updatedDayStates[dayIndex] = !updatedDayStates[dayIndex];
    setSelectedDayStates(updatedDayStates);
  };

  /**
   * handlePeriodToggle - "평일 모두" 또는 "주말 모두" 버튼 클릭 시 상태를 토글하는 함수
   * @param {number} periodIndex - 클릭된 버튼의 인덱스 (0: 평일 모두, 1: 주말 모두)
   */
  const handlePeriodToggle = (periodIndex: number) => {
    const updatedPeriodStates = [...selectedPeriodStates];
    updatedPeriodStates[periodIndex] = !updatedPeriodStates[periodIndex];

    if (periodIndex === 0) {
      // 평일 모두 선택/해제
      const isWeekdaysSelected = updatedPeriodStates[periodIndex];
      weekdays.forEach(
        (_, idx) => (selectedDayStates[idx] = isWeekdaysSelected)
      );
    } else {
      // 주말 모두 선택/해제
      const isWeekendDaysSelected = updatedPeriodStates[periodIndex];
      weekendDays.forEach(
        (_, idx) =>
          (selectedDayStates[weekdays.length + idx] = isWeekendDaysSelected)
      );
    }

    setSelectedDayStates([...selectedDayStates]);
    setSelectedPeriodStates(updatedPeriodStates);
  };

  /**
   * useEffect - 선택된 요일 상태에 따라 "평일 모두"와 "주말 모두" 상태를 자동으로 업데이트
   * @param {boolean[]} selectedDayStates - 현재 선택된 요일 상태 배열
   */
  useEffect(() => {
    const areAllWeekdaysSelected = weekdays.every(
      (_, idx) => selectedDayStates[idx] === true
    );
    const areAllWeekendDaysSelected = weekendDays.every(
      (_, idx) => selectedDayStates[weekdays.length + idx] === true
    );

    const updatedPeriodStates = [...selectedPeriodStates];
    updatedPeriodStates[0] = areAllWeekdaysSelected;
    updatedPeriodStates[1] = areAllWeekendDaysSelected;

    setSelectedPeriodStates(updatedPeriodStates);
  }, [selectedDayStates]);

  return (
    <Container>
      <Title>주요 활동 요일</Title>
      <DayButtonContainer>
        {allDays.map((day, index) => (
          <DayButton
            key={day}
            isSelected={selectedDayStates[index]}
            onClick={() => handleDayToggle(index)}
          >
            {day}
          </DayButton>
        ))}
      </DayButtonContainer>
      <PeriodButtonContainer>
        {periodOptions.map((option, index) => (
          <PeriodButton
            key={option}
            isSelected={selectedPeriodStates[index]}
            onClick={() => handlePeriodToggle(index)}
          >
            {option}
          </PeriodButton>
        ))}
      </PeriodButtonContainer>
    </Container>
  );
};

export default ActivityDaysSelector;

// 스타일 컴포넌트 정의

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box; /* 컨테이너에만 적용 */
`;

const Title = styled.h3`
  margin-bottom: 10px;
  font-size: 18px;
  font-family: "Pretendard-Medium";
  color: var(--color-dark2);
`;

const DayButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
`;

interface ButtonProps {
  isSelected: boolean;
  width?: string;
}

const DayButton = styled.button<ButtonProps>`
  border: 1px solid
    ${({ isSelected }) => (isSelected ? "var(--color-main)" : "transparent")};
  padding: 10px;
  margin-right: 8px;
  border-radius: 8px; /* 기본적으로 8px의 border-radius */
  color: ${({ isSelected }) =>
    isSelected ? "var(--color-main)" : "var(--color-dark1)"};
  background-color: ${({ isSelected }) =>
    isSelected ? "var(--color-light1)" : "var(--color-light1)"};
  font-size: 14px;
  font-family: "Pretendard-Regular";
  cursor: pointer;
  width: ${({ width }) => width || "100px"};
  text-align: center;

  &:hover {
    opacity: 0.9;
  }

  transition: all 0.3s ease;
`;

const PeriodButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const PeriodButton = styled(DayButton)<ButtonProps>`
  width: calc(50% - 8px); /* 두 버튼 사이의 간격을 위해 */
`;
