import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiUserGroup,
} from "react-icons/hi2";

import GlobalStyles from "../../components/Styled/GlobalStyled";
import Header2 from "../../components/Header/Header2/Header2";
import apiClient from "../../api/apiClient";
import { getAccessToken } from "../../utils/authUtils";

interface ApprovalItemType {
  position: string;
  status: "PENDING" | "ACCEPT" | "REJECT";
  teamImageUrl: string;
  teamName: string;
}

const DEV_MOCK_REQUESTS: ApprovalItemType[] = [
  {
    teamName: "FC 개발자들",
    position: "MF",
    status: "PENDING",
    teamImageUrl: "",
  },
  {
    teamName: "디자이너 유나이티드",
    position: "FW",
    status: "ACCEPT",
    teamImageUrl: "",
  },
  {
    teamName: "기획자 FC",
    position: "GK",
    status: "REJECT",
    teamImageUrl: "",
  },
];

const JoinApprovalStatus: React.FC = () => {
  const [approvalList, setApprovalList] = useState<ApprovalItemType[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const pendingCount = approvalList.filter(
    (i) => i.status === "PENDING"
  ).length;
  const acceptCount = approvalList.filter((i) => i.status === "ACCEPT").length;
  const rejectCount = approvalList.filter((i) => i.status === "REJECT").length;

  useEffect(() => {
    const fetchApprovalList = async () => {
      setLoading(true);
      const token = getAccessToken();

      if (token?.startsWith("dev-")) {
        await new Promise((r) => setTimeout(r, 600));
        setApprovalList(DEV_MOCK_REQUESTS);
        setLoading(false);
        return;
      }

      try {
        const response = await apiClient.get<ApprovalItemType[]>(
          "/api/myPage/requests"
        );
        setApprovalList(response.data);
      } catch (error) {
        console.error("Error fetching approval list", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovalList();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Badge className="pending">심사 대기</Badge>;
      case "ACCEPT":
        return <Badge className="accept">승인됨</Badge>;
      case "REJECT":
        return <Badge className="reject">거절됨</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <PageWrapper>
      <GlobalStyles />
      <Header2 text="가입 승인 현황" />

      <ContentContainer>
        <SectionHeader>
          <Title>신청 현황 대시보드</Title>
          <SubTitle>최근 2주간의 팀 가입 요청 내역입니다.</SubTitle>
        </SectionHeader>

        {/* Stats Grid */}
        <StatsGrid>
          <StatCard className="accept">
            <StatIcon className="accept">
              <HiCheckCircle />
            </StatIcon>
            <StatLabel>승인 완료</StatLabel>
            <StatValue>{acceptCount}</StatValue>
          </StatCard>

          <StatCard className="pending">
            <StatIcon className="pending">
              <HiClock />
            </StatIcon>
            <StatLabel>심사 대기</StatLabel>
            <StatValue>{pendingCount}</StatValue>
          </StatCard>

          <StatCard className="reject">
            <StatIcon className="reject">
              <HiXCircle />
            </StatIcon>
            <StatLabel>거절됨</StatLabel>
            <StatValue>{rejectCount}</StatValue>
          </StatCard>
        </StatsGrid>

        <ListSection>
          <ListTitle>신청 내역 ({approvalList.length})</ListTitle>

          {loading ? (
            <EmptyState>불러오는 중...</EmptyState>
          ) : approvalList.length > 0 ? (
            <RequestList>
              {approvalList.map((item, index) => (
                <RequestCard key={index}>
                  <TeamIcon>
                    {item.teamImageUrl ? (
                      <img src={item.teamImageUrl} alt="" />
                    ) : (
                      <HiUserGroup />
                    )}
                  </TeamIcon>
                  <CardInfo>
                    <TeamName>{item.teamName}</TeamName>
                    <PositionRow>
                      지원 포지션: <span>{item.position}</span>
                    </PositionRow>
                  </CardInfo>
                  <StatusWrapper>{getStatusBadge(item.status)}</StatusWrapper>
                </RequestCard>
              ))}
            </RequestList>
          ) : (
            <EmptyState>가입 신청 내역이 없습니다.</EmptyState>
          )}
        </ListSection>
      </ContentContainer>
    </PageWrapper>
  );
};

export default JoinApprovalStatus;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafb;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  padding-bottom: 50px;
`;

const ContentContainer = styled.div`
  padding: 24px 20px;
  flex: 1;
`;

const SectionHeader = styled.div`
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  color: #333;
  margin-bottom: 6px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: #888;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-bottom: 32px;
`;

const StatCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid transparent;

  &.accept {
    border-color: #dcfce7;
    background: #f0fdf4;
  }
  &.pending {
    border-color: #fff7ed;
    background: #fffaf0;
  }
  &.reject {
    border-color: #fee2e2;
    background: #fef2f2;
  }
`;

const StatIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;

  &.accept {
    color: #16a34a;
  }
  &.pending {
    color: #ea580c;
  }
  &.reject {
    color: #dc2626;
  }
`;

const StatLabel = styled.span`
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
`;

const StatValue = styled.span`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  color: #333;
`;

const ListSection = styled.div``;

const ListTitle = styled.h3`
  font-size: 16px;
  font-family: "Pretendard-Bold";
  color: #333;
  margin-bottom: 12px;
`;

const RequestList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RequestCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #f0f0f0;
`;

const TeamIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #ccc;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const CardInfo = styled.div`
  flex: 1;
`;

const TeamName = styled.div`
  font-size: 16px;
  font-family: "Pretendard-SemiBold";
  color: #333;
  margin-bottom: 4px;
`;

const PositionRow = styled.div`
  font-size: 13px;
  color: #888;

  span {
    color: #555;
    font-weight: 500;
  }
`;

const StatusWrapper = styled.div``;

const Badge = styled.span`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;

  &.accept {
    background: #dcfce7;
    color: #15803d;
  }
  &.pending {
    background: #ffedd5;
    color: #c2410c;
  }
  &.reject {
    background: #fee2e2;
    color: #b91c1c;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
`;
