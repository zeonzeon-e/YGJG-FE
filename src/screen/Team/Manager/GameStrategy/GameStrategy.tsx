import React, { useState } from "react";
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

interface CirclePosition {
  id: number;
  x: number;
  y: number;
  color: string;
  detail_position: string;
  name: string;
}

const GameStrategy: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSTimePicker, setShowSTimePicker] = useState(false);
  const [showETimePicker, setShowETimePicker] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showFormationModal, setShowFormationModal] = useState(false);
  const [formationCircles, setFormationCircles] = useState<CirclePosition[]>(
    []
  );
  const [formationName, setFormationName] = useState<string>("");
  const [showFormationModal2, setShowFormationModal2] = useState(false);

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
  };

  const handleFormationSave2 = (circles: CirclePosition[], name?: string) => {
    setFormationCircles(circles);
    if (name) {
      setFormationName(name);
    }
  };

  const handleFormationSave = (circles: CirclePosition[], name?: string) => {
    setFormationCircles(circles);
    if (name) {
      setFormationName(name);
    }
  };

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
                {startTime ? (
                  `시작 시간 · ${startTime}`
                ) : (
                  <>
                    시작 시간을
                    <br />
                    선택하세요
                  </>
                )}
              </StrategyButton>
              <StrategyButton onClick={() => setShowETimePicker(true)}>
                {endTime ? (
                  `종료 시간 · ${endTime}`
                ) : (
                  <>
                    종료 시간을
                    <br />
                    선택하세요
                  </>
                )}
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
            <StrategyTextarea
              placeholder="경기 전술을 작성해주세요"
              title="경기전술을 작성해주세요"
            />
          </SectionCard>

          <SectionCard>
            <SectionHeader>
              <SectionTitle>포메이션</SectionTitle>
              <SectionDescription>
                새로운 포메이션을 만들거나 저장된 포메이션을 불러올 수
                있습니다.
              </SectionDescription>
            </SectionHeader>
            <ButtonRow>
              <FormationButton onClick={() => setShowFormationModal(true)}>
                포메이션
                <br />
                새로 만들기
              </FormationButton>
              <FormationButton onClick={() => setShowFormationModal2(true)}>
                기존 포메이션
                <br />
                불러오기
              </FormationButton>
            </ButtonRow>
            <FormationNameLabel>
              {formationName || ""}
            </FormationNameLabel>
            <FormationPreview>
              <FormationImage
                src={`${process.env.PUBLIC_URL}/formation.png`}
                alt="Formation Field"
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
                  {circle.detail_position}
                  <br />
                  {circle.name}
                </FixedCircle>
              ))}
            </FormationPreview>
          </SectionCard>

          <PrimaryAction>
            <MainButton>전략 게시하기</MainButton>
          </PrimaryAction>
        </ContentWrapper>
      </PageWrapper>

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
            setEndTime(time + 3);
            setShowSTimePicker(false);
          }}
          onTimeEnd={(time: string) => {
            setEndTime(time);
          }}
          onClose={() => setShowSTimePicker(false)}
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

// Styled Components
const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 40px;
`;

const ContentWrapper = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SectionCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 12px 30px rgba(28, 43, 70, 0.08);
  display: flex;
  flex-direction: column;
  gap: 16px;
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
  color: var(--color-dark1);
  margin: 0;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const StrategyButton = styled.button`
  flex: 1;
  min-width: 140px;
  background: var(--color-light1);
  border: 1px solid #e3e7ed;
  color: var(--color-dark2);
  padding: 14px;
  border-radius: 14px;
  font-size: 14px;
  font-family: "Pretendard-SemiBold";
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-main);
    box-shadow: 0 6px 16px rgba(14, 98, 68, 0.12);
  }
`;

const SecondaryButton = styled.button`
  padding: 12px 18px;
  border-radius: 12px;
  border: 1px solid #dadfe7;
  background: #f7f9fb;
  font-size: 14px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: white;
    border-color: var(--color-main);
    color: var(--color-main);
  }
`;

/** 공통 Input 스타일 */
const StyledInput = styled(Input)`
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  padding: 10px 12px;
  font-size: 14px;
  box-sizing: border-box;
  background-color: #ffffff;
  margin-top: 8px;
  min-height: 30px;

  &:focus {
    outline: none;
    border-color: var(--color-main);
    box-shadow: 0 0 0 2px rgba(0, 132, 255, 0.15);
  }

  &::placeholder {
    color: #b0b0b0;
  }
`;

const StyledInput2 = styled(Input2)`
  width: 100%;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  padding: 8px 12px;
  font-size: 14px;
  box-sizing: border-box;
  background-color: #ffffff;
  margin-top: 8px;

  &:focus {
    outline: none;
    border-color: var(--color-main);
    box-shadow: 0 0 0 2px rgba(0, 132, 255, 0.15);
  }

  &::placeholder {
    color: #b0b0b0;
  }
`;

const AddressStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

/** 경기 전술용 textarea 스타일 */
const StrategyTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  padding: 10px 12px;
  font-size: 14px;
  box-sizing: border-box;
  background-color: #ffffff;
  margin-top: 8px;
  resize: vertical;
  line-height: 1.5;

  &:focus {
    outline: none;
    border-color: var(--color-main);
    box-shadow: 0 0 0 2px rgba(0, 132, 255, 0.15);
  }

  &::placeholder {
    color: #b0b0b0;
  }
`;

const FormationButton = styled.button`
  flex: 1;
  min-width: 140px;
  background: #f5f7fa;
  color: var(--color-dark2);
  border: 1px solid #e1e6ef;
  padding: 16px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 14px;
  font-family: "Pretendard-SemiBold";
  transition: all 0.2s ease;

  &:hover {
    background: white;
    border-color: var(--color-main);
    box-shadow: 0 8px 18px rgba(14, 98, 68, 0.12);
  }
`;

const FormationNameLabel = styled.div`
  font-size: 14px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark1);
  margin-top: 8px;
`;

const FormationPreview = styled.div`
  position: relative;
  width: 100%;
  border: 1px solid #e1e6ef;
  border-radius: 20px;
  overflow: hidden;
  background: #fefefe;
`;

const FormationImage = styled.img`
  width: 100%;
  display: block;
`;

const FixedCircle = styled.div`
  position: absolute;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 12px;
  text-align: center;
  cursor: default; /* No drag */
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.2);
`;

const PrimaryAction = styled.div`
  margin-top: 50px;
  padding: 4px 0 24px;
`;
