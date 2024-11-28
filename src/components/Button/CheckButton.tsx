import React from "react";
import styled from "styled-components";

interface CheckButtonProps {
  title?: string;
  items: string[];
  textColor?: string;
  fontSize?: number;
  bgColor?: string;
  selectedBgColor?: string;
  selectedStates: boolean[];
  onItemClick: (index: number) => void;
}

const CheckButton: React.FC<CheckButtonProps> = ({
  title,
  items,
  textColor,
  fontSize,
  bgColor,
  selectedBgColor,
  selectedStates,
  onItemClick,
}) => {
  return (
    <Container>
      {title && <Title>{title}</Title>}
      <ButtonContainer>
        {items.map((item, index) => (
          <CheckItemButton
            key={index}
            onClick={() => onItemClick(index)}
            isSelected={selectedStates[index]}
            textColor={textColor}
            fontSize={fontSize}
            bgColor={bgColor}
            selectedBgColor={selectedBgColor}
            dangerouslySetInnerHTML={{ __html: item }} // HTML 태그 렌더링
          >
            {/* {item} */}
          </CheckItemButton>
        ))}
      </ButtonContainer>
    </Container>
  );
};

export default CheckButton;

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

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

interface CheckItemButtonProps {
  isSelected: boolean;
  textColor?: string;
  fontSize?: number;
  bgColor?: string;
  selectedBgColor?: string;
}

const CheckItemButton = styled.button<CheckItemButtonProps>`
  border: 1px solid var(--color-dark1);
  padding: 10px;
  margin: 3px;
  border-radius: 8px;
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
  white-space: pre-wrap; /* 줄넘김 허용 */
  transition: all 0.3s ease;
`;
