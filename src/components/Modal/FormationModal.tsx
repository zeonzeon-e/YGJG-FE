import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import MiniButton from "../Button/MiniButton";
import TeamList3 from "../TeamList/TeamList3";

interface FormationModalProps {
  onClose: () => void;
  onSave: (circles: CirclePosition[]) => void;
}

interface CirclePosition {
  id: number;
  x: number;
  y: number;
  color: string;
  detail_position: string;
  name: string;
}

const FormationModal: React.FC<FormationModalProps> = ({ onClose, onSave }) => {
  const [circles, setCircles] = useState<CirclePosition[]>([]);
  const [draggingCircle, setDraggingCircle] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden"; // Disable background scroll

    return () => {
      document.body.style.overflow = originalStyle; // Re-enable background scroll
    };
  }, []);

  const getColorByPosition = (position: string): string => {
    switch (position) {
      case "공격수":
        return "var(--color-sk)";
      case "수비수":
        return "var(--color-dp)";
      case "미드필더":
        return "var(--color-mf)";
      case "골키퍼":
        return "var(--color-gk)";
      default:
        return "#9E9E9E";
    }
  };

  const handlePlayerSelect = (player: {
    name: string;
    detail_position: string;
    position: string;
  }) => {
    const imageRect = document
      .getElementById("formation-image")
      ?.getBoundingClientRect();
    if (imageRect) {
      const newCircle: CirclePosition = {
        id: circles.length + 1,
        x: imageRect.width / 2 - 15,
        y: imageRect.height / 2 - 15,
        color: getColorByPosition(player.position),
        detail_position: player.detail_position,
        name: player.name,
      };
      setCircles([...circles, newCircle]);
    }
  };
  const handlePlayerSelect2 = (player: {
    name: string;
    detail_position: string;
  }) => {
    const imageRect = document
      .getElementById("formation-image")
      ?.getBoundingClientRect();
    if (imageRect) {
      const newCircle: CirclePosition = {
        id: circles.length + 1,
        x: imageRect.width / 2 - 15,
        y: imageRect.height / 2 - 15,
        color: getColorByPosition(player.detail_position),
        detail_position: player.detail_position,
        name: player.name,
      };
      setCircles([...circles, newCircle]);
    }
  };

  const startDrag = useCallback(
    (
      id: number,
      event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      setDraggingCircle(id);
      const rect = event.currentTarget.getBoundingClientRect();
      setDragOffset({
        x:
          "touches" in event
            ? event.touches[0].clientX - rect.left
            : event.clientX - rect.left,
        y:
          "touches" in event
            ? event.touches[0].clientY - rect.top
            : event.clientY - rect.top,
      });
    },
    []
  );

  const onDrag = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      if (draggingCircle !== null) {
        const imageRect = document
          .getElementById("formation-image")
          ?.getBoundingClientRect();
        if (!imageRect) return;
        let x =
          "touches" in event
            ? event.touches[0].clientX - imageRect.left - dragOffset.x
            : event.clientX - imageRect.left - dragOffset.x;
        let y =
          "touches" in event
            ? event.touches[0].clientY - imageRect.top - dragOffset.y
            : event.clientY - imageRect.top - dragOffset.y;
        x = Math.max(0, Math.min(x, imageRect.width - 50));
        y = Math.max(0, Math.min(y, imageRect.height - 50));
        setCircles((prevCircles) =>
          prevCircles.map((circle) =>
            circle.id === draggingCircle ? { ...circle, x, y } : circle
          )
        );
      }
    },
    [draggingCircle, dragOffset]
  );

  const stopDrag = useCallback(() => {
    setDraggingCircle(null);
  }, []);

  const handleSave = () => {
    onSave(circles);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ScrollableTeamListContainer>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>X</CloseButton>
          <h4>포메이션을 설정하세요</h4>
          <MiniButton onClick={() => setCircles([])}>초기화</MiniButton>

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
                style={{
                  left: `${circle.x}px`,
                  top: `${circle.y}px`,
                  backgroundColor: circle.color,
                }}
                onMouseDown={(e) => startDrag(circle.id, e)}
                onTouchStart={(e) => startDrag(circle.id, e)}
              >
                {circle.detail_position}
                <br />
                {circle.name}
              </DraggableCircle>
            ))}
          </FormationImageContainer>

          <TeamList3 onPlayerSelect={handlePlayerSelect} />

          <SaveButton onClick={handleSave}>적용하기</SaveButton>
        </ModalContent>
      </ScrollableTeamListContainer>
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
  max-height: 90%;
  overflow: hidden;
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
  user-select: none;
`;

const FormationImage = styled.img`
  width: 100%;
`;

const DraggableCircle = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: grab;
  touch-action: none;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 12px;
  text-align: center;
`;

const ScrollableTeamListContainer = styled.div`
  max-height: 90%;
  overflow-y: auto;
  border: 1px solid #ddd;
  margin-bottom: 10px;
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
