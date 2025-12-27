import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { HiArrowPath } from "react-icons/hi2";
import { IoClose } from "react-icons/io5"; // 닫기 아이콘 변경 (선택사항, 없으면 X 텍스트 유지)
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
  playerId?: number;
}

interface FormationModalProps {
  onClose: () => void;
  onSave: (circles: CirclePosition[], formationName?: string) => void;
}

const CIRCLE_SIZE = 44; // 원 크기도 살짝 줄여서 비율 맞춤 (기존 50 -> 44)

const FormationModal: React.FC<FormationModalProps> = ({ onClose, onSave }) => {
  const [circles, setCircles] = useState<CirclePosition[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const dragOffsetRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastWHRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);
  const [initialPlayers, setInitialPlayers] = useState<Player[]>([]);
  const [formationName, setFormationName] = useState("");

  const [nameError, setNameError] = useState(false);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const { teamId } = useParams<{ teamId: string }>();
  const numericTeamId = Number(teamId);

  // 선수 목록 로딩
  useEffect(() => {
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
    if (["ST", "CF", "LW", "RW", "SS", "LF", "RF", "공격수"].includes(position)) return "var(--color-sk, #e74c3c)";
    if (["CM", "CAM", "CDM", "LM", "RM", "AM", "DM", "미드필더"].includes(position)) return "var(--color-mf, #2ecc71)";
    if (["CB", "LB", "RB", "LWB", "RWB", "WB", "SW", "WD", "수비수"].includes(position)) return "var(--color-dp, #3498db)";
    if (["GK", "골키퍼"].includes(position)) return "var(--color-gk, #f1c40f)";
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
        playerId: undefined,
      },
    ]);
  };

  const handlePlayerSelect = (player: {
    name: string;
    detail_position: string;
    position: string;
    id?: number;
    teamMemberId?: number;
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

  // 드래그 로직
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

  const handleFormationNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormationName(value);
    if (nameError && value.trim()) setNameError(false);
  };

  const handleSave = () => {
    if (!formationName.trim()) {
      setNameError(true);
      if (nameInputRef.current) {
        nameInputRef.current.focus();
        nameInputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
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

    const fetchFormationSave = async () => {
      if (!numericTeamId) return;
      try {
        await apiClient.post(
          "/api/team-strategy/save/formation",
          formationDetailRequestDtos,
          {
            headers: { "Content-Type": "application/json" },
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
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>포메이션 구성</Title>
          <CloseButton onClick={onClose}>
            <IoClose size={22} />
          </CloseButton>
        </Header>

        <Body>
          <InputGroup>
            <InputLabel>이름</InputLabel>
            <NameInput
              ref={nameInputRef}
              hasError={nameError}
              value={formationName}
              onChange={handleFormationNameChange}
              placeholder="예: 공격형 4-3-3"
            />
          </InputGroup>
          {nameError && <ErrorText>포메이션 이름을 입력해주세요.</ErrorText>}

          <FormationField ref={containerRef}>
            <FieldImage
              src={`${process.env.PUBLIC_URL}/formation.png`}
              alt="Formation Field"
              draggable={false}
              onLoad={() => {
                const rect = containerRef.current?.getBoundingClientRect();
                if (rect) lastWHRef.current = { w: rect.width, h: rect.height };
              }}
            />

            <ResetButton onClick={onReset} title="초기화">
              <HiArrowPath size={16} />
            </ResetButton>

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
                  {c.detail_position && <span className="pos">{c.detail_position}</span>}
                  {c.name && <span className="name">{c.name}</span>}
                </div>
              </DraggableCircle>
            ))}
          </FormationField>

          {availablePlayers.length > 0 && (
            <PlayerListWrapper>
              <SectionLabel>대기 선수</SectionLabel>
              <TeamList3
                players={availablePlayers}
                onPlayerSelect={handlePlayerSelect}
              />
            </PlayerListWrapper>
          )}

          <ColorSection>
            <SectionLabel>추가 마커</SectionLabel>
            <ColorPalette>
              {["#ef5350", "#42a5f5", "#66bb6a", "#fbc02d", "#78909c"].map((color) => (
                <ColorBtn
                  key={color}
                  color={color}
                  onClick={() => handleColorCircleAdd(color)}
                />
              ))}
            </ColorPalette>
          </ColorSection>
        </Body>

        <Footer>
          <SaveButton onClick={handleSave}>저장하기</SaveButton>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default FormationModal;

/* ===================== Styled Components ===================== */

// 애니메이션
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const popIn = keyframes`
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

// [Overlay] 화면 중앙 정렬을 위한 Flex 설정
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center; /* 수직 중앙 정렬의 핵심 */
  padding: 20px;
  animation: ${fadeIn} 0.25s ease-out;
  overflow-y: auto; /* 화면이 모달보다 작을 때 스크롤 허용 */
`;

// [Modal Container] 크기 축소 및 모던 디자인 적용
const ModalContainer = styled.div`
  width: 100%;
  max-width: 400px; /* 컴팩트한 사이즈 */
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${popIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  margin: auto; /* 화면 높이가 좁아 스크롤이 생길 때도 중앙 정렬 유지 */
  max-height: 90vh; /* 화면 꽉 차지 않게 */
`;

const Header = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f2f5;
  background: #fff;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;

  &:hover {
    background: #f3f4f6;
    color: #4b5563;
  }
`;

const Body = styled.div`
  padding: 24px;
  overflow-y: auto;
  
  /* 스크롤바 숨김 (깔끔하게) */
  scrollbar-width: none; 
  &::-webkit-scrollbar { display: none; }
`;

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

const InputLabel = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: #4b5563;
  width: 32px;
`;

const NameInput = styled.input<{ hasError: boolean }>`
  flex: 1;
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid ${({ hasError }) => (hasError ? "#ef4444" : "#e5e7eb")};
  background-color: #f9fafb;
  font-size: 14px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    background-color: #fff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const ErrorText = styled.div`
  font-size: 12px;
  color: #ef4444;
  margin: -4px 0 16px 44px;
`;

const FormationField = styled.div`
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  background-color: #e8f5e9; /* 이미지 로드 전 배경색 */
`;

const FieldImage = styled.img`
  width: 100%;
  display: block;
  user-select: none;
`;

const ResetButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(4px);
  border: none;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  transition: all 0.2s;
  z-index: 10;

  &:hover {
    background: #fff;
    transform: scale(1.05);
  }
`;

const DraggableCircle = styled.div`
  position: absolute;
  width: ${CIRCLE_SIZE}px;
  height: ${CIRCLE_SIZE}px;
  border-radius: 50%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: grab;
  touch-action: none;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255,255,255,0.3);
  border: 2px solid #fff; /* 흰색 테두리로 가시성 확보 */
  transition: transform 0.1s;

  &:active {
    cursor: grabbing;
    transform: scale(1.1);
    z-index: 100;
  }

  .label {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
    pointer-events: none;
    
    .pos {
      font-size: 10px;
      font-weight: 700;
      opacity: 0.9;
    }
    .name {
      font-size: 9px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 40px;
    }
  }
`;

const PlayerListWrapper = styled.div`
  margin-bottom: 20px;
`;

const SectionLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  margin-bottom: 8px;
`;

const ColorSection = styled.div`
  margin-bottom: 8px;
`;

const ColorPalette = styled.div`
  display: flex;
  gap: 12px;
`;

const ColorBtn = styled.button<{ color: string }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: 2px solid white;
  box-shadow: 0 0 0 1px #e5e7eb;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.15);
  }
`;

const Footer = styled.div`
  padding: 16px 24px 24px;
  border-top: 1px solid #f0f2f5;
  background: #fff;
`;

const SaveButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  border: none;
  background: #3b82f6; /* Modern Blue */
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #2563eb;
  }
`;