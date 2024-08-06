import React from "react";
import { FaThumbtack } from "react-icons/fa";
import "./ScrollProgress.css";

interface ScrollProgressProps {
  title: string;
  date: string;
  children?: React.ReactNode;
}

/**
 * ScrollProgress 컴포넌트 - 진행과정 렌더링
 * @param {ScrollProgressProps} props - 컴포넌트에 전달되는 props
 * @param {React.ReactNode} [props.children] - 공지사항의 내용 (선택적)
 * @returns {JSX.Element} ScrollProgress 컴포넌트
 */
const ScrollProgress: React.FC<ScrollProgressProps> = ({
  title,
  date,
  children,
}) => {
  return (
    <div className="notice-card">
      <div className="notice-card-header">
        <div className="notice-card-title">
          <FaThumbtack className="notice-card-icon" />
          {title}
        </div>
        <div className="notice-card-date">{date} 수정</div>
      </div>
      <div className="notice-card-content">{children}</div>
    </div>
  );
};

export default ScrollProgress;
