import React from "react";
import styled from "styled-components";

// props 타입 정의
interface InputProps {
  bgColor?: string;
  height?: number;
  width?: number;
  type: string;
  placeholder?: string;
  fontSize?: number;
  title?: string;
  padding?: number;
  value?: string; // 추가: value prop
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; // 추가: onChange prop
}

// StyledInput 컴포넌트 정의
const StyledInput = styled.input<InputProps>`
  background-color: ${(props) => props.bgColor || "var(--color-light2)"};
  height: ${(props) => (props.height ? `${props.height}px` : "20px")};
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};
  border: 1px solid var(--color-light2);
  padding: ${(props) => (props.padding ? `${props.padding}px` : "15px")};
  box-sizing: border-box;
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : "14px")};
  border-radius: 8px;
  margin-top: 10px;
  // box-shadow: 0.25px 0.25px 0.5px 0.1px;

  &:focus {
    outline: 0px;
    border: 1px solid var(--color-main);
  }
`;

/**
 * props가 적용된 Input 컴포넌트 생성
 * @param {string} [props.type] - 인풋 타입 정하기
 * @param {InputProps} props - 컴포넌트 props
 * @param {string} [props.bgColor] - 인풋 배경 색상 (선택적)
 * @param {number} [props.height] - 인풋 높이 (선택적)
 * @param {number} [porps.width] - 인풋 너비 (선택적)
 * @param {string} [porps.placeholder] - 인풋 설명 (선택적)
 * @param {string} [props.title] - 인풋 타이틀(선택적)
 * @param {number} [porps.fontSize] - 인풋 안에 있는 설명 텍스트 사이즈(선택적)
 * @param {string} [props.value] - 입력 필드의 값 (선택적)
 * @param {function} [props.onChange] - 입력이 변경될 때 호출되는 함수 (선택적)
 * @returns {JSX.Element} Input 컴포넌트
 */
const Input: React.FC<InputProps> = ({
  bgColor,
  height,
  type,
  placeholder,
  fontSize,
  title,
  value,
  onChange,
}) => {
  return (
    <div>
      <h4>{title}</h4>
      <StyledInput
        bgColor={bgColor}
        height={height}
        type={type}
        placeholder={placeholder}
        fontSize={fontSize}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
