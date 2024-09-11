import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";

interface FormationModalProps {
  onClose: () => void;
}

interface CirclePosition {
  id: number;
  x: number;
  y: number;
}

const FormationModal: React.FC<FormationModalProps> = ({ onClose }) => {
  const [circles, setCircles] = useState<CirclePosition[]>([]);
  const [draggingCircle, setDraggingCircle] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  // 모달이 열렸을 때 스크롤 방지
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // 원 추가 함수
  const addCircle = () => {
    const newCircle: CirclePosition = {
      id: circles.length + 1,
      x: 50, // 초기 위치 (x, y) 설정
      y: 50,
    };
    setCircles([...circles, newCircle]);
  };

  // 드래그 시작 (마우스 + 터치)
  const startDrag = useCallback(
    (
      id: number,
      event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      setDraggingCircle(id);
      const rect = event.currentTarget.getBoundingClientRect();

      if ("touches" in event) {
        setDragOffset({
          x: event.touches[0].clientX - rect.left,
          y: event.touches[0].clientY - rect.top,
        });
      } else {
        setDragOffset({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    },
    []
  );

  // 드래그 중 (마우스 + 터치)
  const onDrag = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      if (draggingCircle !== null) {
        const imageRect = document
          .getElementById("formation-image")
          ?.getBoundingClientRect();
        if (!imageRect) return;

        let x: number, y: number;
        if ("touches" in event) {
          x = event.touches[0].clientX - imageRect.left - dragOffset.x;
          y = event.touches[0].clientY - imageRect.top - dragOffset.y;
        } else {
          x = event.clientX - imageRect.left - dragOffset.x;
          y = event.clientY - imageRect.top - dragOffset.y;
        }

        // 원이 이미지 바깥으로 나가지 않도록 제한
        x = Math.max(0, Math.min(x, imageRect.width - 60)); // 원의 너비(30px)를 고려하여 제한
        y = Math.max(0, Math.min(y, imageRect.height - 60)); // 원의 높이(30px)를 고려하여 제한

        setCircles((prevCircles) =>
          prevCircles.map((circle) =>
            circle.id === draggingCircle ? { ...circle, x, y } : circle
          )
        );
      }
    },
    [draggingCircle, dragOffset]
  );

  // 드래그 종료 (마우스 + 터치)
  const stopDrag = useCallback(() => {
    setDraggingCircle(null);
  }, []);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>X</CloseButton>
        <h4>포메이션을 설정하세요</h4>

        {/* Formation Image */}
        <FormationImageContainer
          id="formation-image"
          onMouseMove={onDrag}
          onMouseUp={stopDrag}
          onTouchMove={onDrag}
          onTouchEnd={stopDrag}
        >
          <FormationImage src="/formation.png" alt="Formation Field" />
          {circles.map((circle) => (
            <DraggableCircle
              key={circle.id}
              style={{ left: `${circle.x}px`, top: `${circle.y}px` }}
              onMouseDown={(e) => startDrag(circle.id, e)}
              onTouchStart={(e) => startDrag(circle.id, e)}
            />
          ))}
        </FormationImageContainer>

        <AddCircleButton onClick={addCircle}>원 추가</AddCircleButton>
        <SaveButton onClick={onClose}>적용하기</SaveButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FormationModal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 90%;
  max-width: 500px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const FormationImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  display: inline-block;
  border: 1px solid #ddd;
  margin-bottom: 20px;
  user-select: none; /* 텍스트 드래그 방지 */
`;

const FormationImage = styled.img`
  width: 100%;
`;

const DraggableCircle = styled.div`
  position: absolute;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: red;
  cursor: grab;
  touch-action: none; /* 모바일 터치로 드래그 할 때 사용 */
`;

const AddCircleButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 10px;
  cursor: pointer;
  width: 100%;
`;

const SaveButton = styled.button`
  background-color: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  margin-top: 20px;
  width: 100%;
  cursor: pointer;
`;
