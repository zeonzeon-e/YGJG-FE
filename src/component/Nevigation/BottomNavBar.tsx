import React, { useState } from "react";
import { FaHome, FaUsers, FaUser } from "react-icons/fa";
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

  return (
    <div className="nav-bar">
      <div
        className={`nav-item ${selected === "home" ? "selected" : ""}`}
        onClick={() => setSelected("home")}
      >
        <FaHome size={24} />
        <span className="icon-label">Home</span>
      </div>
      <div
        className={`nav-item ${selected === "users" ? "selected" : ""}`}
        onClick={() => setSelected("users")}
      >
        <FaUsers size={24} />
        <span className="icon-label">Users</span>
      </div>
      <div
        className={`nav-item ${selected === "profile" ? "selected" : ""}`}
        onClick={() => setSelected("profile")}
      >
        <FaUser size={24} />
        <span className="icon-label">Profile</span>
      </div>
    </div>
  );
};

export default BottomNavBar;
