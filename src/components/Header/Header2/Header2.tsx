// src/components/Header/Header2.tsx
import React from "react";
import styled from "styled-components";
import { HiChevronLeft } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

interface OwnProps {
  text?: string;
  line?: boolean;
  nav?: any;
  rightElement?: React.ReactNode; // 우측 추가 요소 (예: 버튼)
}

const HeaderContainer = styled.header<{ line: boolean }>`
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: white;
  border-bottom: ${(props) => (props.line ? "1px solid #f0f0f0" : "none")};
  position: sticky;
  top: 0;
  z-index: 100;
  flex-shrink: 0;
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  min-width: 40px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-left: -8px; // 정렬 보정
  display: flex;
  align-items: center;
  justify-content: center;
  color: #333;
  font-size: 24px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const TitleSection = styled.div`
  flex: 1;
  text-align: center;
  font-size: 17px;
  font-family: "Pretendard-Bold";
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  min-width: 40px;
`;

/**
 * Header2 (SaaS Style)
 * - 표준 높이 56px
 * - Sticky Position
 * - 우측 요소 확장 가능
 */
const Header2: React.FC<OwnProps> = ({
  text,
  line = true,
  nav = -1,
  rightElement,
}) => {
  const navigate = useNavigate();

  return (
    <HeaderContainer line={line}>
      <LeftSection>
        <BackButton onClick={() => navigate(nav)}>
          <HiChevronLeft />
        </BackButton>
      </LeftSection>

      <TitleSection>{text}</TitleSection>

      <RightSection>{rightElement}</RightSection>
    </HeaderContainer>
  );
};

export default Header2;
