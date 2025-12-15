import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  HiCalendarDays,
  HiClipboardDocumentCheck,
  HiBell,
  HiChevronRight,
  HiCog6Tooth,
  HiShieldCheck,
  HiArrowRightOnRectangle,
  HiUserMinus,
  HiPencilSquare,
  HiSparkles,
} from "react-icons/hi2";
import apiClient from "../../api/apiClient";
import AlertModal from "../../components/Modal/AlertModal";

import { removeTokens } from "../../utils/authUtils"; // Add import

interface TeamItem {
  position: string;
  teamId: number;
  teamColor: string;
  teamImageUrl: string;
  teamName: string;
  role?: string;
}

interface ProfileData {
  name: string;
  email: string;
  imageUrl: string;
}

const MyPage: React.FC = () => {
  const [teamList, setTeamList] = useState<TeamItem[]>([]);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [profileRes, teamRes] = await Promise.all([
          apiClient.get("api/member/getUser"),
          apiClient.get("api/myPage/teams"),
        ]);

        setProfile({
          name: profileRes.data.name,
          email: profileRes.data.email,
          imageUrl: profileRes.data.profileUrl,
        });
        setTeamList(Array.isArray(teamRes.data) ? teamRes.data : []);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditClick = (
    teamId: number,
    teamColor: string,
    position: string
  ) => {
    navigate(`/team-edit/${teamId}`, {
      state: { teamId, teamColor, position },
    });
  };

  /* Alert Modal State */
  const [alertState, setAlertState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert" as "alert" | "confirm",
    variant: "info" as "success" | "danger" | "info",
    onConfirm: () => {},
  });

  const handleLogout = () => {
    setAlertState({
      isOpen: true,
      title: "로그아웃",
      message: "정말로 로그아웃 하시겠습니까?",
      type: "confirm",
      variant: "danger",
      onConfirm: () => {
        removeTokens();
        navigate("/login");
      },
    });
  };

  const closeAlert = () => {
    setAlertState((prev) => ({ ...prev, isOpen: false }));
  };

  const getPositionColor = (position: string): string => {
    switch (position) {
      case "FW":
      case "LW":
      case "RW":
        return "var(--color-sk)";
      case "DF":
      case "CB":
        return "var(--color-dp)";
      case "MF":
        return "var(--color-mf)";
      case "GK":
        return "var(--color-gk)";
      default:
        return "var(--color-main)";
    }
  };

  return (
    <PageWrapper>
      {/* 프로필 헤더 섹션 - 축구장 스타일 */}
      <ProfileHeader>
        <HeaderBackground />
        <FieldLines />
        <ProfileContent>
          {isLoading ? (
            <ProfileSkeleton>
              <SkeletonAvatar />
              <SkeletonName />
              <SkeletonEmail />
            </ProfileSkeleton>
          ) : (
            <>
              <AvatarWrapper>
                <Avatar
                  src={profile?.imageUrl || "/default-avatar.png"}
                  alt={profile?.name || "프로필"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.dataset.fallback) {
                      target.dataset.fallback = "true";
                      target.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Ccircle fill='%23e8e8e8' cx='50' cy='50' r='50'/%3E%3Ccircle fill='%23ccc' cx='50' cy='40' r='20'/%3E%3Cpath fill='%23ccc' d='M20 85c0-16.6 13.4-30 30-30s30 13.4 30 30'/%3E%3C/svg%3E";
                    }
                  }}
                />
                <OnlineBadge />
              </AvatarWrapper>
              <ProfileInfo>
                <ProfileName>{profile?.name || "사용자"}</ProfileName>
                <ProfileEmail>{profile?.email || "이메일 없음"}</ProfileEmail>
              </ProfileInfo>
              <EditProfileButton onClick={() => navigate("edit")}>
                <HiCog6Tooth size={18} />
                프로필 설정
              </EditProfileButton>
            </>
          )}
        </ProfileContent>
      </ProfileHeader>

      <ContentContainer>
        {/* 팀 섹션 */}
        <Section>
          <SectionHeader>
            <SectionTitle>
              <HiSparkles />
              가입 중인 팀
            </SectionTitle>
            <TeamCount>{teamList.length}개</TeamCount>
          </SectionHeader>

          <TeamListContainer>
            {isLoading ? (
              <>
                {[1, 2].map((i) => (
                  <TeamCardSkeleton key={i} />
                ))}
              </>
            ) : teamList.length === 0 ? (
              <EmptyTeamState>
                <EmptyIcon>⚽</EmptyIcon>
                <EmptyText>아직 가입한 팀이 없어요</EmptyText>
                <JoinTeamButton onClick={() => navigate("/team/list")}>
                  팀 찾아보기
                </JoinTeamButton>
              </EmptyTeamState>
            ) : (
              teamList.map((team) => (
                <TeamCard key={team.teamId}>
                  <TeamColorBar color={team.teamColor || "#ccc"} />
                  <TeamCardContent>
                    <TeamLogo
                      src={team.teamImageUrl || "/default-team.png"}
                      alt={team.teamName}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.dataset.fallback) {
                          target.dataset.fallback = "true";
                          target.src =
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 48 48'%3E%3Crect fill='%23e8e8e8' width='48' height='48' rx='12'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='10'%3ETEAM%3C/text%3E%3C/svg%3E";
                        }
                      }}
                    />
                    <TeamInfo
                      onClick={() =>
                        navigate("/myteam", { state: { teamId: team.teamId } })
                      }
                    >
                      <TeamName>{team.teamName}</TeamName>
                      <BadgeContainer>
                        <PositionBadge color={getPositionColor(team.position)}>
                          {team.position}
                        </PositionBadge>
                        {team.role && <RoleBadge>{team.role}</RoleBadge>}
                      </BadgeContainer>
                    </TeamInfo>
                    <EditTeamButton
                      onClick={() =>
                        handleEditClick(
                          team.teamId,
                          team.teamColor,
                          team.position
                        )
                      }
                    >
                      <HiPencilSquare size={18} />
                    </EditTeamButton>
                  </TeamCardContent>
                </TeamCard>
              ))
            )}
          </TeamListContainer>
        </Section>

        {/* 퀵 메뉴 */}
        <Section>
          <SectionTitle>빠른 메뉴</SectionTitle>
          <MenuGrid>
            <MenuCard onClick={() => navigate("/my/calendar")}>
              <MenuIconWrapper color="var(--color-info)">
                <HiCalendarDays size={24} />
              </MenuIconWrapper>
              <MenuLabel>경기 일정</MenuLabel>
            </MenuCard>
            <MenuCard onClick={() => navigate("/my/joinstatus")}>
              <MenuIconWrapper color="var(--color-success)">
                <HiClipboardDocumentCheck size={24} />
              </MenuIconWrapper>
              <MenuLabel>가입 현황</MenuLabel>
            </MenuCard>
            <MenuCard onClick={() => navigate("/my/alarm")}>
              <MenuIconWrapper color="var(--color-warning)">
                <HiBell size={24} />
              </MenuIconWrapper>
              <MenuLabel>알림 설정</MenuLabel>
            </MenuCard>
          </MenuGrid>
        </Section>

        {/* 계정 및 보안 */}
        <Section>
          <SectionTitle>계정 및 보안</SectionTitle>
          <SettingsList>
            <SettingsItem onClick={() => navigate("/my/change-pw")}>
              <SettingsItemLeft>
                <SettingsIcon>
                  <HiShieldCheck size={20} />
                </SettingsIcon>
                <SettingsLabel>비밀번호 변경</SettingsLabel>
              </SettingsItemLeft>
              <HiChevronRight size={20} color="#999" />
            </SettingsItem>
            <SettingsItem onClick={handleLogout}>
              <SettingsItemLeft>
                <SettingsIcon>
                  <HiArrowRightOnRectangle size={20} />
                </SettingsIcon>
                <SettingsLabel>로그아웃</SettingsLabel>
              </SettingsItemLeft>
              <HiChevronRight size={20} color="#999" />
            </SettingsItem>
            <SettingsItem onClick={() => navigate("/my/unsub")} danger>
              <SettingsItemLeft>
                <SettingsIcon danger>
                  <HiUserMinus size={20} />
                </SettingsIcon>
                <SettingsLabel>서비스 탈퇴</SettingsLabel>
              </SettingsItemLeft>
              <HiChevronRight size={20} color="#ff6b6b" />
            </SettingsItem>
          </SettingsList>
        </Section>

        <AppVersion>요기조기 v1.0.0</AppVersion>
      </ContentContainer>

      <AlertModal
        isOpen={alertState.isOpen}
        onClose={closeAlert}
        onConfirm={alertState.onConfirm}
        title={alertState.title}
        message={alertState.message}
        type={alertState.type}
        variant={alertState.variant}
        confirmText={alertState.type === "confirm" ? "확인" : "확인"}
      />
    </PageWrapper>
  );
};

export default MyPage;

/* ========== Animations ========== */
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

/* ========== Styled Components ========== */

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
  padding-bottom: 100px;
`;

const ProfileHeader = styled.div`
  position: relative;
  padding: 28px 20px 24px;
  overflow: hidden;
  margin-bottom: 8px;
`;

const HeaderBackground = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #2d8a5e 0%, #1e6b47 50%, #2d8a5e 100%);

  /* 축구장 잔디 패턴 (가로) */
  background-image: linear-gradient(
      90deg,
      #2d8a5e 0%,
      #1e6b47 50%,
      #2d8a5e 100%
    ),
    repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 20px,
      rgba(255, 255, 255, 0.02) 20px,
      rgba(255, 255, 255, 0.02) 40px
    );

  /* 센터 라인 (세로) */
  &::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 2px;
    background: rgba(255, 255, 255, 0.25);
    transform: translateX(-50%);
  }

  /* 센터 서클 */
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 80px;
    height: 80px;
    border: 2px solid rgba(255, 255, 255, 0.25);
    border-radius: 50%;
    transform: translate(-50%, -50%);
  }
`;

/* 페널티 박스 라인 (좌우) */
const FieldLines = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;

  /* 왼쪽 페널티 박스 */
  &::before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 40px;
    height: 80px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-left: none;
    border-radius: 0 8px 8px 0;
    transform: translateY(-50%);
  }

  /* 오른쪽 페널티 박스 */
  &::after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    width: 40px;
    height: 80px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-right: none;
    border-radius: 8px 0 0 8px;
    transform: translateY(-50%);
  }
`;

const ProfileContent = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const AvatarWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const Avatar = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
  background: #e8e8e8;
`;

const OnlineBadge = styled.div`
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 18px;
  height: 18px;
  background: var(--color-sub);
  border: 3px solid white;
  border-radius: 50%;
`;

const ProfileInfo = styled.div`
  margin-bottom: 16px;
`;

const ProfileName = styled.h1`
  color: white;
  font-size: 22px;
  font-family: "Pretendard-Bold";
  margin-bottom: 4px;
`;

const ProfileEmail = styled.p`
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
`;

const EditProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 13px;
  font-family: "Pretendard-Medium";
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
  }
`;

/* Skeleton Loading */
const ProfileSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SkeletonAvatar = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  animation: ${pulse} 1.5s infinite;
  margin-bottom: 16px;
`;

const SkeletonName = styled.div`
  width: 100px;
  height: 22px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  animation: ${pulse} 1.5s infinite;
  margin-bottom: 8px;
`;

const SkeletonEmail = styled.div`
  width: 150px;
  height: 14px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.15);
  animation: ${pulse} 1.5s infinite;
`;

const ContentContainer = styled.div`
  padding: 20px;
  margin-top: -20px;
  position: relative;
  z-index: 2;
`;

const Section = styled.section`
  margin-bottom: 24px;
  animation: ${fadeInUp} 0.4s ease;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;

  /* SectionHeader 안의 SectionTitle은 margin 제거 */
  h2 {
    margin: 0;
  }
`;

const SectionTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 16px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  margin: 0 0 12px 0;

  svg {
    color: var(--color-main);
  }
`;

const TeamCount = styled.span`
  font-size: 13px;
  color: var(--color-dark1);
  background: #f0f0f0;
  padding: 4px 10px;
  border-radius: 12px;
`;

const TeamListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TeamCard = styled.div`
  display: flex;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }
`;

const TeamColorBar = styled.div<{ color: string }>`
  width: 4px;
  background: ${(props) => props.color};
`;

const TeamCardContent = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 14px;
`;

const TeamLogo = styled.img`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  object-fit: cover;
  background: #f0f0f0;
`;

const TeamInfo = styled.div`
  flex: 1;
  cursor: pointer;
`;

const TeamName = styled.h3`
  font-size: 15px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2);
  margin-bottom: 4px;
`;

const PositionBadge = styled.span<{ color: string }>`
  display: inline-block;
  font-size: 11px;
  font-family: "Pretendard-Bold";
  color: ${(props) => props.color};
  background: ${(props) => props.color}15;
  padding: 2px 8px;
  border-radius: 4px;
`;

const BadgeContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const RoleBadge = styled.span`
  display: inline-block;
  font-size: 11px;
  font-family: "Pretendard-Bold";
  color: #666;
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 4px;
`;

const EditTeamButton = styled.button`
  background: #f5f5f5;
  border: none;
  border-radius: 10px;
  padding: 10px;
  cursor: pointer;
  color: var(--color-dark1);
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-main);
    color: white;
  }
`;

const TeamCardSkeleton = styled.div`
  height: 80px;
  background: white;
  border-radius: 16px;
  background: linear-gradient(90deg, #f5f5f5 25%, #eee 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const EmptyTeamState = styled.div`
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 16px;
`;

const EmptyIcon = styled.div`
  font-size: 40px;
  margin-bottom: 12px;
`;

const EmptyText = styled.p`
  font-size: 14px;
  color: var(--color-dark1);
  margin-bottom: 16px;
`;

const JoinTeamButton = styled.button`
  background: var(--color-main);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 20px;
  font-size: 14px;
  font-family: "Pretendard-SemiBold";
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-main-darker);
  }
`;

/* Quick Menu */
const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const MenuCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  background: white;
  border: none;
  border-radius: 16px;
  padding: 20px 12px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const MenuIconWrapper = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: ${(props) => props.color}15;
  color: ${(props) => props.color};
`;

const MenuLabel = styled.span`
  font-size: 13px;
  font-family: "Pretendard-Medium";
  color: var(--color-dark2);
`;

/* Settings List */
const SettingsList = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const SettingsItem = styled.button<{ danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  background: none;
  border: none;
  border-bottom: 1px solid #f5f5f5;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: ${(props) => (props.danger ? "#fff5f5" : "#f9f9f9")};
  }
`;

const SettingsItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SettingsIcon = styled.div<{ danger?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${(props) => (props.danger ? "#ffebeb" : "#f0f9f6")};
  color: ${(props) => (props.danger ? "#ff6b6b" : "var(--color-main)")};
`;

const SettingsLabel = styled.span<{ danger?: boolean }>`
  font-size: 15px;
  font-family: "Pretendard-Medium";
  color: ${(props) => (props.danger ? "#ff6b6b" : "var(--color-dark2)")};
`;

const AppVersion = styled.div`
  text-align: center;
  font-size: 12px;
  color: var(--color-dark1);
  padding: 20px 0;
`;
