import React, { useState } from "react";
import styled from "styled-components";

// props 타입 정의
interface GroupButtonProps {
  items: string[];
  textColor?: string;
  fontSize?: number;
  type: "multi" | "single";
}

/**
 * props가 적용된 button 컴포넌트 생성
 * @param {GroupButtonProps} props - 컴포넌트 props
 * @param {string} [props.items] - 그룹 버튼으로 묶일 요소들
 * @param {string} [props.textColor] - 글씨 색상 (선택적)
 * @param {number} [props.fontSize] - 텍스트 사이즈
 * @param {string} [props.type] - multi:다중선택, single:단일선택\
 * @returns {JSX.Element} button 컴포넌트
 */
const GroupButton: React.FC<GroupButtonProps> = ({
  textColor = "#333",
  items,
  fontSize = 16,
  type,
}) => {
  const [isIndexSelect, setIsIndexSelect] = useState(
    Array(items.length).fill(false)
  );

  const handleMultiClick = (idx: number) => {
    const newArr = [...isIndexSelect];
    newArr[idx] = !isIndexSelect[idx];
    setIsIndexSelect(newArr);
  };

  const handleSingleClick = (idx: number) => {
    const newArr = Array(items.length).fill(false);
    newArr[idx] = true;
    setIsIndexSelect(newArr);
  };

  const handleClick = (index: number) => {
    if (type === "multi") handleMultiClick(index);
    if (type === "single") handleSingleClick(index);
  };

  return (
    <ButtonGroup>
      {items.map((item, index) => (
        <StyledButton
          key={index}
          onClick={() => handleClick(index)}
          selected={isIndexSelect[index]}
          textColor={textColor}
          fontSize={fontSize}
        >
          {item}
        </StyledButton>
      ))}
    </ButtonGroup>
  );
};

export default GroupButton;

// 스타일 컴포넌트 정의
const ButtonGroup = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledButton = styled.button<{
  selected: boolean;
  textColor: string;
  fontSize: number;
}>`
  border: 1px solid var(--color-dark1);
  box-sizing: border-box;
  padding: 10px;
  width: 90%;
  margin: 2px;
  border-radius: 8px;
  color: ${({ selected, textColor }) =>
    selected ? "var(--color-light1)" : textColor};
  background-color: ${({ selected }) =>
    selected ? "var(--color-main)" : "transparent"};
  font-size: ${({ fontSize }) => fontSize}px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
`;
