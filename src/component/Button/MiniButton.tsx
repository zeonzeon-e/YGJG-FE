import React from "react";
import styled from "styled-components";

// props 타입 정의
interface MainButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

// StyledDiv 컴포넌트 정의
const StyledButton = styled.button<MainButtonProps>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(calc(100% + 10px), -50%);
  border: 1.5px solid #1ceda4;
  border-radius: 5px;
  padding: 3px 6px;
  font-size: 14px;
  background-color: #fff;
`;

/**
 * props가 적용된 button 컴포넌트 생성
 * @param {MainButtonProps} props - 컴포넌트 props
 * @param {React.ReactNode} [props.children] - 버튼 문구 (선택적, 기본값="확인")
 * @param {() => void} [props.onClick] - 버튼 클릭 시 호출되는 함수 (선택적)
 * @returns {JSX.Element} button 컴포넌트
 */
const MiniButton: React.FC<MainButtonProps> = ({
  children = "확인",
  onClick,
}) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>;
};

export default MiniButton;
