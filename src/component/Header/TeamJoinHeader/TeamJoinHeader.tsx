import React from "react";
import "./TeamJoinHeader.css";

interface TeamJoinHeaderProps {
  profileImage: string;
  userName: string;
  applicationTitle: string;
}

/**
 * TeamJoinHeader 컴포넌트 - 팀 가입 신청서를 표시
 * @param {TeamJoinHeaderProps} props - 컴포넌트에 전달되는 props
 * @param {string} props.profileImage - 프로필 이미지 URL
 * @param {string} props.userName - 사용자 이름
 * @param {string} props.applicationTitle - 신청서 제목
 * @returns {JSX.Element} TeamJoinHeader 컴포넌트
 */
const TeamJoinHeader: React.FC<TeamJoinHeaderProps> = ({
  profileImage,
  userName,
  applicationTitle,
}) => {
  return (
    <div className="team-join-card">
      <img className="profile-image" src={profileImage} alt="Profile" />
      <div className="user-info">
        <div className="user-name">{userName}</div>
        <div className="application-title">{applicationTitle}</div>
      </div>
    </div>
  );
};

export default TeamJoinHeader;
