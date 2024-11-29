import React, { useState } from "react";
import styled from "styled-components";
import GlobalStyles from "../../../components/Styled/GlobalStyled";
import Header2 from "../../../components/Header/Header2/Header2";
import MainButton from "../../../components/Button/MainButton";
import { format } from "date-fns";
import CalendarModal from "../../../components/Modal/CalendarModal";
import TimePickerModal from "../../../components/Modal/TimePickerModal";
import { ko } from "date-fns/locale";
import Input from "../../../components/Input/Input";
import Input2 from "../../../components/Input/Input2";
import KakaoMapModal from "../../../components/Modal/KakaoAddress";
import FormationModal from "../../../components/Modal/FormationModal";
import FormationListModal from "../../../components/Modal/FormationListModal";

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
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
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

  console.log(selectedDate)
  console.log(selectedTime)

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
            <StrategyButton
              className="shadow-df"
              onClick={() => setShowTimePicker(true)}
            >
              {selectedTime || "시간을 선택하세요"}
            </StrategyButton>
            
          </PickerButton>
          {showDatePicker && (
            <CalendarModal
              onDateSelect={(date: Date) => {
                setSelectedDate(date);
                setShowDatePicker(false);
              }}
              onClose={() => setShowDatePicker(false)}
            />
          )}
        </ItemDiv>
        {showTimePicker && (
          <TimePickerModal
            onTimeSelect={(time: string) => {
              setSelectedTime(time);
              setShowTimePicker(false);
            }}
            onClose={() => setShowTimePicker(false)}
          />
        )}
        <Input
          type="text"
          placeholder="상대팀명을 입력해주세요"
          title="상대팀명을 입력해주세요"
        />
        <ItemDiv>
          <h4>경기장을 선택해주세요</h4>
          <AddressDiv value={selectedAddress}>
            <Input2 type="string" height={35} value={selectedAddress}></Input2>
            {selectedAddress && (
              <Input
                type="string"
                placeholder="상세주소를 입력해주세요(선택)"
              ></Input>
            )}

            <MainButton
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
        <Input
          type="text"
          placeholder="경기전술을 작성해주세요"
          title="경기전술을 작성해주세요"
          height={100}
        />
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
            <FormationImage src="/formation.png" alt="Formation Field" />
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
`;

const Formation = styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
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
`;
