import React, { useState } from "react";
import styled from "styled-components";

interface TimePickerModalProps {
  onTimeSelect: (time: string) => void;
  onClose: () => void;
}

const TimePickerModal: React.FC<TimePickerModalProps> = ({
  onTimeSelect,
  onClose,
}) => {
  const [selectedHour, setSelectedHour] = useState<number>(1);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [period, setPeriod] = useState<string>("오전");

  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0 to 55 in steps of 5
  const periods = ["오전", "오후"];

  const handleTimeSelect = () => {
    const formattedMinute = selectedMinute.toString().padStart(2, "0");
    const time = `${period} ${selectedHour}:${formattedMinute}`;
    onTimeSelect(time);
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {/* Headers for 시, 분, 오전/오후 */}
        <HeaderRow>
          <HeaderItem>오전/오후</HeaderItem>
          <HeaderItem>시</HeaderItem>
          <HeaderItem>분</HeaderItem>
        </HeaderRow>

        <PickerContainer>
          {/* AM/PM Picker */}
          <Picker>
            {periods.map((p) => (
              <PickerItem
                key={p}
                isSelected={p === period}
                onClick={() => setPeriod(p)}
              >
                {p}
              </PickerItem>
            ))}
          </Picker>

          {/* Hour Picker */}
          <Picker>
            {hours.map((hour) => (
              <PickerItem
                key={hour}
                isSelected={hour === selectedHour}
                onClick={() => setSelectedHour(hour)}
              >
                {hour}
              </PickerItem>
            ))}
          </Picker>

          {/* Minute Picker */}
          <Picker>
            {minutes.map((minute) => (
              <PickerItem
                key={minute}
                isSelected={minute === selectedMinute}
                onClick={() => setSelectedMinute(minute)}
              >
                {minute.toString().padStart(2, "0")}
              </PickerItem>
            ))}
          </Picker>
        </PickerContainer>

        <ConfirmButton onClick={handleTimeSelect}>확인</ConfirmButton>
      </ModalContent>
    </Overlay>
  );
};

export default TimePickerModal;

// Styled components

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
`;

const HeaderItem = styled.div`
  width: 33.33%;
  text-align: center;
  font-weight: bold;
  font-size: 16px;
`;

const PickerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const Picker = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33.33%;
  height: 150px;
  overflow-y: scroll;
  scrollbar-width: thin;
  text-align: center;
`;

const PickerItem = styled.div<{ isSelected: boolean }>`
  padding: 10px;
  font-size: 18px;
  color: ${({ isSelected }) => (isSelected ? "#fff" : "#000")};
  background-color: ${({ isSelected }) =>
    isSelected ? "#4CAF50" : "transparent"};
  cursor: pointer;
  border-radius: 5px;
  margin: 5px 0;
  width: 80%;

  &:hover {
    background-color: #4caf50;
    color: #fff;
  }
`;

const ConfirmButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #45a049;
  }
`;
