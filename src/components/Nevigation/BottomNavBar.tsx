import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled, { keyframes, css } from "styled-components";
import { HiHome, HiUserGroup, HiUser } from "react-icons/hi2";

// Types
interface NavItemType {
  value: "home" | "users" | "profile";
  path: string;
  label: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

const navItems: NavItemType[] = [
  {
    value: "home",
    path: "/myteam",
    label: "홈",
    icon: <HiHome size={24} />,
    activeIcon: <HiHome size={24} />,
  },
  {
    value: "users",
    path: "/team/list",
    label: "팀 찾기",
    icon: <HiUserGroup size={24} />,
    activeIcon: <HiUserGroup size={24} />,
  },
  {
    value: "profile",
    path: "/my",
    label: "마이",
    icon: <HiUser size={24} />,
    activeIcon: <HiUser size={24} />,
  },
];

/**
 * BottomNavBar 컴포넌트 - 하단 네비게이션 바
 */
const BottomNavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 경로에 따라 선택된 탭 결정
  const getSelectedFromPath = (): NavItemType["value"] => {
    const path = location.pathname;
    if (path.startsWith("/myteam")) return "home"; // /myteam을 먼저 체크 (홈)
    if (path.startsWith("/team")) return "users";
    if (path.startsWith("/my")) return "profile";
    return "home";
  };

  const [selected, setSelected] = useState<NavItemType["value"]>(
    getSelectedFromPath()
  );

  // 경로 변경 시 선택 상태 업데이트
  useEffect(() => {
    setSelected(getSelectedFromPath());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleItemClick = (item: NavItemType) => {
    // 현재 경로가 탭의 메인 경로와 다르면 이동 (하위 페이지에서 메인으로 돌아갈 수 있도록)
    if (location.pathname !== item.path) {
      setSelected(item.value);
      navigate(item.path);
    }
  };

  return (
    <NavContainer>
      <NavBackground />
      <NavContent>
        {navItems.map((item) => {
          const isSelected = selected === item.value;
          return (
            <NavItem
              key={item.value}
              $isSelected={isSelected}
              onClick={() => handleItemClick(item)}
            >
              <IconWrapper $isSelected={isSelected}>
                {isSelected ? item.activeIcon : item.icon}
                {isSelected && <ActiveIndicator />}
              </IconWrapper>
              <IconLabel $isSelected={isSelected}>{item.label}</IconLabel>
            </NavItem>
          );
        })}
      </NavContent>
    </NavContainer>
  );
};

export default BottomNavBar;

/* ========== Animations ========== */
const scaleIn = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const pulseRing = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
`;

/* ========== Styled Components ========== */

const NavContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 600px;
  z-index: 999;
  padding: 0 12px;
  padding-bottom: env(safe-area-inset-bottom, 0);
`;

const NavBackground = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.08);
  border-top: 1px solid rgba(255, 255, 255, 0.5);
`;

const NavContent = styled.div`
  position: relative;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 10px 16px 14px;
`;

const NavItem = styled.button<{ $isSelected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px 20px;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;

  ${(props) =>
    props.$isSelected &&
    css`
      background: linear-gradient(
        135deg,
        rgba(14, 98, 68, 0.1) 0%,
        rgba(28, 237, 164, 0.1) 100%
      );
    `}

  &:active {
    transform: scale(0.95);
  }
`;

const IconWrapper = styled.div<{ $isSelected: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.$isSelected ? "var(--color-main)" : "var(--color-dark1)"};
  transition: all 0.3s ease;

  ${(props) =>
    props.$isSelected &&
    css`
      animation: ${scaleIn} 0.3s ease;
    `}

  svg {
    transition: all 0.3s ease;
  }
`;

const ActiveIndicator = styled.div`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 8px;
  height: 8px;
  background: var(--color-sub);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--color-sub);

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: var(--color-sub);
    border-radius: 50%;
    animation: ${pulseRing} 1.5s ease-out infinite;
  }
`;

const IconLabel = styled.span<{ $isSelected: boolean }>`
  font-size: 11px;
  font-family: ${(props) =>
    props.$isSelected ? "Pretendard-SemiBold" : "Pretendard-Regular"};
  color: ${(props) =>
    props.$isSelected ? "var(--color-main)" : "var(--color-dark1)"};
  transition: all 0.3s ease;
  white-space: nowrap;
`;
