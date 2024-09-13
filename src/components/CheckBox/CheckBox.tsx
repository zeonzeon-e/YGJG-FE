import React, { useState } from "react";
import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa6";
import styled from "styled-components";

/* #################### 사용 예시 #######################

/ Step 2: 약관 동의 컴포넌트
const TermsAgreement: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const content: [string, string][] = [
    ["(필수) 서비스 이용자 동의", "내용1"],
    ["(필수) 개인정보 수집/이용 동의", "내용2"],
    ["(필수) 제 3자 제공 동의", "내용3"],
    ["(선택) 메일 수신 동의", "내용4"],
    ["(선택) 마케팅 수신 동의", "내용5"],
    ["(선택) 야간 마케팅 수신 동의", "내용6"],
  ];

  const requiredIndexes = [0, 1, 2]; // 필수 항목 인덱스
  const [checkedState, setCheckedState] = useState<boolean[]>(
    Array(content.length).fill(false)
  );

  // 개별 체크박스 클릭 핸들러
  const handleCheckboxClick = (index: number) => {
    const updatedCheckedState = [...checkedState];
    updatedCheckedState[index] = !updatedCheckedState[index];
    setCheckedState(updatedCheckedState);
  };

  // 전체 체크박스 클릭 핸들러
  const handleAllClick = (checked: boolean) => {
    setCheckedState(Array(content.length).fill(checked));
  };

  // 필수 항목 체크 여부 확인
  const isNextButtonEnabled = requiredIndexes.every(
    (index) => checkedState[index]
  );

  return (
    <Container>
      <Title>약관 동의</Title>
      <SubTitle>
        서비스 이용에 필요한 필수 약관과 선택 약관에 동의해주세요
      </SubTitle>
      <CheckBox
        content={content}
        checkedState={checkedState}
        isToggle={true}
        onCheckboxClick={handleCheckboxClick}
        onAllClick={handleAllClick}
      />
      <ButtonWrapper>
        <MainButton disabled={!isNextButtonEnabled} onClick={onNext}>
          다음
        </MainButton>
      </ButtonWrapper>
    </Container>
  );
};
 */

interface CheckBoxProps {
  content: [string, string][];
  checkedState: boolean[];
  isToggle: boolean;
  onCheckboxClick: (index: number) => void;
  onAllClick: (checked: boolean) => void;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  content,
  checkedState,
  isToggle,
  onCheckboxClick,
  onAllClick,
}) => {
  const [toggles, setToggles] = useState<boolean[]>(() =>
    Array(content.length).fill(false)
  );
  const allChecked = checkedState.every(Boolean);

  // 토글 버튼 클릭 핸들러
  const handleToggleClick = (index: number) => {
    const updatedToggles = [...toggles];
    updatedToggles[index] = !updatedToggles[index];
    setToggles(updatedToggles);
  };

  return (
    <div>
      {/* 전체 선택 체크박스 */}
      <SelectAllWrapper onClick={() => onAllClick(!allChecked)}>
        <IconWrapper className={allChecked ? "icon" : ""}>
          <FaCheck className="CheckBox-icon" />
        </IconWrapper>
        전체 동의
      </SelectAllWrapper>

      {/* 개별 체크박스 목록 */}
      {content.map(([title, detail], index) => (
        <CheckBoxItem key={index}>
          <CheckBoxContent>
            <CheckBoxLabel onClick={() => onCheckboxClick(index)}>
              <IconWrapper className={checkedState[index] ? "icon" : ""}>
                <FaCheck className="CheckBox-icon" />
              </IconWrapper>
              {title}
            </CheckBoxLabel>
            {isToggle && (
              <ToggleButton onClick={() => handleToggleClick(index)}>
                {toggles[index] ? (
                  <FaAngleUp size={20} />
                ) : (
                  <FaAngleDown size={20} />
                )}
              </ToggleButton>
            )}
          </CheckBoxContent>
          {isToggle && toggles[index] && (
            <CheckBoxDetail>{detail}</CheckBoxDetail>
          )}
        </CheckBoxItem>
      ))}
    </div>
  );
};

export default CheckBox;

/* Styled-components */

/* 아이콘 스타일 */
const IconWrapper = styled.div`
  background-color: var(--color-light2);
  color: var(--color-light2);
  margin-right: 5px;
  border-radius: 3px;
  padding: 0.5px;
  border: 1px solid var(--color-dark1);

  &.icon {
    border: 1px solid var(--color-dark1);
    background-color: var(--color-subtle);
    color: var(--color-dark2);
  }
`;

/* 전체 선택 스타일 */
const SelectAllWrapper = styled.div`
  display: flex;
  padding: 5px;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
`;

/* 체크박스 항목 스타일 */
const CheckBoxItem = styled.div`
  width: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
`;

/* 체크박스 콘텐츠 스타일 */
const CheckBoxContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/* 체크박스 라벨 스타일 */
const CheckBoxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

/* 체크박스 세부 내용 스타일 */
const CheckBoxDetail = styled.div`
  background-color: var(--color-light2);
  padding: 10px;
  border-radius: 5px;
  margin-top: 5px;
`;

/* 토글 버튼 스타일 */
const ToggleButton = styled.div`
  cursor: pointer;
`;
