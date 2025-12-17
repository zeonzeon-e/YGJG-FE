import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

// props 타입 정의
interface MainButtonProps {
  bgColor?: string;
  textColor?: string;
  height?: number;
  width?: number;
  fontSize?: number;
  children?: React.ReactNode;
  isClick?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties; // Add style prop
}

// StyledButton 컴포넌트 정의
const StyledButton = styled.button<MainButtonProps>`
  background-color: ${(props) => props.bgColor || `var(--color-main)`};
  color: ${(props) => props.textColor || `var(--color-light1)`};
  height: ${(props) => (props.height ? `${props.height}px` : "100%")};
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};
  border: 1px solid var(--color-light2);
  box-sizing: border-box;
  padding: ${(props) => (props.height ? `${props.height / 10}px 0` : "16px 0")};
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : "18px")};
  font-family: Pretendard-Medium;
  letter-spacing: 2px;
  border-radius: 8px;
  box-shabow: 0 1.5px 1.5px 0 var(--color-shabow);
  letter-spacing: 0px;
  transition: 0.2s;
  ${({ isClick }) =>
    isClick &&
    css`
      opacity: 0.9;
    `};

  ${({ disabled }) =>
    disabled &&
    css`
      background-color: var(--color-light2); // 비활성화된 상태의 배경색
      color: var(--color-dark2); // 비활성화된 상태의 텍스트 색상
      cursor: not-allowed; // 비활성화된 상태의 커서
      opacity: 0.6; // 비활성화된 상태의 불투명도
    `};

  margin: 5px 0px 5px 0px;

  @media (max-width: 768px) {
    padding: ${(props) =>
      props.height ? `${props.height / 12}px 0` : "12px 0"};
    font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : "16px")};
  }
`;

/**
 * props가 적용된 button 컴포넌트 생성
 * @param {MainButtonProps} props - 컴포넌트 props
 * @param {React.ReactNode} [props.children] - 버튼 문구 (선택적, 기본값="확인")
 * @param {string} [props.bgColor] - 배경 색상 (선택적)
 * @param {string} [props.textColor] - 글씨 색상 (선택적)
 * @param {number} [props.height] - 높이 (선택적)
 * @param {number} [props.width] - 너비 (선택적)
 * @param {number} [props.fontSize] - 텍스트 사이즈 (선택적)
 * @param {boolean} [props.disabled] - 버튼 비활성화 여부 (선택적, 기본값=false)
 * @param {React.CSSProperties} [props.style] - 인라인 스타일 (선택적)
 * @returns {JSX.Element} button 컴포넌트
 */
const MainButton: React.FC<MainButtonProps> = ({
  bgColor,
  textColor,
  height,
  width,
  fontSize,
  children = "확인",
  disabled = false,
  onClick,
  style,
}) => {
  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    if (isClick) {
      const timer = setTimeout(() => {
        setIsClick(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isClick]);

  const handleClick = () => {
    if (!disabled) {
      setIsClick(true);
      if (onClick) {
        onClick();
      }
    }
  };

  return (
    <StyledButton
      className="shadow-df"
      bgColor={bgColor}
      textColor={textColor}
      height={height}
      onClick={handleClick}
      isClick={isClick}
      width={width}
      fontSize={fontSize}
      disabled={disabled}
      style={style}
    >
      {children}
    </StyledButton>
  );
};

export default MainButton;
