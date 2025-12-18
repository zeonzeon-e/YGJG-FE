import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { HiArrowPath } from "react-icons/hi2";
import TeamList3 from "../TeamList/TeamList3";
import { useParams } from "react-router-dom";
import apiClient from "../../api/apiClient";

interface Player {
  id: number;
  name: string;
  position: string;
  profileUrl?: string;
  role?: string;
  detail_position?: string;
  teamMemberId: number;
}

interface CirclePosition {
  id: number;
  x: number;
  y: number;
  color: string;
  detail_position: string;
  name: string;
  /** ✅ 원과 연결된 실제 선수 id (색상 원만 추가한 경우는 undefined) */
  playerId?: number;
}

interface FormationModalProps {
  onClose: () => void;
  onSave: (circles: CirclePosition[], formationName?: string) => void;
}

const CIRCLE_SIZE = 50;

const FormationModal: React.FC<FormationModalProps> = ({ onClose, onSave }) => {
  const [circles, setCircles] = useState<CirclePosition[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastWHRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [initialPlayers, setInitialPlayers] = useState<Player[]>([]);
  const [formationName, setFormationName] = useState("");
  const [formationList, setFormationList] = useState<Player[]>([]); // 필요시 사용

  // 이름 에러 상태 & 인풋 ref
  const [nameError, setNameError] = useState(false);
      const nameInputRef = useRef<HTMLInputElement | null>(null);

  const { teamId } = useParams<{ teamId: string }>();
  const numericTeamId = Number(teamId);

  // 선수 목록 로딩
  useEffect(() => {
    // const fetchGameName = async () => {
    //   if (!numericTeamId) return;
    //   try {
    //     const response = await apiClient.get<Player[]>(
    //       `/api/team-strategy/get-position/name`,
    //       {
    //         params: { positionName: "", teamId: numericTeamId },
    //       }
    //     );
    //     setAvailablePlayers(response.data ?? []);
    //     setInitialPlayers(response.data ?? []);
    //   } catch (error) {
    //     console.error("Failed to fetch players:", error);
    //   }
    // };
    // fetchGameName();

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
console.log(availablePlayers)
  // 바디 스크롤 잠금
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, []);

  // 컨테이너 크기 초기화 + 관찰
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (lastWHRef.current.w === 0 || lastWHRef.current.h === 0) {
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

    updateSize();

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

  // 포지션별 색상
  const getColorByPosition = (pos: string): string => {
    const position = pos.toUpperCase().trim() || "";

    if (["ST", "CF", "LW", "RW", "SS", "LF", "RF", "공격수"].includes(position)) {
      return "var(--color-sk)";
    }
    if (["CM", "CAM", "CDM", "LM", "RM", "AM", "DM", "미드필더"].includes(position)) {
      return "var(--color-mf)";
    }
    if (
      ["CB", "LB", "RB", "LWB", "RWB", "WB", "SW", "WD", "수비수"].includes(
        position
      )
    ) {
      return "var(--color-dp)";
    }
    if (["GK", "골키퍼"].includes(position)) {
      return "var(--color-gk)";
    }
    return "#95a5a6";
  };

  const getCenterXY = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return {
      x: rect.width / 2 - CIRCLE_SIZE / 2,
      y: rect.height / 2 - CIRCLE_SIZE / 2,
    };
  };

  // 색상 원 추가 (독립적인 마커용)
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
        playerId: undefined, // 선수 미연결
      },
    ]);
  };

  // 선수 선택 시 원 추가 + 목록에서 제거
  const handlePlayerSelect = (player: {
    name: string;
    detail_position: string;
    position: string;
    id?: number;
    teamMemberId?: number;
  }) => {
    const { x, y } = getCenterXY();

    //console.log(player)
    setCircles((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        x,
        y,
        color: getColorByPosition(player.position),
        detail_position: player.detail_position,
        name: player.name,
        playerId: player.teamMemberId, 
      },
    ]);

    setAvailablePlayers((prev) =>
      prev.filter(
        (p) =>
          !(
            p.name === player.name &&
            (p.detail_position || "") === (player.detail_position || "")
          )
      )
    );
  };

  const handlePointerDown =
    (id: number) => (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDraggingId(id);
      const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
      dragOffsetRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
      (e.currentTarget as HTMLDivElement).setPointerCapture?.(e.pointerId);
    };

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
    setNameError(false);
  };

  const handleFormationNameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setFormationName(value);
    if (nameError && value.trim()) {
      setNameError(false);
    }
  };

const handleSave = () => {
  if (!formationName.trim()) {
    setNameError(true);
    if (nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    return;
  }

  const formationDetailRequestDtos = circles
    .filter((c) => c.playerId != null)
    .map((c) => ({
      playerId: c.playerId as number,
      x: Math.round(c.x),
      y: Math.round(c.y),
    }));

  // const fetchFormationSave = async () => {
  //   if (!numericTeamId) return;
  //   try {
  //     await apiClient.post(`/api/team-strategy/save/formation`, {
  //       teamId: numericTeamId,
  //       formationName: formationName,
  //       formationDetailRequestDtos : JSON.stringify(formationDetailRequestDtos),
  //     });
  //   } catch (error) {
  //     console.error("Failed to save formation:", error);
  //   }
  // };
const fetchFormationSave = async () => {
    if (!numericTeamId) return;

    try {
      await apiClient.post(
        "/api/team-strategy/save/formation",
        // ⭐ body: formationDetailRequestDtos (배열 자체를 body로 보냄)

        formationDetailRequestDtos,
        {
           headers: { "Content-Type": "application/json" },
          // ⭐ query: formationName, teamId
          params: {
            formationName,
            teamId: numericTeamId,
          },
        }
      );
    } catch (error) {
      console.error("Failed to save formation:", error);
    }
  };


  fetchFormationSave();
  onSave(circles, formationName);
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
          </FomationTitle>

          <FomationTitle>
            <div style={{ minWidth: 90 }}>포메이션 이름</div>
            <NameInput
              ref={nameInputRef}
              hasError={nameError}
              value={formationName}
              onChange={handleFormationNameChange}
              placeholder="포메이션 이름을 입력해주세요"
            />
          </FomationTitle>
          {nameError && (
            <ErrorText>포메이션 이름을 입력해주세요.</ErrorText>
          )}

          <FormationImageContainer ref={containerRef}>
            <RefreshButton aria-label="포메이션 새로고침" onClick={onReset}>
              <HiArrowPath size={18} />
            </RefreshButton>
            <FormationImage
              src={`${process.env.PUBLIC_URL}/formation.png`}
              alt="Formation Field"
              draggable={false}
              onLoad={() => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect)
                  lastWHRef.current = { w: rect.width, h: rect.height };
              }}
            />

            {circles.map((c) => (
              <DraggableCircle
                key={c.id}
                style={{
                  left: `${c.x}px`,
                  top: `${c.y}px`,
                  backgroundColor: c.color,
                }}
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
            <TeamList3
              players={availablePlayers}
              onPlayerSelect={handlePlayerSelect}
            />
          )}

          <ColorSelectionContainer aria-label="색상 선택">
            {["red", "blue", "green", "yellow", "gray"].map((color) => (
              <CircleButton
                key={color}
                color={color}
                onClick={() => handleColorCircleAdd(color)}
              >
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
  background: rgba(5, 10, 20, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  z-index: 1000;
  overflow-y: auto;
  padding: 24px 16px;
`;

const ScrollableTeamListContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  padding: 32px 28px 24px;
  width: min(520px, 100%);
  max-height: calc(100vh - 80px);
  border-radius: 24px;
  box-shadow: 0 30px 60px rgba(13, 40, 80, 0.25);
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;

  @media (max-width: 480px) {
    padding: 24px 20px 20px;
    border-radius: 20px;
    gap: 16px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.05);
  font-size: 20px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const FomationTitle = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 4px;

  h3 {
    margin: 0;
    font-size: 20px;
    color: var(--color-dark2);
  }
`;

const NameInput = styled.input<{ hasError: boolean }>`
  flex: 1;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid ${({ hasError }) => (hasError ? "#f16c6c" : "#dfe4ec")};
  font-size: 14px;
  font-family: "Pretendard-Medium";
  background: white;
  transition: border 0.2s ease, box-shadow 0.2s ease;

  &:focus {
    outline: none;
    border-color: ${({ hasError }) => (hasError ? "#f16c6c" : "var(--color-main)")};
    box-shadow: ${({ hasError }) =>
      hasError
        ? "0 0 0 3px rgba(241, 108, 108, 0.2)"
        : "0 0 0 3px rgba(14, 98, 68, 0.15)"};
  }

  &::placeholder {
    color: #b8bfcc;
  }
`;

const ErrorText = styled.div`
  margin: -6px 0 10px auto;
  font-size: 12px;
  color: #f16c6c;
`;

const FormationImageContainer = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 20px;
  user-select: none;
`;

const RefreshButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  background: rgba(0, 0, 0, 0.35);
  border: none;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: background 0.2s ease, transform 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
    transform: translateY(-1px);
  }
`;

const FormationImage = styled.img`
  width: 100%;
  display: block;
  pointer-events: none;
  border-radius: 20px;
`;

const DraggableCircle = styled.div`
  position: absolute;
  width: ${CIRCLE_SIZE}px;
  height: ${CIRCLE_SIZE}px;
  border-radius: 50%;
  color: #fff;
  font-size: 12px;
  line-height: 1.1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: grab;
  touch-action: none;
  box-shadow: 0 8px 16px rgba(8, 24, 68, 0.25);

  .label {
    pointer-events: none;
  }
`;

const ColorSelectionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CircleButton = styled.button<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--color-main);
  }
`;

const ColorCircle = styled.div<{ color: string }>`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background-color: ${(p) => p.color};
`;

const SaveButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, var(--color-main) 0%, #0c5135 100%);
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 14px 20px;
  margin-top: 10px;
  font-family: "Pretendard-Bold";
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 18px 35px rgba(12, 81, 53, 0.3);
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;
