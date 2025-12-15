import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header3 from "../../../components/Header/Header3"; // Refactored Header3
import apiClient from "../../../api/apiClient";
import { useNavigate } from "react-router-dom";
import { getAccessToken } from "../../../utils/authUtils";
import {
  HiUserGroup,
  HiClipboardDocument,
  HiCog6Tooth,
  HiMegaphone,
  HiCalendarDays,
  HiUserPlus,
} from "react-icons/hi2";

// --- Interfaces ---
interface TeamListItem {
  teamId: number;
  teamName: string;
  teamColor?: string; // Optional
  role?: string;
}

interface TeamData {
  teamName: string;
  teamImageUrl: string;
  region: string;
  ageRange: string;
  memberCount: number;
  inviteCode: string;
  // ... others
}

interface NoticeItem {
  id: number;
  title: string;
  createAt: Date | string;
}

// --- Mock Data ---
const DEV_MOCK_TEAM_DATA: TeamData = {
  teamName: "FC 개발자들",
  teamImageUrl: "", // Empty or URL
  region: "서울 마포구",
  ageRange: "20~30대",
  memberCount: 24,
  inviteCode: "DEV-1234",
};

const DEV_MOCK_NOTICES: NoticeItem[] = [
  { id: 1, title: "이번 주 정기 모임 안내 (필독)", createAt: "2024-05-20" },
  { id: 2, title: "유니폼 사이즈 조사", createAt: "2024-05-18" },
];

const TeamInfoPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTeam, setSelectedTeam] = useState<{
    teamId: number;
    teamName: string;
  } | null>(null);
  const [teamList, setTeamList] = useState<TeamListItem[]>([]);
  const [teamData, setTeamData] = useState<TeamData | null>(null);
  const [favoriteTeams, setFavoriteTeams] = useState<number[]>([]);
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchTeamList = async () => {
      const token = getAccessToken();
      if (token?.startsWith("dev-")) {
        // Dev Mode Mock
        setTeamList([
          { teamId: 1, teamName: "FC 개발자들", role: "MANAGER" },
          { teamId: 2, teamName: "테스트 유나이티드", role: "MEMBER" },
        ]);
        setSelectedTeam({ teamId: 1, teamName: "FC 개발자들" });
      } else {
        try {
          const response = await apiClient.get("api/myPage/teams"); // Check API Path
          setTeamList(response.data);
          if (response.data.length > 0) {
            setSelectedTeam(response.data[0]);
          }
        } catch (err) {
          console.error("Error fetching team list:", err);
        }
      }
    };
    fetchTeamList();
  }, []);

  useEffect(() => {
    if (!selectedTeam) return;

    const fetchData = async () => {
      setLoading(true);
      const token = getAccessToken();

      if (token?.startsWith("dev-")) {
        await new Promise((r) => setTimeout(r, 300));
        setTeamData(DEV_MOCK_TEAM_DATA);
        setNoticeList(DEV_MOCK_NOTICES);
      } else {
        try {
          // Team Detail
          const teamRes = await apiClient.get(
            `api/team/${selectedTeam.teamId}`
          );
          setTeamData(teamRes.data);

          // Notice List
          const noticeRes = await apiClient.get(
            "/api/announcement/member/get-all",
            {
              params: { teamId: selectedTeam.teamId },
            }
          );
          setNoticeList(noticeRes.data);
        } catch (err) {
          console.error("Error fetching detail data:", err);
        }
      }
      setLoading(false);
    };

    fetchData();
  }, [selectedTeam]);

  // --- Handlers ---
  const handleTeamChange = (teamId: number, teamName: string) => {
    setSelectedTeam({ teamId, teamName });
  };

  const handleToggleFavorite = (teamId: number) => {
    setFavoriteTeams((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  };

  const copyInviteCode = () => {
    if (teamData?.inviteCode) {
      navigator.clipboard.writeText(teamData.inviteCode);
      alert("초대코드가 복사되었습니다! 📋");
    }
  };

  // --- Render ---
  return (
    <>
      <Header3
        selectedTeam={selectedTeam}
        teams={teamList}
        onTeamChange={handleTeamChange}
        favoriteTeams={favoriteTeams}
        onToggleFavorite={handleToggleFavorite}
      />

      <DashboardContainer>
        {loading ? (
          <LoadingState>데이터를 불러오는 중...</LoadingState>
        ) : teamData ? (
          <>
            <WelcomeSection>
              <TeamTitle>{teamData.teamName} 관리</TeamTitle>
              <SubText>팀 운영을 위한 모든 기능을 여기서 확인하세요.</SubText>
            </WelcomeSection>

            {/* Quick Stats Grid */}
            <StatsGrid>
              <StatCard onClick={() => navigate(`memberList`)}>
                <StatIcon className="purple">
                  <HiUserGroup />
                </StatIcon>
                <StatValue>{teamData.memberCount}</StatValue>
                <StatLabel>전체 멤버</StatLabel>
              </StatCard>
              <StatCard onClick={() => navigate(`joinReview`)}>
                <StatIcon className="orange">
                  <HiUserPlus />
                </StatIcon>
                <StatValue>1</StatValue> {/* Mock or API Need */}
                <StatLabel>가입 대기</StatLabel>
              </StatCard>
              <StatCard onClick={copyInviteCode}>
                <StatIcon className="blue">
                  <HiClipboardDocument />
                </StatIcon>
                <StatValue style={{ fontSize: "14px" }}>
                  {teamData.inviteCode}
                </StatValue>
                <StatLabel>초대코드</StatLabel>
              </StatCard>
            </StatsGrid>

            {/* Management Actions */}
            <SectionHeader>빠른 메뉴</SectionHeader>
            <ActionGrid>
              <ActionCard
                onClick={() =>
                  navigate(`/team/${selectedTeam?.teamId}/notice/create`)
                }
              >
                <ActionIcon>
                  <HiMegaphone />
                </ActionIcon>
                <ActionText>공지 작성</ActionText>
              </ActionCard>
              <ActionCard
                onClick={() => navigate(`/team-edit/${selectedTeam?.teamId}`)}
              >
                <ActionIcon>
                  <HiCog6Tooth />
                </ActionIcon>
                <ActionText>팀 정보 설정</ActionText>
              </ActionCard>
              <ActionCard
                onClick={() =>
                  navigate(`/team/${selectedTeam?.teamId}/calendar`)
                }
              >
                <ActionIcon>
                  <HiCalendarDays />
                </ActionIcon>
                <ActionText>일정 관리</ActionText>
              </ActionCard>
              {/* <ActionCard>
                <ActionIcon><HiChartBar /></ActionIcon>
                <ActionText>전략 보드</ActionText>
              </ActionCard> */}
            </ActionGrid>

            {/* Recent Notices */}
            <SectionHeader>
              최근 공지
              <MoreButton
                onClick={() => navigate(`/team/${selectedTeam?.teamId}/notice`)}
              >
                더보기
              </MoreButton>
            </SectionHeader>
            <RecentList>
              {noticeList.length > 0 ? (
                noticeList.slice(0, 3).map((notice) => (
                  <RecentItem
                    key={notice.id}
                    onClick={() =>
                      navigate(
                        `/team/${selectedTeam?.teamId}/notice/${notice.id}`
                      )
                    }
                  >
                    <RecentContent>
                      <RecentTitle>{notice.title}</RecentTitle>
                      <RecentDate>
                        {new Date(notice.createAt).toLocaleDateString()}
                      </RecentDate>
                    </RecentContent>
                  </RecentItem>
                ))
              ) : (
                <EmptyItem>등록된 공지사항이 없습니다.</EmptyItem>
              )}
            </RecentList>
          </>
        ) : (
          <LoadingState>팀 정보를 찾을 수 없습니다.</LoadingState>
        )}
      </DashboardContainer>
    </>
  );
};

export default TeamInfoPage;

// --- Styled Components ---

const DashboardContainer = styled.div`
  padding: 20px 16px;
  background-color: #f8fafb;
  min-height: calc(100vh - 56px);
`;

const WelcomeSection = styled.div`
  margin-bottom: 24px;
`;

const TeamTitle = styled.h2`
  font-size: 22px;
  font-family: "Pretendard-Bold";
  color: #333;
  margin-bottom: 4px;
`;

const SubText = styled.p`
  font-size: 14px;
  color: #888;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  padding: 16px 12px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: transform 0.2s;

  &:active {
    transform: scale(0.96);
  }
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;

  &.purple {
    background: #f3e8ff;
    color: #9333ea;
  }
  &.orange {
    background: #ffedd5;
    color: #ea580c;
  }
  &.blue {
    background: #dbeafe;
    color: #2563eb;
  }
`;

const StatValue = styled.div`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  color: #333;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #888;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 17px;
  font-family: "Pretendard-Bold";
  color: #333;
`;

const MoreButton = styled.button`
  background: none;
  border: none;
  font-size: 13px;
  color: #888;
  cursor: pointer;
`;

const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); // or 4
  gap: 12px;
  margin-bottom: 32px;
`;

const ActionCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border: 1px solid #f0f0f0;
  cursor: pointer;

  &:hover {
    background-color: #f8fafb;
  }
`;

const ActionIcon = styled.div`
  font-size: 24px;
  color: #555;
`;

const ActionText = styled.span`
  font-size: 13px;
  color: #333;
  font-weight: 500;
`;

const RecentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const RecentItem = styled.div`
  background: white;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #eee;
  cursor: pointer;

  &:hover {
    border-color: var(--color-main);
  }
`;

const RecentContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RecentTitle = styled.span`
  font-size: 15px;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 70%;
`;

const RecentDate = styled.span`
  font-size: 12px;
  color: #999;
`;

const EmptyItem = styled.div`
  text-align: center;
  padding: 20px;
  color: #999;
  font-size: 14px;
  background: white;
  border-radius: 12px;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  color: #999;
`;
