// src/components/Input/Input.tsx
import React, { forwardRef } from "react";
import styled from "styled-components";

//입력 안되는 input 창
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
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

// StyledInput 컴포넌트 정의
const StyledInput = styled.div<InputProps>`
  background-color: ${(props) => props.bgColor || "var(--color-light2)"};
  height: ${(props) => (props.height ? `${props.height}px` : "100%")};
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};
  padding: ${(props) => (props.padding ? `${props.padding}px` : "10px")};
  box-sizing: border-box;
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : "14px")};
  border-radius: 8px;
  margin: 5px 0 5px 0;
  white-space: pre-wrap;
  word-break: break-all;
  min-width: 200px;

  &:focus {
    outline: 0px;
    border: 1px solid var(--color-border);
  }
`;

/**
 * props가 적용된 Input 컴포넌트 생성
 * @param {InputProps} props - 컴포넌트 props
 * @param {React.Ref<HTMLInputElement>} ref - input 요소에 대한 ref
 * @returns {JSX.Element} Input 컴포넌트
 */
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      bgColor,
      height,
      type,
      placeholder,
      fontSize,
      title,
      value,
      onChange,
      padding,
      width,
    },
    ref
  ) => {
    return (
      <div>
        {title && <h4>{title}</h4>}
        <StyledInput
          className="border-df shadow-df"
          ref={ref}
          bgColor={bgColor}
          height={height}
          type={type}
          placeholder={placeholder}
          fontSize={fontSize}
          onChange={onChange}
          padding={padding}
          width={width}
        >
          {value}
        </StyledInput>
      </div>
    );
  }
);

export default Input;
