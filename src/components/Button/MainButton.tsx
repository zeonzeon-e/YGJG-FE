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
  disabled?: boolean; // disabled 속성 추가
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

  margin: 8px 0px 8px 0px;
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
 * @returns {JSX.Element} button 컴포넌트
 */
const MainButton: React.FC<MainButtonProps> = ({
  bgColor,
  textColor,
  height,
  width,
  fontSize,
  children = "확인",
  disabled = false, // 기본값 설정
  onClick, // 클릭 핸들러 전달받기
}) => {
  const [isClick, setIsClick] = useState(false);

  useEffect(() => {
    if (isClick) {
      const timer = setTimeout(() => {
        setIsClick(false);
      }, 150); // 0.15초 후에 상태를 false로 바꿈
      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머를 정리
    }
  }, [isClick]);

  const handleClick = () => {
    if (!disabled) {
      // disabled가 false인 경우에만 클릭 허용
      setIsClick(true); // 클릭 시 배경색 변경
      if (onClick) {
        onClick(); // 전달된 onClick 핸들러 호출
      }
    }
  };

  return (
    <StyledButton
      bgColor={bgColor}
      textColor={textColor}
      height={height}
      onClick={handleClick}
      isClick={isClick}
      width={width}
      fontSize={fontSize}
      disabled={disabled} // disabled 속성 전달
    >
      {children}
    </StyledButton>
  );
};

export default MainButton;
