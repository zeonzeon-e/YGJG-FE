import React, { useState } from "react";
import { FaHome, FaUsers, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components"; // styled-components 임포트

// Styled Components 정의
const NavContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #333;
  padding: 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
  max-width: 600px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
`;

const NavItem = styled.div<{ $isSelected: boolean }>`
  color: ${(props) =>
    props.$isSelected ? "#fff" : "#bbb"}; /* selected prop에 따라 색상 변경 */
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: color 0.3s;
`;

const IconLabel = styled.span`
  font-size: 12px;
  margin-top: 5px;
`;

// 기존 인터페이스 및 컴포넌트 로직 (변화 없음)
interface NavItemType {
  value: "home" | "users" | "profile";
}

/**
 * BottomNavBar 컴포넌트 - 하단 네비게이션 바를 표시
 * @returns {JSX.Element} BottomNavBar 컴포넌트
 */
const BottomNavBar: React.FC = () => {
  const [selected, setSelected] = useState<NavItemType["value"]>("home");
  const navigate = useNavigate();

  const handleItemClick = (itemValue: NavItemType["value"], path: string) => {
    setSelected(itemValue);
    navigate(path);
  };

  return (
    <NavContainer>
      {" "}
      {/* Styled Component로 변경 */}
      <NavItem
        $isSelected={selected === "home"} // $isSelected prop 전달
        onClick={() => handleItemClick("home", "/myteam")}
      >
        <FaHome size={24} />
        <IconLabel>Home</IconLabel> {/* Styled Component로 변경 */}
      </NavItem>
      <NavItem
        $isSelected={selected === "users"} // $isSelected prop 전달
        onClick={() => handleItemClick("users", "/team/list")}
      >
        <FaUsers size={24} />
        <IconLabel>Users</IconLabel> {/* Styled Component로 변경 */}
      </NavItem>
      <NavItem
        $isSelected={selected === "profile"} // $isSelected prop 전달
        onClick={() => handleItemClick("profile", "/my")}
      >
        <FaUser size={24} />
        <IconLabel>Profile</IconLabel> {/* Styled Component로 변경 */}
      </NavItem>
    </NavContainer>
  );
};

export default BottomNavBar;
