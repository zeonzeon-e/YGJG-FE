import React, { useState } from "react";
import styled from "styled-components";
import GlobalStyles from "../../../component/Styled/GlobalStyled";
import Header2 from "../../../component/Header/Header2/Header2";
import MainButton from "../../../component/Button/MainButton";
import { format } from "date-fns";
import CalendarModal from "../../../component/Modal/CalendarModal"; // 이 부분은 달력을 직접 렌더링하는 컴포넌트입니다.
import TimePickerModal from "../../../component/Modal/TimePickerModal";
import { ko } from "date-fns/locale";

const GameStrategy: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  return (
    <>
      <GlobalStyles />
      <Header2 text="경기 전략" />
      <Container>
        <PickerContainer>
          <StrategyButton onClick={() => setShowDatePicker(true)}>
            {selectedDate
              ? format(selectedDate, "MM월 dd일 EEEE", { locale: ko }) // Display day of the week here
              : "날짜를 선택하세요"}
          </StrategyButton>

          <StrategyButton onClick={() => setShowTimePicker(true)}>
            {selectedTime || "시간을 선택하세요"}
          </StrategyButton>
          {showDatePicker && (
            <CalendarModal
              onDateSelect={(date: Date) => {
                setSelectedDate(date);
                setShowDatePicker(false); // 달력에서 날짜를 선택하면 모달을 닫습니다.
              }}
              onClose={() => {
                setShowDatePicker(false);
                setShowTimePicker(true);
              }}
            />
          )}
        </PickerContainer>
        {showTimePicker && (
          <TimePickerModal
            onTimeSelect={(time: string) => {
              setSelectedTime(time);
              setShowTimePicker(false);
            }}
            onClose={() => setShowTimePicker(false)}
          />
        )}

        <Input placeholder="상대팀명 입력" />
        <Input placeholder="주요 전술 사항" />
        <Input placeholder="포메이션 입력" />
        <MainButton>전략 게시하기</MainButton>
      </Container>
    </>
  );
};

export default GameStrategy;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const StrategyButton = styled.button`
  background-color: #a4d65e;
  color: #000;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  margin-bottom: 20px;
  cursor: pointer;
  width: 100%;
`;

const DatePickerModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;
const PickerContainer = styled.div`
  display: flex;
  width: 100%;
`;
const Input = styled.input`
  width: 80%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
`;
