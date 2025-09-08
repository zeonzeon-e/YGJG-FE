import React, { useState, useCallback, useEffect } from "react";
import styled from "styled-components";
import MiniButton from "../Button/MiniButton";
import TeamList3 from "../TeamList/TeamList3";
import { useParams } from "react-router-dom";
import apiClient from "../../api/apiClient";

interface Player {
  id: number;
  name: string;
  position: string; // 예: "ST", "CF", "LW", "RW", "GK" 등
  profileUrl?: string; // 프로필 이미지 URL
  role?: string; // 다른 필드가 필요하면 추가
}

interface FormationModalProps {
  onClose: () => void;
  onSave: (circles: CirclePosition[]) => void;
}

// 포메이션 위치한 원
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
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>();
  const { teamId } = useParams();
  const numericTeamId = Number(teamId);
  useEffect(() => {
    const fetchPlayers = async () => {
      if (!numericTeamId) return;

      try {
        const response = await apiClient.get<Player[]>(
          `/api/team-strategy/get-position/name`,
          {
            params: {
              positionName: "",
              teamId: numericTeamId,
            },
            headers: {
              "X-AUTH-TOKEN": "사용자 인증 토큰",
            },
          }
        );

        // 새로운 데이터 수신 후 무한 스크롤 상태 초기화
        setAvailablePlayers(response.data);
      } catch (error) {
        console.error("Failed to fetch players:", error);
      }
    };

    fetchPlayers();
  }, []);
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

  // 선택된 색상의 원을 추가하는 함수
  const handleColorCircleAdd = (color: string) => {
    const imageRect = document
      .getElementById("formation-image")
      ?.getBoundingClientRect();
    if (imageRect) {
      const newCircle: CirclePosition = {
        id: circles.length + 1,
        x: imageRect.width / 2 - 15,
        y: imageRect.height / 2 - 15,
        color: color,
        detail_position: "", // 색상 선택 시 별도의 포지션 대신 Custom으로 추가
        name: "",
      };
      setCircles([...circles, newCircle]);
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
      // 선택된 선수를 availablePlayers에서 제거
      setAvailablePlayers((prevPlayers) =>
        prevPlayers?.filter(
          (p) =>
            !(p.name === player.name && p.position === player.detail_position)
        )
      );
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

  const onReset = () => {
    setCircles([]);
    setAvailablePlayers([]);
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ScrollableTeamListContainer>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>X</CloseButton>
          <FomationTitle>
            <h3>포메이션을 설정하세요</h3>
            <MiniButton onClick={onReset}>초기화</MiniButton>
          </FomationTitle>

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

          {availablePlayers && (
            <TeamList3
              players={availablePlayers}
              onPlayerSelect={handlePlayerSelect}
            />
          )}
          <ColorSelectionContainer>
            <CircleButton
              color="red"
              onClick={() => handleColorCircleAdd("red")}
            >
              <ColorCircle color="red" />
            </CircleButton>
            <CircleButton
              color="blue"
              onClick={() => handleColorCircleAdd("blue")}
            >
              <ColorCircle color="blue" />
            </CircleButton>
            <CircleButton
              color="green"
              onClick={() => handleColorCircleAdd("green")}
            >
              <ColorCircle color="green" />
            </CircleButton>
            <CircleButton
              color="yellow"
              onClick={() => handleColorCircleAdd("yellow")}
            >
              <ColorCircle color="yellow" />
            </CircleButton>
            <CircleButton
              color="gray"
              onClick={() => handleColorCircleAdd("gray")}
            >
              <ColorCircle color="gray" />
            </CircleButton>
          </ColorSelectionContainer>
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
  width: 89%;
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

const FomationTitle = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  & > h3 {
    padding-right: 10px;
  }
`;

const FormationImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  display: inline-block;
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
  margin-bottom: 10px;
  border-radius: 10px;
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
  font-family: Pretendard-Medium;
  font-size: 18px;
`;

const ColorSelectionContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
`;

const ColorCircle = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const CircleButton = styled.div<{ color: string }>`
  display: flex;
  padding: 10px;
  align-items: center;
  text-align: center;
  border-radius: 100px;
  background-color: ${(props) => props.color};
  width: 25px;
  height: 25px;
  margin: 10px;
  border: 1px solid var(--color-dark2);
`;
