// src/components/Header/Header2.tsx
import React from "react";
import { FaChevronLeft } from "react-icons/fa6";
import styled from "styled-components";
import HorizontalLine from "../../Styled/HorizontalLine";
import { useNavigate } from "react-router-dom";

interface OwnProps {
  text?: string; // 헤더에 표시될 텍스트 (선택적)
  line?: boolean; // 수평선을 표시할지 여부 (선택적)
}

// Wrap: 원래 .Header2__wrap
const Wrap = styled.div`
  height: 34px;
  position: relative;
  margin-top: 10px;
`;

// Back: 원래 .Header2__back
const Back = styled.div`
  position: absolute;
  font-size: 20px;
  font-weight: 700;
  left: 5px;
  cursor: pointer;

  & > * {
    padding: 5px;
  }
`;

// Text: 원래 .Header2__text
const Text = styled.div`
  position: absolute;
  font-size: 20px;
  font-weight: 700;
  padding: 5px;
  left: 50%;
  transform: translateX(-50%);
`;

/**
 * Header2 컴포넌트 - 뒤로가기 버튼 O and 밑줄표기 가능
 * @param {OwnProps} props - 컴포넌트에 전달되는 props
 * @param {string} [props.text] - 헤더에 표시될 텍스트 (선택적)
 * @param {boolean} [props.line=true] - 수평선을 표시할지 여부 (선택적, 기본값 = true)
 * @returns {JSX.Element} Header2 컴포넌트
 */
const Header2: React.FC<OwnProps> = ({ text, line = true }) => {
  const navigate = useNavigate();

  return (
    <div>
      <Wrap>
        <Back onClick={() => navigate(-1)}>
          <FaChevronLeft />
        </Back>
        <Text>{text}</Text>
      </Wrap>
      {line && <HorizontalLine />}
    </div>
  );
};

export default Header2;
