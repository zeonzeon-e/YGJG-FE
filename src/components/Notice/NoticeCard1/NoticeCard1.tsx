import React from "react";
import { FaThumbtack } from "react-icons/fa";
import "./NoticeCard1.css";

interface NoticeCard1Props {
  title: string;
  date: string;
  children?: React.ReactNode;
}

/**
 * NoticeCard 컴포넌트 - 공지사항 카드를 렌더링
 * @param {NoticeCardProps} props - 컴포넌트에 전달되는 props
 * @param {string} props.title - 공지사항의 제목
 * @param {string} props.date - 공지사항의 수정 날짜
 * @param {React.ReactNode} [props.children] - 공지사항의 내용 (선택적)
 * @returns {JSX.Element} NoticeCard 컴포넌트
 */
const NoticeCard1: React.FC<NoticeCard1Props> = ({ title, date, children }) => {
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

export default NoticeCard1;
