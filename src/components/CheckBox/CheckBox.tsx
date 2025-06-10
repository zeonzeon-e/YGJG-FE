// src/components/CheckBox/CheckBox.tsx
import React, { useState } from "react";
import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa6";
import styled from "styled-components";

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
  const allChecked = checkedState.length > 0 && checkedState.every(Boolean);

  const handleToggleClick = (index: number) => {
    const updatedToggles = [...toggles];
    updatedToggles[index] = !updatedToggles[index];
    setToggles(updatedToggles);
  };

  return (
    <CheckBoxContainer>
      {/* 전체 동의 */}
      <CheckBoxItem>
        <CheckBoxContent>
          <StyledLabel htmlFor="all-agree">
            <HiddenCheckbox
              id="all-agree"
              checked={allChecked}
              onChange={(e) => onAllClick(e.target.checked)}
            />
            <StyledCheckBox>
              <FaCheck />
            </StyledCheckBox>
            전체 동의
          </StyledLabel>
        </CheckBoxContent>
      </CheckBoxItem>

      <Divider />

      {/* 개별 약관 동의 */}
      {content.map(([title, detail], index) => (
        <CheckBoxItem key={index}>
          <CheckBoxContent>
            <StyledLabel htmlFor={`agree-${index}`}>
              <HiddenCheckbox
                id={`agree-${index}`}
                checked={checkedState[index]}
                onChange={() => onCheckboxClick(index)}
              />
              <StyledCheckBox>
                <FaCheck />
              </StyledCheckBox>
              {title}
            </StyledLabel>
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
    </CheckBoxContainer>
  );
};

export default CheckBox;

/* ================================================== */
/* Styled-components                                */
/* ================================================== */

const CheckBoxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const CheckBoxItem = styled.div`
  width: 100%;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
`;

const CheckBoxContent = styled.div`
  display: flex;
  align-items: center;
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-grow: 1;
  font-size: 16px;
`;

// 실제 input은 숨김 처리
const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

// 커스텀 디자인을 적용할 체크박스 모양
const StyledCheckBox = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: #fff;
  border: 1px solid var(--color-dark1);
  border-radius: 3px;
  margin-right: 8px;
  transition: background-color 0.2s, border-color 0.2s;

  svg {
    visibility: hidden; // 평소에는 체크 아이콘 숨김
    color: white;
    width: 14px;
    height: 14px;
  }

  // 숨겨진 실제 체크박스가 :checked 상태일 때, 이 컴포넌트의 스타일 변경
  ${HiddenCheckbox}:checked + & {
    background-color: var(--color-main);
    border-color: var(--color-main);

    svg {
      visibility: visible; // 보이기
    }
  }
`;

const ToggleButton = styled.div`
  cursor: pointer;
  margin-left: auto;
  padding-left: 10px;
  display: flex;
  align-items: center;
`;

const CheckBoxDetail = styled.div`
  background-color: var(--color-light2);
  padding: 10px;
  border-radius: 5px;
  margin-top: 8px;
  color: var(--color-dark2);
  font-size: 14px;
  line-height: 1.5;
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 8px 0;
`;
