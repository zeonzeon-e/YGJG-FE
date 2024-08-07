import React from "react";
import { FaChevronLeft } from "react-icons/fa6";
import HorizontalLine from "../../Styled/HorizontalLine";
import "./Header2.css";

interface OwnProps {
  text?: string; // 헤더에 표시될 텍스트 (선택적)
  line?: boolean; // 수평선을 표시할지 여부 (선택적)
}
/**
 * Header2 컴포넌트 - 뒤로가기 버튼 O and 밑줄표기 가능
 * @param {OwnProps} props - 컴포넌트에 전달되는 props
 * @param {string} [props.text] - 헤더에 표시될 텍스트 (선택적)
 * @param {boolean} [props.line=true] - 수평선을 표시할지 여부 (선택적, 기본값 = true)
 * @returns {JSX.Element} Header2 컴포넌트
 */
const Header2: React.FC<OwnProps> = ({ text, line = true }) => {
  return (
    <div>
      <div className="Header2__wrap">
        <div className="Header2__back">
          <FaChevronLeft />
        </div>
        <div className="Header2__text">{text}</div>
      </div>
      {/* line이 true일 경우 HorizontalLine 컴포넌트를 렌더링 */}
      {line && <HorizontalLine />}
    </div>
  );
};

export default Header2;
