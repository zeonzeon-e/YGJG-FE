import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { HiCheck, HiChevronRight, HiUserGroup } from "react-icons/hi2";

import Header2 from "../../../components/Header/Header2/Header2";
import apiClient from "../../../api/apiClient";
import { getAccessToken } from "../../../utils/authUtils";

interface Player {
  joinTeamId: number;
  name: string;
  position: string;
  profileUrl?: string;
  // Additional fields optional for list view
}

const DEV_MOCK_REQUESTS: Player[] = [
  { joinTeamId: 101, name: "이강인", position: "MF", profileUrl: "" },
  { joinTeamId: 102, name: "김민재", position: "DF", profileUrl: "" },
  { joinTeamId: 103, name: "황희찬", position: "FW", profileUrl: "" },
];

const TeamMemberListPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const token = getAccessToken();

      if (!teamId) return;

      if (token?.startsWith("dev-")) {
        await new Promise((r) => setTimeout(r, 600));
        setRequests(DEV_MOCK_REQUESTS);
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<Player[]>(
          `/api/admin/joinTeam/getPendingRequests/${teamId}`,
          {
            headers: { "X-AUTH-TOKEN": token },
          }
        );
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [teamId]);

  return (
    <PageWrapper>
      <Header2 text="가입 신청 관리" />

      <ContentContainer>
        <HeaderSection>
          <Title>
            대기 중인 요청 <Count>{requests.length}</Count>
          </Title>
          <SubTitle>팀 가입을 희망하는 멤버들의 신청을 검토하세요.</SubTitle>
        </HeaderSection>

        {loading ? (
          <EmptyState>데이터를 불러오는 중...</EmptyState>
        ) : requests.length > 0 ? (
          <ListGrid>
            {requests.map((player) => (
              <RequestCard
                key={player.joinTeamId}
                onClick={() => navigate(`${player.joinTeamId}`)}
              >
                <CardContent>
                  <Avatar
                    src={player.profileUrl || "https://via.placeholder.com/50"}
                  />
                  <Info>
                    <Name>{player.name}</Name>
                    <PositionBadge>{player.position}</PositionBadge>
                  </Info>
                </CardContent>
                <ActionArea>
                  <ReviewText>검토하기</ReviewText>
                  <HiChevronRight color="#ccc" />
                </ActionArea>
              </RequestCard>
            ))}
          </ListGrid>
        ) : (
          <EmptyState>
            <EmptyIcon>
              <HiUserGroup />
            </EmptyIcon>
            <p>대기 중인 가입 신청이 없습니다.</p>
          </EmptyState>
        )}
      </ContentContainer>
    </PageWrapper>
  );
};

export default TeamMemberListPage;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafb;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
`;

const ContentContainer = styled.div`
  padding: 24px 20px;
  flex: 1;
`;

const HeaderSection = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`;

const Count = styled.span`
  background: var(--color-sub); // Assuming purple/main sub color
  color: var(--color-main);
  font-size: 14px;
  padding: 2px 8px;
  border-radius: 12px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: #888;
`;

const ListGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RequestCard = styled.div`
  background: white;
  padding: 16px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: transform 0.2s, border-color 0.2s;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--color-main);
  }
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  background: #eee;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Name = styled.div`
  font-size: 16px;
  font-family: "Pretendard-Bold";
  color: #333;
`;

const PositionBadge = styled.div`
  font-size: 12px;
  color: #666;
  background: #f5f5f5;
  padding: 2px 8px;
  border-radius: 6px;
  align-self: flex-start;
`;

const ActionArea = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ReviewText = styled.span`
  font-size: 13px;
  color: var(--color-main);
  font-weight: 600;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  color: #aaa;
  gap: 12px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  color: #ddd;
`;
