import React from "react";
import "./MenuList.css";

interface MenuListProps {
  title: string;
  items: string[];
}

/**
 * MenuList 컴포넌트 - 메뉴 리스트를 표시
 * @param {MenuListProps} props - 컴포넌트에 전달되는 props
 * @param {string} props.title - 섹션 제목
 * @param {string[]} props.items - 섹션 항목 리스트
 * @returns {JSX.Element} MenuList 컴포넌트
 */
const MenuList: React.FC<MenuListProps> = ({ title, items }) => {
  return (
    <div className="menu-list">
      <div className="menu-title">{title}</div>
      <ul className="menu-items">
        {items.map((item, index) => (
          <li key={index} className="menu-item">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuList;
