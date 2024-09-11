import React, { useState } from "react";
import styled from "styled-components";
import GlobalStyles from "../../../component/Styled/GlobalStyled";
import Header2 from "../../../component/Header/Header2/Header2";
import MainButton from "../../../component/Button/MainButton";
import { format } from "date-fns";
import CalendarModal from "../../../component/Modal/CalendarModal"; // 이 부분은 달력을 직접 렌더링하는 컴포넌트입니다.
import TimePickerModal from "../../../component/Modal/TimePickerModal";
import { ko } from "date-fns/locale";
import CheckBox from "../../../component/CheckBox/CheckBox";
import Input from "../../../component/Input/Input";
import KakaoMapModal from "../../../component/Modal/KakaoAddress";

const GameStrategy: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const context = [["제목", "내용"]];
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
  };

  return (
    <>
      <GlobalStyles />
      <Header2 text="경기 전략" />
      <Container>
        <PickerContainer>
          <h3>경기 날짜와 시간을 선택해주세요</h3>
          <PickerButton>
            <StrategyButton onClick={() => setShowDatePicker(true)}>
              {selectedDate
                ? format(selectedDate, "MM월 dd일 EEEE", { locale: ko }) // Display day of the week here
                : "날짜를 선택하세요"}
            </StrategyButton>

            <StrategyButton onClick={() => setShowTimePicker(true)}>
              {selectedTime || "시간을 선택하세요"}
            </StrategyButton>
          </PickerButton>
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

        <Input type="text" placeholder="상대팀명 입력" />
        <Input type="text" placeholder="주요 전술 사항" />
        <Input type="text" placeholder="포메이션 입력" />
        <CheckBox content={context} isToggle={false} />
        <Input
          type="text"
          placeholder="상대팀명을 입력해주세요"
          title="상대팀명을 입력해주세요"
        />

        <MainButton onClick={() => setShowMapModal(true)}>주소 찾기</MainButton>
        <SelectedAddress>{selectedAddress}</SelectedAddress>
        {showMapModal && (
          <KakaoMapModal
            onClose={() => setShowMapModal(false)}
            onAddressSelect={handleAddressSelect}
          />
        )}

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
  background-color: var(--color-light2);
  color: var(--color-main);
  border: 1px solid var(--color-main);
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;
  width: 100%;
`;

const PickerContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const PickerButton = styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
`;

const SelectedAddress = styled.div`
  margin: 10px 0;
  font-size: 14px;
  color: #333;
`;
