import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

// props 타입 정의
interface MainButtonProps {
  bgColor?: string;
  textColor?: string;
  height?: number;
  width?: number;
  fontSize?: number;
  text?: string;
  isClick?: boolean;
}

// StyledDiv 컴포넌트 정의
const StyledButton = styled.button<MainButtonProps>`
  background-color: ${(props) => props.bgColor || `var(--color-main)`};
  color: ${(props) => props.textColor || `var(--color-light1)`};
  height: ${(props) => (props.height ? `${props.height}px` : "100%")};
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};
  border: 1px solid var(--color-light2);
  box-sizing: border-box;
  padding: 10px;
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : "18px")};
  font-family: Pretendard-Medium;
  letter-spacing: 2px;
  border-radius: ${(props) => (props.height ? `${props.height / 2}px` : "8px")};
  ${({ isClick }) =>
    isClick &&
    css`
      opacity: 0.9;
    `};

  margin: 10px 0px 10px 0px;
`;

/**
 * props가 적용된 button 컴포넌트 생성
 * @param {MainButtonProps} props - 컴포넌트 props
 * @param {string} [props.bgColor] - 배경 색상 (선택적)
 * @param {string} [props.textColor] - 글씨 색상 (선택적)
 * @param {number} [props.height] - 높이 (선택적)
 * * @param {number} [porps.width] - 너비 (선택적)
 * @param {number} [porps.fontSize] - 텍스트 사이즈
 
 * @returns {JSX.Element} button 컴포넌트
 */
const MainButton: React.FC<MainButtonProps> = ({
  bgColor,
  textColor,
  height,
  text = "확인",
}) => {
  const [isClick, setIsClick] = useState(false);
  useEffect(() => {
    if (isClick) {
      const timer = setTimeout(() => {
        setIsClick(false);
      }, 150); // 1초 후에 상태를 false로 바꿈
      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머를 정리
    }
  }, [isClick]);

  const handleClick = () => {
    setIsClick(true); // 클릭 시 배경색 변경
  };
  return (
    <StyledButton
      bgColor={bgColor}
      textColor={textColor}
      height={height}
      onClick={handleClick}
      isClick={isClick}
    >
      {text}
    </StyledButton>
  );
};

export default MainButton;
