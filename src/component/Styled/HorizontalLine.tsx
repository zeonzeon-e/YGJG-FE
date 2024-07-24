import React from "react";
import styled from "styled-components";

// props 타입 정의
interface HorizontalLineProps {
  color?: string;
  height?: number;
}

// StyledDiv 컴포넌트 정의
const StyledDiv = styled.div<HorizontalLineProps>`
  background-color: ${(props) => props.color || "#ccc"};
  height: ${(props) => (props.height ? `${props.height}px` : "2px")};
  border-radius: ${(props) =>
    props.height ? `${props.height / 2}px` : "0.5px"};
  // box-shadow: 0.25px 0.25px 0.5px 0.1px;
`;

/**
 * props가 적용된 HorizontalLine 컴포넌트 생성
 * @param {HorizontalLineProps} props - 컴포넌트 props
 * @param {string} [props.color] - 선의 색상
 * @param {number} [props.height] - 선의 세로 두께
 * @returns {JSX.Element} HorizontalLine 컴포넌트
 */
const HorizontalLine: React.FC<HorizontalLineProps> = ({ color, height }) => {
  return <StyledDiv color={color} height={height} />;
};

export default HorizontalLine;
