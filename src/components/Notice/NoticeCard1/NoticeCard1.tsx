import React from "react";
import { FaThumbtack } from "react-icons/fa";
import "./NoticeCard1.css";

interface NoticeCard1Props {
  title: string;
  createDate: string;
  updateDate?: string;
  children?: React.ReactNode;
  writer: string;
  img?: string;
}

/**
 * NoticeCard 컴포넌트 - 공지사항 카드를 렌더링
 * @param {NoticeCardProps} props - 컴포넌트에 전달되는 props
 * @param {string} props.title - 공지사항의 제목
 * @param {string} props.createDate - 공지사항의 생성 날짜
 * @param {string} props.updateDate - 공지사항의 수정 날짜
 * @param {string} props.writer - 공지사항의 작성자
 * @param {React.ReactNode} [props.children] - 공지사항의 내용 (선택적)
 * @returns {JSX.Element} NoticeCard 컴포넌트
 */
const NoticeCard1: React.FC<NoticeCard1Props> = ({
  title,
  createDate,
  updateDate,
  children,
  writer,
  img,
}) => {
  return (
    <div className="notice-card">
      <div className="notice-card-header">
        <div className="notice-card-title">
          <FaThumbtack className="notice-card-icon" />
          {title}
        </div>
        <div className="notice-card-date">{createDate} 생성</div>
        {updateDate && (
          <div className="notice-card-date">{updateDate} 수정</div>
        )}
        <div className="notice-card-date">작성자 : {writer}</div>
      </div>

      {img && (
        <div>
          <img src={img} width={"100%"} />
        </div>
      )}
      <div className="notice-card-content">{children}</div>
    </div>
  );
};

export default NoticeCard1;
