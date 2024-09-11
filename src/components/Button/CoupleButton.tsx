import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";

// props 타입 정의
interface CoupleButtonProps {
  bgColor?: string;
  textColor?: string;
  height?: number;
  width?: number;
  fontSize?: number;
  textN?: string;
  textP?: string;
  isClick?: boolean;
}

// StyledButtonNegative 컴포넌트 정의
const StyledButtonNegative = styled.button<CoupleButtonProps>`
  background-color: ${(props) => props.bgColor || `var(--color-light2)`};
  color: ${(props) => props.textColor || `var(--color-dark1)`};
  height: ${(props) => (props.height ? `${props.height}px` : "100%")};
  width: ${(props) => (props.width ? `${props.width}px` : "49%")};
  border: 1px solid var(--color-dark1);
  box-sizing: border-box;
  padding: 10px;
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : "18px")};
  font-family: Pretendard-Medium;
  letter-spacing: 2px;
  border-radius: 8px;
  ${({ isClick }) =>
    isClick &&
    css`
      opacity: 0.9;
    `};

  margin: 10px 0px 10px 0px;
`;

// StyledButtonPositive 컴포넌트 정의
const StyledButtonPositive = styled.button<CoupleButtonProps>`
  background-color: ${(props) => props.bgColor || `var(--color-main)`};
  color: ${(props) => props.textColor || `var(--color-light1)`};
  height: ${(props) => (props.height ? `${props.height}px` : "100%")};
  width: ${(props) => (props.width ? `${props.width}px` : "49%")};
  border: 1px solid var(--color-light2);
  box-sizing: border-box;
  padding: 10px;
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : "18px")};
  font-family: Pretendard-Medium;
  letter-spacing: 2px;
  border-radius: 8px;
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
 * @param {number} [porps.width] - 너비 (선택적)
 * @param {number} [porps.fontSize] - 텍스트 사이즈
 * @param {number} [porps.textN] -  부정적 텍스트(이전, 거절)
 * @param {number} [porps.textP] - 긍정적 텍스트 (다음, 승인)
 *
 * @returns {JSX.Element} button 컴포넌트
 */
const CoupleButton: React.FC<CoupleButtonProps> = ({
  bgColor,
  textColor,
  height,
  textN = "이전",
  textP = "다음",
}) => {
  const [isClickN, setIsClickN] = useState(false);

  const [isClickP, setIsClickP] = useState(false);
  useEffect(() => {
    if (isClickN) {
      const timer = setTimeout(() => {
        setIsClickN(false);
      }, 150); // 1초 후에 상태를 false로 바꿈
      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머를 정리
    }
    if (isClickP) {
      const timer = setTimeout(() => {
        setIsClickP(false);
      }, 150); // 1초 후에 상태를 false로 바꿈
      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머를 정리
    }
  }, [isClickN, isClickP]);

  const handleClickN = () => {
    setIsClickN(true); // 클릭 시 배경색 변경
  };
  const handleClickP = () => {
    setIsClickP(true); // 클릭 시 배경색 변경
  };
  return (
    <div className="flex flex-jc-sb">
      <StyledButtonNegative
        bgColor={bgColor}
        textColor={textColor}
        height={height}
        onClick={handleClickN}
        isClick={isClickN}
      >
        {textN}
      </StyledButtonNegative>
      <StyledButtonPositive
        bgColor={bgColor}
        textColor={textColor}
        height={height}
        onClick={handleClickP}
        isClick={isClickP}
      >
        {textP}
      </StyledButtonPositive>
    </div>
  );
};

export default CoupleButton;
