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
import formationUrl from "@/assets/formation.png";

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
  const [showFormationModal2, setShowFormationModal2] = useState(false);

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
  };

  const handleFormationSave2 = (circles: CirclePosition[]) => {
    setFormationCircles(circles); // Save formation circles
  };

  const handleFormationSave = (circles: CirclePosition[]) => {
    setFormationCircles(circles); // Save formation circles
  };

  return (
    <>
      <GlobalStyles />
      <Header2 text="경기 전략" />
      <Container>
        <ItemDiv>
          <h4>경기 날짜와 시간을 선택해주세요</h4>
          <PickerButton>
            <StrategyButton
              className="shadow-df"
              onClick={() => setShowDatePicker(true)}
            >
              {selectedDate
                ? format(selectedDate, "MM월 dd일 EEEE", { locale: ko })
                : "날짜를 선택하세요"}
            </StrategyButton>
          </PickerButton>
          <PickerButton>
            <StrategyButton
              className="shadow-df"
              onClick={() => setShowSTimePicker(true)}
            >
              {startTime ? "시작 시간 : "+ startTime : "시간을 선택하세요"}
            </StrategyButton>
            <StrategyButton
              className="shadow-df"
              onClick={() => setShowETimePicker(true)}
            >
              {endTime ? "종료 시간 : "+ endTime : "시간을 선택하세요"}
            </StrategyButton>
          </PickerButton>

          {showDatePicker && (
            <CalendarModal
              onDateSelect={(date: Date) => {
                setSelectedDate(date);
                setShowDatePicker(false);
                // ✅ 날짜 선택 직후 시작 시간 선택 모달 자동 오픈
                setShowSTimePicker(true);
              }}
              selectedDate={selectedDate ?? undefined}
              onClose={() => setShowDatePicker(false)}
            />
          )}
        </ItemDiv>

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

        {/* 상대팀명 */}
        <StyledInput
          type="text"
          placeholder="상대팀명을 입력해주세요"
          title="상대팀명을 입력해주세요"
        />

        <ItemDiv>
          <h4>경기장을 선택해주세요</h4>
          <AddressDiv value={selectedAddress}>
            <StyledInput2
              type="string"
              height={35}
              value={selectedAddress}
            />
            {selectedAddress && (
              <StyledInput
                type="string"
                placeholder="상세주소를 입력해주세요(선택)"
              />
            )}

            <MainButton
              fontSize={12}
              width={100}
              height={35}
              onClick={() => setShowMapModal(true)}
            >
              주소 찾기
            </MainButton>
            {showMapModal && (
              <KakaoMapModal
                onClose={() => setShowMapModal(false)}
                onAddressSelect={handleAddressSelect}
              />
            )}
          </AddressDiv>
        </ItemDiv>

        {/* 경기 전술: textarea */}
        <ItemDiv>
          <h4>경기 전술을 작성해주세요</h4>
          <StrategyTextarea
            placeholder="경기전술을 작성해주세요"
            title="경기전술을 작성해주세요"
          />
        </ItemDiv>

        <ItemDiv>
          <h4>포메이션을 알려주세요</h4>
          <Formation>
            <FormationButton
              className="shadow-df"
              onClick={() => setShowFormationModal(true)}
            >
              포메이션
              <br />
              새로 만들기
            </FormationButton>
            <FormationButton
              className="shadow-df"
              onClick={() => setShowFormationModal2(true)}
            >
              기존 포메이션
              <br />
              불러오기
            </FormationButton>
          </Formation>
          <FormationImageContainer>
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
          </FormationImageContainer>

          {/* 포메이션 생성하는 모달 */}
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
        </ItemDiv>

        <MainButton>전략 게시하기</MainButton>
      </Container>
    </>
  );
};

export default GameStrategy;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  overflow-y: auto; /* 스크롤 가능하도록 설정 */
  -webkit-overflow-scrolling: touch; /* 모바일에서 터치 스크롤 부드럽게 */
`;

const StrategyButton = styled.button`
  background-color: var(--color-main);
  color: var(--color-light1);
  border: 1px solid var(--color-border);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  width: 90%;
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
  margin-right: 8px;

  &:focus {
    outline: none;
    border-color: var(--color-main);
    box-shadow: 0 0 0 2px rgba(0, 132, 255, 0.15);
  }

  &::placeholder {
    color: #b0b0b0;
  }
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
  background-color: white;
  color: var(--color-dark2);
  border: 1px solid var(--color-sub);
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 20px;
  cursor: pointer;
  width: 90%;
`;

const ItemDiv = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const PickerButton = styled.div`
  display: flex;
  width: 100%;
  margin-top: 5px;
  gap: 10px;
`;

const Formation = styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
  gap: 10px;
`;

const FormationImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  display: inline-block;
  border: 1px solid #ddd;
  margin-bottom: 20px;
`;

const FormationImage = styled.img`
  width: 100%;
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
`;

const AddressDiv = styled.div<{ value?: string }>`
  width: 100%;
  ${(props) => (props.value ? "" : "display: flex;")}
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;
