// src/components/Header/Header1.tsx
import React from "react";
import styled from "styled-components";
import HorizontalLine from "../../Styled/HorizontalLine";

interface OwnProps {
  text?: string; // 헤더에 표시될 텍스트 (선택적)
  line?: boolean; // 수평선을 표시할지 여부 (선택적)
}

// Wrapper 역할을 하는 styled-component (원래 .Header1__wrap)
const Wrap = styled.div`
  height: 44px;
  position: relative;
  margin-bottom: 5px;
`;

// 텍스트를 감싸는 styled-component (원래 .Header1__text)
// 그리고 Wrap 내부의 모든 자식 요소(현재는 텍스트만)에도 동일한 스타일 적용
const Text = styled.div`
  position: absolute;
  top: 20px;
  font-size: 20px;
  font-weight: 700;
  left: 50%;
  transform: translateX(-50%);
`;

/**
 * Header1 컴포넌트 - 뒤로가기 버튼 없이, 가운데 텍스트와 밑줄을 표시 가능
 * @param {OwnProps} props - 컴포넌트에 전달되는 props
 * @param {string} [props.text] - 헤더에 표시될 텍스트 (선택적)
 * @param {boolean} [props.line=true] - 수평선을 표시할지 여부 (선택적, 기본값 = true)
 * @returns {JSX.Element} Header1 컴포넌트
 */
const Header1: React.FC<OwnProps> = ({ text, line = true }) => {
  return (
    <div>
      <Wrap>
        <Text>{text}</Text>
      </Wrap>
      {/* line이 true일 경우 HorizontalLine 컴포넌트를 렌더링 */}
      {line && <HorizontalLine />}
    </div>
  );
};

export default Header1;
