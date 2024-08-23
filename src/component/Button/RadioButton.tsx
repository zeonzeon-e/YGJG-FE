import React, { useState } from "react";
import styled from "styled-components";

/**
 * RadioButton 컴포넌트 - 단일 선택이 가능한 라디오 버튼을 렌더링합니다.
 * @param {RadioButtonProps} props - 컴포넌트에 전달되는 props
 * @property {string} title - 컴포넌트의 제목 (선택적)
 * @property {string[]} items - 라디오 버튼으로 묶일 요소들(예:{["1","2","3"]})
 * @property {string} [textColor] - 글씨 색상 (선택적)
 * @property {number} [fontSize] - 텍스트 사이즈 (선택적)
 * @property {string} [bgColor] - 선택되지 않은 버튼의 배경색 (선택적)
 * @property {string} [selectedBgColor] - 선택된 버튼의 배경색 (선택적)
 * @returns {JSX.Element} RadioButton 컴포넌트
 */
const RadioButton: React.FC<RadioButtonProps> = ({
  title,
  items,
  textColor,
  fontSize,
  bgColor,
  selectedBgColor,
}) => {
  // 선택된 버튼의 인덱스를 관리하는 내부 state
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  /**
   * handleButtonClick - 라디오 버튼 클릭 시 선택 상태를 업데이트하는 함수
   * @param {number} index - 클릭된 버튼의 인덱스
   */
  const handleButtonClick = (index: number) => {
    setSelectedIndex(index);
  };

  return (
    <Container>
      {title && <Title>{title}</Title>}
      <ButtonContainer>
        {items.map((item, index) => (
          <RadioItemButton
            key={index}
            onClick={() => handleButtonClick(index)}
            isSelected={selectedIndex === index}
            textColor={textColor}
            fontSize={fontSize}
            bgColor={bgColor}
            selectedBgColor={selectedBgColor}
          >
            {item}
          </RadioItemButton>
        ))}
      </ButtonContainer>
    </Container>
  );
};

export default RadioButton;

// 인터페이스 정의
interface RadioButtonProps {
  title?: string; // 컴포넌트의 제목 (선택적)
  items: string[];
  textColor?: string;
  fontSize?: number;
  bgColor?: string; // 선택되지 않은 버튼의 배경색 (선택적)
  selectedBgColor?: string; // 선택된 버튼의 배경색 (선택적)
}

// 스타일 컴포넌트 정의

const Container = styled.div`
  width: 100%;
`;

const Title = styled.h3`
  margin-bottom: 5px;
  font-size: 18px;
  font-family: "Pretendard-Medium";
  color: var(--color-dark2);
`;

// 버튼들을 담는 컨테이너 (Flexbox 레이아웃)
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

interface RadioItemButtonProps {
  isSelected: boolean;
  textColor?: string;
  fontSize?: number;
  bgColor?: string;
  selectedBgColor?: string;
}

// 개별 라디오 버튼의 스타일
const RadioItemButton = styled.button<RadioItemButtonProps>`
  border: 1px solid var(--color-dark1);
  padding: 10px;
  margin: 4px;
  border-radius: 8px; /* 기본적으로 8px의 border-radius */
  color: ${({ isSelected, textColor }) =>
    isSelected ? "var(--color-light1)" : textColor || "var(--color-main)"};
  background-color: ${({ isSelected, bgColor, selectedBgColor }) =>
    isSelected
      ? selectedBgColor || "var(--color-main)"
      : bgColor || "transparent"};
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}px` : "inherit")};
  cursor: pointer;
  width: 100%;
  text-align: center;

  &:hover {
    opacity: 0.9;
  }
  transition: all 0.3s ease;
`;
