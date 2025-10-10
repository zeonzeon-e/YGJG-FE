import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from "styled-components";
import MiniButton from "../Button/MiniButton";
import TeamList3 from "../TeamList/TeamList3";
import { useParams } from "react-router-dom";
import apiClient from "../../api/apiClient";

interface Player {
  id: number;
  name: string;
  position: string; // "공격수" | "미드필더" | "수비수" | "골키퍼"
  profileUrl?: string;
  role?: string;
  detail_position?: string; // API에 있다면 사용
}

interface CirclePosition {
  id: number;
  x: number; // px (컨테이너 기준)
  y: number; // px (컨테이너 기준)
  color: string;
  detail_position: string;
  name: string;
}


interface FormationModalProps {
  onClose: () => void;
  onSave: (circles: CirclePosition[]) => void;
}

const CIRCLE_SIZE = 50;

const FormationModal: React.FC<FormationModalProps> = ({ onClose, onSave }) => {
  const [circles, setCircles] = useState<CirclePosition[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 컨테이너 사이즈 추적(반응형)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastWHRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [initialPlayers, setInitialPlayers] = useState<Player[]>([]);
  const [formationName, setFormationName] = useState("");
  const [formationList, setFormationList] = useState<Player[]>([]);

  const { teamId } = useParams<{ teamId: string }>();
  const numericTeamId = Number(teamId);

  // 선수 목록 로딩
  useEffect(() => {
    const fetchGameName = async () => {
      if (!numericTeamId) return;
      try {
        const response = await apiClient.get<Player[]>(
          `/api/team-strategy/get-position/name`,
          {
            params: { positionName: "", teamId: numericTeamId },
          }
        );
        setAvailablePlayers(response.data ?? []);
        setInitialPlayers(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch players:", error);
      }
    };
    fetchGameName();

     const fetchPlayers = async () => {
      if (!numericTeamId) return;
      try {
        const response = await apiClient.get<Player[]>(
          `/api/team/${numericTeamId}/memberList`,
          {
            params: { position: "전체", teamId: numericTeamId },
          }
        );
        setAvailablePlayers(response.data ?? []);
        setInitialPlayers(response.data ?? []);
      } catch (error) {
        console.error("Failed to fetch players:", error);
      }
    };
    fetchPlayers();
  }, [numericTeamId]);

  // 바디 스크롤 잠금
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // 컨테이너 크기 초기화 + 관찰(ResizeObserver)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (lastWHRef.current.w === 0 || lastWHRef.current.h === 0) {
        // 최초 기록
        lastWHRef.current = { w: rect.width, h: rect.height };
        return;
      }
      const prev = lastWHRef.current;
      if (prev.w !== rect.width || prev.h !== rect.height) {
        const sx = rect.width / prev.w;
        const sy = rect.height / prev.h;
        setCircles((prevCircles) =>
          prevCircles.map((c) => ({
            ...c,
            x: Math.max(0, Math.min(c.x * sx, rect.width - CIRCLE_SIZE)),
            y: Math.max(0, Math.min(c.y * sy, rect.height - CIRCLE_SIZE)),
          }))
        );
        lastWHRef.current = { w: rect.width, h: rect.height };
      }
    };

    // 최초 한 번 동기화
    updateSize();

    // ResizeObserver로 컨테이너 사이즈 관찰
  // 2) ResizeObserver가 있으면 사용, 없으면 윈도우 리사이즈로 폴백
  const RO = (window as any).ResizeObserver as
    | typeof ResizeObserver
    | undefined;

  let ro: ResizeObserver | null = null;
  let onWinResize: (() => void) | null = null;

  if (RO) {
    ro = new RO(() => {
      updateSize();
    });
    ro.observe(el);
  } else {
    onWinResize = () => updateSize();
    window.addEventListener("resize", onWinResize);
  }

  return () => {
    ro?.disconnect();
    if (onWinResize) window.removeEventListener("resize", onWinResize);
  };
  }, []);

  /**
   * 포지션별로 배경색을 지정하는 함수
   * - ST, CF, LW, RW 등 공격수 계열은 빨강
   * - CM, CDM, CAM 등 미드필더 계열은 초록
   * - CB, LB, RB 등 수비수 계열은 파랑
   * - GK는 노랑
   * - 그 외는 회색
   */
  const getColorByPosition = (pos: string): string => {
    const position = pos.toUpperCase().trim() || "";

    // 공격수 계열
    if (["ST", "CF", "LW", "RW", "SS", "LF", "RF", "공격수"].includes(position)) {
      return "var(--color-sk)"; // 빨강 (공격수)
    }

    // 미드필더 계열
    if (["CM", "CAM", "CDM", "LM", "RM", "AM", "DM", "미드필더"].includes(position)) {
      return "var(--color-mf)"; // 초록 (미드필더)
    }

    // 수비수 계열
    if (["CB", "LB", "RB", "LWB", "RWB", "WB", "SW", "WD", "수비수"].includes(position)) {
      return "var(--color-dp)"; // 파랑 (수비수)
    }

    // 골키퍼
    if (["GK", "골키퍼"].includes(position)) {
      return "var(--color-gk)"; // 노랑 (골키퍼)
    }

    // 그 외
    return "#95a5a6";
  };

  // 중앙 좌표 계산 도우미
  const getCenterXY = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: rect.width / 2 - CIRCLE_SIZE / 2,
      y: rect.height / 2 - CIRCLE_SIZE / 2,
    };
  };

  // 색상 원 추가
  const handleColorCircleAdd = (color: string) => {
    const { x, y } = getCenterXY();
    setCircles((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        x,
        y,
        color,
        detail_position: "",
        name: "",
      },
    ]);
  };

  // 선수 선택 시 원 추가 + 목록에서 제거
  const handlePlayerSelect = (player: {
    name: string;
    detail_position: string;
    position: string;
  }) => {
    const { x, y } = getCenterXY();
    setCircles((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        x,
        y,
        color: getColorByPosition(player.position),
        detail_position: player.detail_position,
        name: player.name,
      },
    ]);

    setAvailablePlayers((prev) =>
      prev.filter(
        (p) => !(p.name === player.name && p.detail_position === player.detail_position)
      )
    );
  };

  // 드래그 시작: 원 내부 클릭 위치 저장
  const handlePointerDown = (id: number) => (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDraggingId(id);
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    dragOffsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
  };

  // 드래그 중 전역 리스너
  useEffect(() => {
    if (draggingId === null) return;

    const move = (e: PointerEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      let x = e.clientX - rect.left - dragOffsetRef.current.x;
      let y = e.clientY - rect.top - dragOffsetRef.current.y;

      x = Math.max(0, Math.min(x, rect.width - CIRCLE_SIZE));
      y = Math.max(0, Math.min(y, rect.height - CIRCLE_SIZE));

      setCircles((prev) =>
        prev.map((c) => (c.id === draggingId ? { ...c, x, y } : c))
      );
    };

    const up = () => setDraggingId(null);

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, [draggingId]);

  const onReset = () => {
    setCircles([]);
    setAvailablePlayers(initialPlayers);
    setFormationName("");
  };

  const handleSave = () => {
    onSave(circles);
    onClose();
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ScrollableTeamListContainer>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton aria-label="닫기" onClick={onClose}>
            ×
          </CloseButton>

          <FomationTitle>
            <h3>포메이션 추가하기</h3>
            <MiniButton onClick={onReset}>초기화</MiniButton>
          </FomationTitle>

          <FomationTitle>
            <div style={{ minWidth: 90 }}>포메이션 이름</div>
            <input
              value={formationName}
              onChange={(e) => setFormationName(e.target.value)}
              placeholder="포메이션 이름을 입력해주세요"
              style={{ flex: 1 }}
            />
          </FomationTitle>

          <FormationImageContainer ref={containerRef}>
            <FormationImage
              src={`${process.env.PUBLIC_URL}/formation.png`}
              alt="Formation Field"
              draggable={false}
              onLoad={() => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) lastWHRef.current = { w: rect.width, h: rect.height };
              }}
            />

            {circles.map((c) => (
              <DraggableCircle
                key={c.id}
                style={{ left: `${c.x}px`, top: `${c.y}px`, backgroundColor: c.color }}
                onPointerDown={handlePointerDown(c.id)}
              >
                <div className="label">
                  {c.detail_position && <div>{c.detail_position}</div>}
                  {c.name && <div>{c.name}</div>}
                </div>
              </DraggableCircle>
            ))}
          </FormationImageContainer>

          {availablePlayers.length > 0 && (
            <TeamList3 players={availablePlayers} onPlayerSelect={handlePlayerSelect} />
          )}

          <ColorSelectionContainer aria-label="색상 선택">
            {["red", "blue", "green", "yellow", "gray"].map((color) => (
              <CircleButton key={color} color={color} onClick={() => handleColorCircleAdd(color)}>
                <ColorCircle color={color} />
              </CircleButton>
            ))}
          </ColorSelectionContainer>

          <SaveButton onClick={handleSave}>적용하기</SaveButton>
        </ModalContent>
      </ScrollableTeamListContainer>
    </ModalOverlay>
  );
};

export default FormationModal;

/* ===================== styled ===================== */

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ScrollableTeamListContainer = styled.div`
  max-height: 80%;
  overflow-x: auto;
  //overflow-y: auto;
  border-radius: 10px;
`;

const ModalContent = styled.div`
  background: #fff;
  padding: 20px;
  width: 89%;
  max-width: 500px;
  max-height: 90%;
  border-radius: 10px;
  position: relative;
  overflow: hidden;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px; right: 10px;
  background: none; border: none;
  font-size: 20px; cursor: pointer;
`;

const FomationTitle = styled.div`
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 10px;
  & > h3 { padding-right: 10px; margin: 0; }
  & input { padding: 6px 10px; border: 1px solid #ccc; border-radius: 6px; }
`;

const FormationImageContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  user-select: none;
`;

const FormationImage = styled.img`
  width: 100%;
  display: block;
  pointer-events: none; /* 이미지 위에서 드래그 선택 방지 */
`;

const DraggableCircle = styled.div`
  position: absolute;
  width: ${CIRCLE_SIZE}px;
  height: ${CIRCLE_SIZE}px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  line-height: 1.1;
  display: flex; justify-content: center; align-items: center;
  text-align: center;
  cursor: grab;
  touch-action: none; /* 터치 스크롤과 충돌 방지 */
  .label { pointer-events: none; }
`;

const ColorSelectionContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 15px;
`;

const CircleButton = styled.button<{ color: string }>`
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 50%;
  border: 1px solid var(--color-dark2, #666);
  background: #fff; cursor: pointer;
`;

const ColorCircle = styled.div<{ color: string }>`
  width: 20px; height: 20px; border-radius: 50%;
  background-color: ${(p) => p.color};
`;

const SaveButton = styled.button`
  width: 100%;
  background-color: #4caf50; color: #fff;
  border: none; border-radius: 8px;
  padding: 10px 20px;
  margin-top: 20px;
  font-family: Pretendard-Medium, system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial;
  font-size: 18px;
  cursor: pointer;
`;
