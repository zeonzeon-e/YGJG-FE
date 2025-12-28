import React, { useState, useRef, useEffect, MouseEvent } from "react";
import styled, { keyframes } from "styled-components";

// --- Types & Constants ---
const ITEM_HEIGHT = 40; // 아이템 하나의 높이 (px)
const VISIBLE_COUNT = 5; // 화면에 보일 개수 (홀수 권장)
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT; // 전체 높이

interface TimePickerModalProps {
  onTimeSelect: (time: string) => void;
  onTimeEnd?: (time: string) => void;
  onClose: () => void;
  initialTime?: { hour: number; minute: number };
}

// -------------------------------------------------------------------------
// [Sub Component] WheelPicker
// : 드래그 앤 드롭과 스크롤 스냅을 처리하는 독립적인 휠 컴포넌트입니다.
// -------------------------------------------------------------------------
interface WheelPickerProps {
  items: number[];
  value: number;
  onChange: (val: number) => void;
  padZero?: boolean;
}

const WheelPicker: React.FC<WheelPickerProps> = ({
  items,
  value,
  onChange,
  padZero = true,
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startScrollTop, setStartScrollTop] = useState(0);

  // 1. 초기 위치 설정 (모달이 열릴 때 선택된 숫자로 이동)
  useEffect(() => {
    if (listRef.current) {
      const index = items.indexOf(value);
      if (index !== -1) {
        listRef.current.scrollTop = index * ITEM_HEIGHT;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. 스크롤 이벤트 핸들러 (현재 중앙에 있는 아이템 계산)
  const handleScroll = () => {
    if (listRef.current && !isDragging) {
      // 드래그 중이 아닐 때만 계산 (성능 최적화 및 떨림 방지)
      const scrollTop = listRef.current.scrollTop;
      const index = Math.round(scrollTop / ITEM_HEIGHT);
      
      // 범위 내에 있는지 확인 후 업데이트
      if (index >= 0 && index < items.length) {
        if (items[index] !== value) {
          onChange(items[index]);
        }
      }
    }
  };

  // 3. 마우스 드래그 시작
  const onMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setStartY(e.clientY);
    if (listRef.current) {
      setStartScrollTop(listRef.current.scrollTop);
    }
  };

  // 4. 마우스 드래그 중 (실제 스크롤 이동)
  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging || !listRef.current) return;
    e.preventDefault(); // 텍스트 선택 방지
    const deltaY = e.clientY - startY;
    listRef.current.scrollTop = startScrollTop - deltaY;
  };

  // 5. 마우스 드래그 끝
  const onMouseUp = () => {
    setIsDragging(false);
  };

  // 6. 클릭 시 해당 위치로 부드럽게 이동
  const handleClickItem = (index: number) => {
    if (listRef.current) {
      listRef.current.scrollTo({
        top: index * ITEM_HEIGHT,
        behavior: "smooth",
      });
    }
  };

  return (
    <WheelContainer
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <WheelList ref={listRef} onScroll={handleScroll}>
        <Spacer />
        {items.map((item, index) => (
          <WheelItem
            key={item}
            isActive={item === value}
            onClick={() => handleClickItem(index)}
          >
            {padZero ? item.toString().padStart(2, "0") : item}
          </WheelItem>
        ))}
        <Spacer />
      </WheelList>
    </WheelContainer>
  );
};

// -------------------------------------------------------------------------
// [Main Component] TimePickerModal
// -------------------------------------------------------------------------
const TimePickerModal: React.FC<TimePickerModalProps> = ({
  onTimeSelect,
  onTimeEnd,
  onClose,
  initialTime = { hour: 9, minute: 0 },
}) => {
  const [selectedHour, setSelectedHour] = useState(initialTime.hour);
  const [selectedMinute, setSelectedMinute] = useState(initialTime.minute);

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5);

  const handleConfirm = () => {
    const formattedHour = selectedHour.toString().padStart(2, "0");
    const formattedMinute = selectedMinute.toString().padStart(2, "0");

    // 종료 시간 계산 (예: 3시간 뒤)
    const endHourRaw = selectedHour + 3;
    const endHour = endHourRaw >= 24 ? endHourRaw - 24 : endHourRaw;
    const formattedEndHour = endHour.toString().padStart(2, "0");

    onTimeSelect(`${formattedHour}:${formattedMinute}`);
    onTimeEnd && onTimeEnd(`${formattedEndHour}:${formattedMinute}`);
    onClose();
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>시간 선택</Title>
        </ModalHeader>

        <PickerWrapper>
          <HighlightBar /> {/* 중앙 선택선 */}
          
          <Column>
            <Label>시</Label>
            <WheelPicker
              items={hours}
              value={selectedHour}
              onChange={setSelectedHour}
            />
          </Column>

          <Colon>:</Colon>

          <Column>
            <Label>분</Label>
            <WheelPicker
              items={minutes}
              value={selectedMinute}
              onChange={setSelectedMinute}
            />
          </Column>
          
          {/* 그라데이션 오버레이 */}
          <GradientTop />
          <GradientBottom />
        </PickerWrapper>

        <ButtonGroup>
          <CancelButton onClick={onClose}>취소</CancelButton>
          <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
        </ButtonGroup>
      </ModalContent>
    </Overlay>
  );
};

export default TimePickerModal;

/* --- Keyframes --- */
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
`;

/* --- Styles --- */

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 24px;
  padding: 24px;
  width: 320px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0,0,0,0.15);
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const ModalHeader = styled.div`
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
`;

const PickerWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${PICKER_HEIGHT}px;
  margin-bottom: 24px;
  background-color: #f9fafb;
  border-radius: 16px;
  overflow: hidden;
  user-select: none; /* 드래그 시 텍스트 선택 방지 */
`;

const Column = styled.div`
  position: relative;
  width: 80px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 2;
`;

const Label = styled.div`
  position: absolute;
  top: 10px;
  font-size: 11px;
  color: #9ca3af;
  font-weight: 600;
  z-index: 10;
`;

const Colon = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #d1d5db;
  margin-top: 10px;
  z-index: 2;
`;

const HighlightBar = styled.div`
  position: absolute;
  top: 50%;
  left: 10px;
  right: 10px;
  height: ${ITEM_HEIGHT}px;
  margin-top: -${ITEM_HEIGHT / 2}px; /* 정확히 중앙 정렬 */
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  z-index: 1;
`;

const GradientTop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom, rgba(249, 250, 251, 1), rgba(249, 250, 251, 0));
  pointer-events: none;
  z-index: 3;
`;

const GradientBottom = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to top, rgba(249, 250, 251, 1), rgba(249, 250, 251, 0));
  pointer-events: none;
  z-index: 3;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const BaseButton = styled.button`
  flex: 1;
  padding: 12px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
`;

const CancelButton = styled(BaseButton)`
  background-color: #f3f4f6;
  color: #4b5563;
  &:hover { background-color: #e5e7eb; }
`;

const ConfirmButton = styled(BaseButton)`
  background-color: #3b82f6;
  color: white;
  &:hover { background-color: #2563eb; }
`;

/* --- Wheel Picker Styles --- */

const WheelContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden; /* 스크롤바 숨김 */
  cursor: grab;
  
  &:active {
    cursor: grabbing;
  }
`;

const WheelList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  
  /* 스크롤바 숨기기 */
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  /* ⭐️ 핵심: CSS Scroll Snap 적용 */
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth; /* 부드러운 이동 */
`;

const Spacer = styled.li`
  /* 리스트의 첫 번째와 마지막 아이템이 중앙에 오게 하기 위한 여백 */
  height: ${(PICKER_HEIGHT - ITEM_HEIGHT) / 2}px;
`;

const WheelItem = styled.li<{ isActive: boolean }>`
  height: ${ITEM_HEIGHT}px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ isActive }) => (isActive ? "18px" : "15px")};
  font-weight: ${({ isActive }) => (isActive ? "700" : "400")};
  color: ${({ isActive }) => (isActive ? "#3b82f6" : "#9ca3af")};
  transition: all 0.2s ease;
  
  /* ⭐️ 핵심: 아이템 하나하나가 스냅 포인트가 됨 */
  scroll-snap-align: center; 
  cursor: pointer;
`;