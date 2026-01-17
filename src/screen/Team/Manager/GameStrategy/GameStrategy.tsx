import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import GlobalStyles from "../../../../components/Styled/GlobalStyled";
import Header2 from "../../../../components/Header/Header2/Header2";
import MainButton from "../../../../components/Button/MainButton";
import { format } from "date-fns";
import CalendarModal from "../../../../components/Modal/CalendarModal";
import TimePickerModal from "../../../../components/Modal/TimePickerModal";
import { ko } from "date-fns/locale";
import Input from "../../../../components/Input/Input";
import Input2 from "../../../../components/Input/Input2";
import KakaoMapModal from "../../../../components/Modal/KakaoAddress";
import FormationModal from "../../../../components/Modal/FormationModal";
import FormationListModal from "../../../../components/Modal/FormationListModal";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import apiClient from "../../../../api/apiClient";

interface CirclePosition {
  id: number;
  x: number;
  y: number;
  color: string;
  detail_position: string;
  name: string;
  playerId?: number;
}

const CIRCLE_SIZE = 44;

const GameStrategy: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    const state = location.state as { selectedDate?: string };
    if (state?.selectedDate) {
      const [year, month, day] = state.selectedDate.split("-").map(Number);
      setSelectedDate(new Date(year, month - 1, day));
    }
  }, [location.state]);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSTimePicker, setShowSTimePicker] = useState(false);
  const [showETimePicker, setShowETimePicker] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showFormationModal, setShowFormationModal] = useState(false);
  const [formationName, setFormationName] = useState<string>("");
  const [showFormationModal2, setShowFormationModal2] = useState(false);

  // New States
  const [opposingTeam, setOpposingTeam] = useState("");
  const [matchStrategy, setMatchStrategy] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
  const [formationId, setFormationId] = useState<number>(10);

  const [formationCircles, setFormationCircles] = useState<CirclePosition[]>([]);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const lastPreviewWH = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
  };

  const handleFormationSave = (circles: CirclePosition[], name?: string, id?: number) => {
    setFormationCircles(circles);
    if (name) setFormationName(name);
    if (id) setFormationId(id);
  };

  const handleFormationSave2 = (circles: CirclePosition[], name?: string, id?: number) => {
    setFormationCircles(circles);
    if (name) setFormationName(name);
    if (id) setFormationId(id);
  };

  const handlePostStrategy = async () => {
    if (!selectedDate || !startTime || !endTime || !opposingTeam || !selectedAddress) {
      alert("모든 필수 정보를 입력해주세요.");
      return;
    }

    try {
      const payload = {
        address: String(`${selectedAddress} ${detailAddress}`).trim(),
        formationId: Number(formationId),
        matchDay: String(format(selectedDate, "yyyy-MM-dd")),
        matchEndTime: String(endTime),
        matchStartTime: String(startTime),
        matchStrategy: String(matchStrategy),
        opposingTeam: String(opposingTeam),
        teamId: Number(teamId),
      };

      await apiClient.post("/api/team-strategy/save/team-strategy", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      alert("전략이 성공적으로 게시되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error("전략 게시 실패:", error);
      alert("전략 게시에 실패했습니다.");
    }
  };

  useEffect(() => {
    const el = previewRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    if (lastPreviewWH.current.w === 0) {
      lastPreviewWH.current = { w: rect.width, h: rect.height };
    }

    const updateSize = () => {
      const currentRect = el.getBoundingClientRect();
      const prev = lastPreviewWH.current;

      if (prev.w !== 0 && (prev.w !== currentRect.width || prev.h !== currentRect.height)) {
        const sx = currentRect.width / prev.w;
        const sy = currentRect.height / prev.h;

        setFormationCircles((prevCircles) =>
          prevCircles.map((c) => ({
            ...c,
            x: c.x * sx,
            y: c.y * sy,
          }))
        );
        lastPreviewWH.current = { w: currentRect.width, h: currentRect.height };
      }
    };

    const RO = (window as any).ResizeObserver as typeof ResizeObserver | undefined;
    let ro: ResizeObserver | null = null;

    if (RO) {
      ro = new RO(() => updateSize());
      ro.observe(el);
    } else {
      window.addEventListener("resize", updateSize);
    }

    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [formationCircles]);

  return (
    <>
      <GlobalStyles />
      <Header2 text="경기 전략" />
      <PageWrapper>
        <ContentWrapper>
          <SectionCard>
            <SectionHeader>
              <SectionTitle>경기 일정</SectionTitle>
              <SectionDescription>
                경기 날짜와 시간을 선택하여 전술 계획을 시작하세요.
              </SectionDescription>
            </SectionHeader>
            <ButtonRow>
              <StrategyButton onClick={() => setShowDatePicker(true)}>
                {selectedDate
                  ? format(selectedDate, "MM월 dd일 EEEE", { locale: ko })
                  : "날짜를 선택하세요"}
              </StrategyButton>
            </ButtonRow>
            <ButtonRow>
              <StrategyButton onClick={() => setShowSTimePicker(true)}>
                {startTime ? `시작 시간 · ${startTime}` : "시작 시간을 선택하세요"}
              </StrategyButton>
              <StrategyButton onClick={() => setShowETimePicker(true)}>
                {endTime ? `종료 시간 · ${endTime}` : "종료 시간을 선택하세요"}
              </StrategyButton>
            </ButtonRow>
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>상대 팀 정보</SectionTitle>
              <SectionDescription>
                준비 중인 경기의 상대 팀을 입력해주세요.
              </SectionDescription>
            </SectionHeader>
            <StyledInput 
              type="text" 
              placeholder="상대팀명을 입력해주세요" 
              value={opposingTeam}
              onChange={(e) => setOpposingTeam(e.target.value)}
            />
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>경기장 정보</SectionTitle>
              <SectionDescription>
                경기 장소를 검색하거나 직접 입력할 수 있어요.
              </SectionDescription>
            </SectionHeader>
            <AddressStack>
              <StyledInput2
                type="string"
                height={40}
                value={selectedAddress}
                placeholder="경기장을 검색해주세요"
              />
              {selectedAddress && (
                <StyledInput
                  type="string"
                  placeholder="상세주소를 입력해주세요(선택)"
                  value={detailAddress}
                  onChange={(e) => setDetailAddress(e.target.value)}
                />
              )}
            </AddressStack>
            <ButtonRow>
              <SecondaryButton onClick={() => setShowMapModal(true)}>
                주소 찾기
              </SecondaryButton>
            </ButtonRow>
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>경기 전술</SectionTitle>
              <SectionDescription>
                팀의 플레이 방식이나 전략 메모를 자유롭게 작성하세요.
              </SectionDescription>
            </SectionHeader>
            {/* ⭐️ 문제 해결된 TextArea */}
            <StrategyTextarea
              placeholder="경기 전술을 작성해주세요"
              title="경기전술을 작성해주세요"
              value={matchStrategy}
              onChange={(e) => setMatchStrategy(e.target.value)}
            />
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>포메이션</SectionTitle>
              <SectionDescription>
                새로운 포메이션을 만들거나 저장된 포메이션을 불러올 수 있습니다.
              </SectionDescription>
            </SectionHeader>
            <ButtonRow>
              <FormationButton onClick={() => setShowFormationModal(true)}>
                포메이션 새로 만들기
              </FormationButton>
              <FormationButton onClick={() => setShowFormationModal2(true)}>
                기존 포메이션 불러오기
              </FormationButton>
            </ButtonRow>
            
            <FormationNameLabel>{formationName || ""}</FormationNameLabel>
            
            <FormationPreview ref={previewRef}>
              <FormationImage
                src={`${process.env.PUBLIC_URL}/formation.png`}
                alt="Formation Field"
                onLoad={() => {
                   const rect = previewRef.current?.getBoundingClientRect();
                   if (rect) lastPreviewWH.current = { w: rect.width, h: rect.height };
                }}
              />
              {formationCircles.map((circle) => (
                <FixedCircle
                  key={circle.id}
                  style={{
                    left: `${circle.x}px`,
                    top: `${circle.y}px`,
                    backgroundColor: circle.color,
                  }}
                >
                  <div className="label">
                    {circle.detail_position && (
                      <span className="pos">{circle.detail_position}</span>
                    )}
                    {circle.name && <span className="name">{circle.name}</span>}
                  </div>
                </FixedCircle>
              ))}
            </FormationPreview>
          </SectionCard>

          <PrimaryAction>
            <MainButton onClick={handlePostStrategy}>전략 게시하기</MainButton>
          </PrimaryAction>
        </ContentWrapper>
      </PageWrapper>

      {/* --- Modals --- */}
      {showDatePicker && (
        <CalendarModal
          onDateSelect={(date: Date) => {
            setSelectedDate(date);
            setShowDatePicker(false);
            setShowSTimePicker(true);
          }}
          selectedDate={selectedDate ?? undefined}
          onClose={() => setShowDatePicker(false)}
        />
      )}

      {showSTimePicker && (
        <TimePickerModal
          onTimeSelect={(time: string) => {
            setStartTime(time);
            setEndTime(time);
            setShowSTimePicker(false);
          }}
          onTimeEnd={(time: string) => setEndTime(time)}
          onClose={() => {setShowSTimePicker(false); console.log(startTime)}}
        />
      )}

      {showETimePicker && (
        <TimePickerModal
          onTimeSelect={(time: string) => {
            setEndTime(time);
            setShowETimePicker(false);
          }}
          onClose={() => setShowETimePicker(false)}
        />
      )}

      {showMapModal && (
        <KakaoMapModal
          onClose={() => setShowMapModal(false)}
          onAddressSelect={handleAddressSelect}
        />
      )}

      {showFormationModal && (
        <FormationModal
          onClose={() => setShowFormationModal(false)}
          onSave={handleFormationSave}
        />
      )}
      
      {showFormationModal2 && (
        <FormationListModal
          onClose={() => setShowFormationModal2(false)}
          onSave={handleFormationSave2}
        />
      )}
    </>
  );
};

export default GameStrategy;

/* ===================== Styled Components ===================== */

const PageWrapper = styled.div`
  width: 100%;
  /* ⭐️ 중요: 높이를 100vh로 고정하지 말고, 최소 높이만 지정하여 내용만큼 늘어나게 함 */
  min-height: 100vh; 
  /* 모바일 주소창 대응 */
  min-height: 100dvh; 
  
  background: #f5f7fa;
  padding-bottom: 80px; /* 하단 버튼이 가려지지 않게 여백 충분히 */

  /* ⭐️ 모바일 전체 스크롤 허용 */
  overflow-y: auto;
  overflow-x: hidden; /* 가로 스크롤 방지 */
  
  /* iOS 관성 스크롤 활성화 */
  -webkit-overflow-scrolling: touch;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;

  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 480px) {
    padding: 16px;
  }
`;

const SectionCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* 카드 자체가 컨테이너를 넘지 않도록 설정 */
  width: 100%;
  box-sizing: border-box; 
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  margin: 0;
`;

const SectionDescription = styled.p`
  font-size: 13px;
  color: #8b95a1;
  margin: 0;
  line-height: 1.4;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const StrategyButton = styled.button`
  flex: 1;
  min-width: 120px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  color: #374151;
  padding: 14px;
  border-radius: 12px;
  font-size: 14px;
  font-family: "Pretendard-Medium";
  cursor: pointer;
  transition: all 0.2s ease;
  line-height: 1.4;

  &:hover {
    border-color: var(--color-main);
    background: #f0fdf4;
    color: var(--color-main);
  }
`;

const SecondaryButton = styled.button`
  padding: 10px 16px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: white;
  font-size: 13px;
  font-family: "Pretendard-Medium";
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const StyledInput = styled(Input)`
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 12px;
  font-size: 14px;
  background-color: #f9fafb;
  margin-top: 8px;
  box-sizing: border-box; /* 필수 */

  &:focus {
    outline: none;
    border-color: var(--color-main);
    background-color: white;
  }
`;

const StyledInput2 = styled(Input2)`
  width: 100%;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 10px 12px;
  font-size: 14px;
  background-color: #f9fafb;
  margin-top: 8px;
  box-sizing: border-box; /* 필수 */

  &:focus {
    outline: none;
    border-color: var(--color-main);
    background-color: white;
  }
`;

const AddressStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

// ⭐️ [TextArea 문제 해결]
const StrategyTextarea = styled.textarea`
  width: 100%;
  max-width: 100%; /* 부모 영역을 넘어가지 않도록 강제 */
  min-height: 120px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 14px;
  font-size: 14px;
  background-color: #f9fafb;
  margin-top: 8px;
  
  box-sizing: border-box; /* 패딩 포함 크기 계산 */
  resize: none; /* 사용자 임의 조절 방지 (레이아웃 보호) */
  
  line-height: 1.6;
  font-family: "Pretendard-Regular";

  &:focus {
    outline: none;
    border-color: var(--color-main);
    background-color: white;
  }

  &::placeholder {
    color: #b0b0b0;
  }
`;

const FormationButton = styled.button`
  flex: 1;
  background: #fff;
  color: #1f2937;
  border: 1px solid #e5e7eb;
  padding: 14px;
  border-radius: 14px;
  cursor: pointer;
  font-size: 14px;
  font-family: "Pretendard-SemiBold";
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-main);
    color: var(--color-main);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }
`;

const FormationNameLabel = styled.div`
  font-size: 15px;
  font-family: "Pretendard-Bold";
  color: #374151;
  margin-top: 4px;
  padding-left: 4px;
`;

const FormationPreview = styled.div`
  position: relative;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: #e8f5e9;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,0.05);
`;

const FormationImage = styled.img`
  width: 100%;
  display: block;
  object-fit: cover;
`;

const FixedCircle = styled.div`
  position: absolute;
  width: ${CIRCLE_SIZE}px;
  height: ${CIRCLE_SIZE}px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255,255,255,0.3);
  border: 2px solid #fff;
  pointer-events: none; 
  z-index: 10;

  .label {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
    
    .pos {
      font-size: 10px;
      font-weight: 700;
      opacity: 0.95;
      margin-bottom: 1px;
    }
    .name {
      font-size: 9px;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 38px;
    }
  }
`;

const PrimaryAction = styled.div`
  margin-top: 20px;
  padding-bottom: 20px;
`;