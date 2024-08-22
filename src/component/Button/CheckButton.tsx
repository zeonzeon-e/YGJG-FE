import React, { useState } from "react";
import styled from "styled-components";

// CheckButton props 타입 정의
/**
 * CheckButtonProps - CheckButton 컴포넌트에 전달되는 props 타입 정의
 * @interface CheckButtonProps
 * @property {string[]} items - 체크 버튼으로 묶일 요소들
 * @property {string} [textColor] - 글씨 색상 (선택적)
 * @property {number} [fontSize] - 텍스트 사이즈 (선택적)
 */
interface CheckButtonProps {
  items: string[];
  textColor?: string;
  fontSize?: number;
}

/**
 * CheckButton 컴포넌트 - 다중 선택이 가능한 체크 버튼을 렌더링합니다.
 * @param {CheckButtonProps} props - 컴포넌트에 전달되는 props
 * @param {string[]} props.items - 체크 버튼으로 묶일 요소들
 * @param {string} [props.textColor] - 글씨 색상 (선택적)
 * @param {number} [props.fontSize] - 텍스트 사이즈 (선택적)
 * @returns {JSX.Element} CheckButton 컴포넌트
 */
const CheckButton: React.FC<CheckButtonProps> = ({
  items,
  textColor,
  fontSize,
}) => {
  const [selectedIndexes, setSelectedIndexes] = useState<boolean[]>(
    Array(items.length).fill(false)
  );

  // 다중 선택 핸들러
  const handleClick = (idx: number) => {
    const newSelectedIndexes = [...selectedIndexes];
    newSelectedIndexes[idx] = !newSelectedIndexes[idx];
    setSelectedIndexes(newSelectedIndexes);
  };

  return (
    <ButtonContainer>
      {items.map((item, index) => (
        <StyledButton
          key={index}
          onClick={() => handleClick(index)}
          isSelected={selectedIndexes[index]}
          textColor={textColor}
          fontSize={fontSize}
        >
          {item}
        </StyledButton>
      ))}
    </ButtonContainer>
  );
};

export default CheckButton;

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
