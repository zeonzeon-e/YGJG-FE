import React from "react";
import styled from "styled-components";

interface OwnProps {
  text?: string;
  line?: boolean;
}

const HeaderContainer = styled.header<{ line: boolean }>`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  background-color: white;
  border-bottom: ${(props) => (props.line ? "1px solid #f0f0f0" : "none")};
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
`;

const Title = styled.div`
  font-size: 17px;
  font-family: "Pretendard-Bold";
  color: #333;
  text-align: center;
`;

/**
 * Header1: 뒤로가기 버튼 없이 타이틀만 있는 단순 헤더
 * SaaS 스타일(56px, sticky) 적용
 */
const Header1: React.FC<OwnProps> = ({ text, line = true }) => {
  return (
    <HeaderContainer line={line}>
      <Title>{text}</Title>
    </HeaderContainer>
  );
};

export default Header1;
