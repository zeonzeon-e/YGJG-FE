import React, { useState } from "react";
import styled from "styled-components";

// RadioButton props 타입 정의
/**
 * RadioButtonProps - RadioButton 컴포넌트에 전달되는 props 타입 정의
 * @interface RadioButtonProps
 * @property {string[]} items - 라디오 버튼으로 묶일 요소들
 * @property {string} [textColor] - 글씨 색상 (선택적)
 * @property {number} [fontSize] - 텍스트 사이즈 (선택적)
 */
interface RadioButtonProps {
  items: string[];
  textColor?: string;
  fontSize?: number;
}

/**
 * RadioButton 컴포넌트 - 단일 선택이 가능한 라디오 버튼을 렌더링합니다.
 * @param {RadioButtonProps} props - 컴포넌트에 전달되는 props
 * @param {string[]} props.items - 라디오 버튼으로 묶일 요소들
 * @param {string} [props.textColor] - 글씨 색상 (선택적)
 * @param {number} [props.fontSize] - 텍스트 사이즈 (선택적)
 * @returns {JSX.Element} RadioButton 컴포넌트
 */
const RadioButton: React.FC<RadioButtonProps> = ({
  items,
  textColor,
  fontSize,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // 단일 선택 핸들러
  const handleClick = (idx: number) => {
    setSelectedIndex(idx);
  };

  return (
    <ButtonContainer>
      {items.map((item, index) => (
        <StyledButton
          key={index}
          onClick={() => handleClick(index)}
          isSelected={selectedIndex === index}
          textColor={textColor}
          fontSize={fontSize}
        >
          {item}
        </StyledButton>
      ))}
    </ButtonContainer>
  );
};

export default RadioButton;

/* Styled-components */

/* 버튼 컨테이너 스타일 */
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

/* 스타일이 적용된 버튼 컴포넌트 */
interface StyledButtonProps {
  isSelected: boolean;
  textColor?: string;
  fontSize?: number;
}

const StyledButton = styled.button<StyledButtonProps>`
  border: 1px solid var(--color-dark1);
  box-sizing: border-box;
  padding: 10px;
  width: 90%;
  margin: 2px;
  border-radius: 8px;
  color: ${({ isSelected, textColor }) =>
    isSelected ? "var(--color-light1)" : textColor || "var(--color-dark1)"};
  background-color: ${({ isSelected }) =>
    isSelected ? "var(--color-main)" : "transparent"};
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}px` : "inherit")};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
