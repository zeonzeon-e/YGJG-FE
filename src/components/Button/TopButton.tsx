import React, { useEffect, useState } from "react";
import { FaAngleUp } from "react-icons/fa";
import styled, { css } from "styled-components";

// props 타입 정의
interface TopButtonProps {
  bgColor?: string;
  textColor?: string;
  height?: number;
  width?: number;
  isClick?: boolean;
  onClick?: () => void;
  disabled?: boolean; // disabled 속성 추가
}

// StyledButton 컴포넌트 정의
const StyledButton = styled.button<TopButtonProps>`
  position: fixed; /* 항상 고정 */
  bottom: 50px;    /* 하단 여백 */
  right: 30px;     /* 오른쪽 여백 */
  z-index: 1000;   /* 다른 요소 위에 표시되도록 */
align-items: center;
  display: flex;
  flex-direction: column;
  background-color: ${(props) => props.bgColor || `var(--color-dark1)`};
  color: ${(props) => props.textColor || `var(--color-light1)`};
  height: ${(props) => (props.height ? `${props.height}px` :"50px")};
  width: ${(props) => (props.width ? `${props.width}px` : "50px")};
  border: 1px solid var(--color-light2);
  box-sizing: border-box;
  font-size: 14px;
  font-family: Pretendard-Medium;
  letter-spacing: 2px;
  border-radius: 50px;
  padding: 8px 0px;
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
`;

/**
 * props가 적용된 button 컴포넌트 생성
 * @param {TopButtonProps} props - 컴포넌트 props
 * @param {React.ReactNode} [props.children] - 버튼 문구 (선택적, 기본값="확인")
 * @param {string} [props.bgColor] - 배경 색상 (선택적)
 * @param {string} [props.textColor] - 글씨 색상 (선택적)
 * @param {number} [props.height] - 높이 (선택적)
 * @param {number} [props.width] - 너비 (선택적)
 * @param {boolean} [props.disabled] - 버튼 비활성화 여부 (선택적, 기본값=false)
 * @returns {JSX.Element} button 컴포넌트
 */
const TopButton: React.FC<TopButtonProps> = ({
  bgColor,
  textColor,
  height,
  width,
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
      window.scrollTo({ top: 0, behavior: "smooth" });
      setIsClick(true); // 이 부분도 if 블록 안에 있어야 의도대로 동작
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
      disabled={disabled} // disabled 속성 전달
    >
    <FaAngleUp size={12}/>
    <div>TOP</div>
    </StyledButton>
  );
};

export default TopButton;
