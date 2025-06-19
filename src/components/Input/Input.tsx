// src/components/Input/Input.tsx
import React, { forwardRef } from "react";
import styled, { css } from "styled-components";

// props 타입 정의
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  bgColor?: string;
  height?: number;
  width?: number;
  fontSize?: number;
  title?: string;
  padding?: number;
  border?: string;
  hasError?: boolean;
  hasSuccess?: boolean; // 성공 상태를 나타내는 prop 추가
}

// StyledInput 컴포넌트 정의
const StyledInput = styled.input<InputProps>`
  background-color: ${(props) => props.bgColor || "var(--color-light1)"};
  height: ${(props) => (props.height ? `${props.height}px` : "20px")};
  width: ${(props) => (props.width ? `${props.width}px` : "100%")};
  padding: ${(props) => (props.padding ? `${props.padding}px` : "15px")};
  box-sizing: border-box;
  font-size: ${(props) => (props.fontSize ? `${props.fontSize}px` : "14px")};
  border-radius: 8px;
  margin: 5px 0 0 0; /* 메시지 공간을 위해 하단 여백 제거 또는 조정 */
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  /* 테두리 설정: hasError > hasSuccess > props.border > 기본값 */
  border: 1px solid
    ${(props) => {
      if (props.hasError) return "var(--color-error)";
      if (props.hasSuccess) return "var(--color-success)";
      return props.border || "var(--color-border)";
    }};

  &:focus {
    outline: 0px;
    border: 1px solid
      ${(props) => {
        if (props.hasError) return "var(--color-error)";
        if (props.hasSuccess) return "var(--color-success)";
        return "var(--color-main)";
      }};
    box-shadow: 0 0 0 2px
      ${(props) => {
        if (props.hasError) return "rgba(255, 56, 59, 0.2)"; /* 붉은색 계열 */
        if (props.hasSuccess) return "rgba(6, 194, 112, 0.2)"; /* 초록색 계열 */
        return "rgba(14, 98, 68, 0.2)"; /* 기본 포커스 색상 계열 */
      }};
  }

  &:disabled {
    background-color: var(--color-light2);
    color: var(--color-dark1);
    cursor: not-allowed;
    border-color: var(--color-border);
    box-shadow: none;
  }

  ${(props) =>
    props.hasError &&
    css`
      &::placeholder {
        color: var(--color-error);
        opacity: 0.7;
      }
    `}

  ${(props) =>
    props.hasSuccess && // hasError가 아닐 때만 적용되도록 명시적으로 처리할 수도 있음
    !props.hasError &&
    css`
      &::placeholder {
        /* 성공 시 플레이스홀더 스타일 (필요하다면) */
        /* color: var(--color-success); */
        /* opacity: 0.7; */
      }
    `}
`;

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      bgColor,
      height,
      type,
      placeholder,
      fontSize,
      title,
      padding,
      width,
      border,
      hasError,
      hasSuccess, // hasSuccess prop 추가
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <>
        {title && <h4>{title}</h4>}
        <StyledInput
          className="border-df shadow-df"
          ref={ref}
          bgColor={bgColor}
          height={height}
          type={type}
          placeholder={placeholder}
          fontSize={fontSize}
          padding={padding}
          width={width}
          border={border}
          hasError={hasError}
          hasSuccess={hasSuccess} // StyledInput으로 전달
          disabled={disabled}
          {...rest}
        />
      </>
    );
  }
);

export default Input;
