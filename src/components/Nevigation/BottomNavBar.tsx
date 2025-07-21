import React, { useState } from "react";
import { FaHome, FaUsers, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트
import "./BottomNavBar.css";

interface NavItemType {
  value: "home" | "users" | "profile";
}

/**
 * BottomNavBar 컴포넌트 - 하단 네비게이션 바를 표시
 * @returns {JSX.Element} BottomNavBar 컴포넌트
 */
const BottomNavBar: React.FC = () => {
  // 현재 선택된 네비게이션 항목 (기본값: "home")
  const [selected, setSelected] = useState<NavItemType["value"]>("home");
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 네비게이션 아이템 클릭 핸들러
  const handleItemClick = (itemValue: NavItemType["value"], path: string) => {
    setSelected(itemValue); // 선택된 상태 업데이트
    navigate(path); // 해당 경로로 이동
  };

  return (
    <div className="nav-bar">
      <div
        className={`nav-item ${selected === "home" ? "selected" : ""}`}
        onClick={() => handleItemClick("home", "/myteam")}
      >
        <FaHome size={24} />
        <span className="icon-label">Home</span>
      </div>
      <div
        className={`nav-item ${selected === "users" ? "selected" : ""}`}
        onClick={() => handleItemClick("users", "/team/list")}
      >
        <FaUsers size={24} />
        <span className="icon-label">Users</span>
      </div>
      <div
        className={`nav-item ${selected === "profile" ? "selected" : ""}`}
        onClick={() => handleItemClick("profile", "/my")}
      >
        <FaUser size={24} />
        <span className="icon-label">Profile</span>
      </div>
    </div>
  );
};

export default BottomNavBar;
