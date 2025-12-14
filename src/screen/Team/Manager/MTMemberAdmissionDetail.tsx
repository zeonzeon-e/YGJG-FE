import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { HiUserCircle, HiCheck, HiXMark } from "react-icons/hi2";
import Header2 from "../../../components/Header/Header2/Header2";
import apiClient from "../../../api/apiClient";
import { getAccessToken } from "../../../utils/authUtils";

interface JoinRequest {
  id: number;
  name: string;
  gender: string;
  age: number;
  address: string;
  hasExperience: boolean;
  level: string;
  position: string;
  joinReason: string;
  prefileUrl?: string;
  memberId: number;
}

const DEV_MOCK_DETAIL: JoinRequest = {
  id: 101,
  name: "이강인",
  gender: "남성",
  age: 23,
  address: "서울시 마포구",
  hasExperience: true,
  level: "중급 (아마추어 3년)",
  position: "MF",
  joinReason:
    "팀의 열정적인 분위기가 너무 좋아 보여서 지원하게 되었습니다! 매주 주말 참석 가능하며, 미드필더 포지션에서 팀의 승리에 기여하고 싶습니다. 잘 부탁드립니다!",
  prefileUrl: "",
  memberId: 99,
};

const MTMemberAdmissionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { teamId, requestId } = useParams<{
    teamId: string;
    requestId: string;
  }>();

  const [request, setRequest] = useState<JoinRequest | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      setLoading(true);
      const token = getAccessToken();

      if (token?.startsWith("dev-")) {
        await new Promise((r) => setTimeout(r, 600));
        setRequest(DEV_MOCK_DETAIL);
        setLoading(false);
        return;
      }

      try {
        const res = await apiClient.get<JoinRequest>(
          `/api/admin/joinTeam/requestDetail/${requestId}`,
          { headers: { "X-AUTH-TOKEN": token } }
        );
        setRequest(res.data);
      } catch (err) {
        console.error("신청서 로드 실패", err);
        alert("정보를 불러오지 못했습니다.");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [requestId, navigate]);

  const handleAction = async (action: "APPROVE" | "REJECT") => {
    if (!request) return;

    const isApprove = action === "APPROVE";
    const confirmMsg = isApprove
      ? `'${request.name}' 님의 가입을 승인하시겠습니까?`
      : `'${request.name}' 님의 가입을 거절하시겠습니까?`;

    if (!window.confirm(confirmMsg)) return;

    try {
      const endpoint = isApprove ? "accept" : "deny";
      const token = getAccessToken();

      if (token?.startsWith("dev-")) {
        alert(
          `[개발모드] ${isApprove ? "승인" : "거절"} 처리가 완료되었습니다.`
        );
        navigate(-1);
        return;
      }

      await apiClient.post(
        `/api/admin/joinTeam/${teamId}/${endpoint}/${request.memberId}`,
        { memberId: request.memberId, teamId: Number(teamId) },
        { headers: { "X-AUTH-TOKEN": token } }
      );

      alert(`${isApprove ? "승인" : "거절"} 처리가 완료되었습니다.`);
      navigate(-1);
    } catch (err) {
      console.error(`${isApprove ? "승인" : "거절"} 실패`, err);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  if (loading)
    return (
      <PageWrapper>
        <Header2 text="신청서 검토" />
        <LoadingState>불러오고 있습니다...</LoadingState>
      </PageWrapper>
    );

  if (!request) return null;

  return (
    <PageWrapper>
      <Header2 text="신청서 검토" />

      <ContentContainer>
        {/* Profile Card */}
        <ProfileCard>
          <AvatarWrapper>
            {request.prefileUrl ? (
              <img src={request.prefileUrl} alt={request.name} />
            ) : (
              <HiUserCircle size={80} color="#ddd" />
            )}
          </AvatarWrapper>
          <Name>{request.name}</Name>
          <Summary>
            {request.gender}, {request.age}세
          </Summary>
          <BadgeRow>
            <Badge>{request.position}</Badge>
            <Badge>{request.level}</Badge>
          </BadgeRow>
        </ProfileCard>

        {/* Detailed Info */}
        <SectionTitle>상세 정보</SectionTitle>
        <InfoList>
          <InfoItem>
            <Label>거주 지역</Label>
            <Value>{request.address}</Value>
          </InfoItem>
          <InfoItem>
            <Label>선수 경력</Label>
            <Value>{request.hasExperience ? "있음" : "없음"}</Value>
          </InfoItem>
        </InfoList>

        <SectionTitle>가입 신청 메시지</SectionTitle>
        <ReasonBox>{request.joinReason}</ReasonBox>
      </ContentContainer>

      {/* Fixed Bottom Actions */}
      <BottomBar>
        <ActionButton variant="reject" onClick={() => handleAction("REJECT")}>
          <HiXMark /> 거절
        </ActionButton>
        <ActionButton variant="approve" onClick={() => handleAction("APPROVE")}>
          <HiCheck /> 승인
        </ActionButton>
      </BottomBar>
    </PageWrapper>
  );
};

export default MTMemberAdmissionDetail;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafb;
  display: flex;
  flex-direction: column;
  padding-bottom: 140px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
`;

const ContentContainer = styled.div`
  padding: 24px 20px;
  flex: 1;
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #999;
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  margin-bottom: 32px;
`;

const AvatarWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 16px;
  background: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Name = styled.h2`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  color: #333;
  margin-bottom: 6px;
`;

const Summary = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
`;

const BadgeRow = styled.div`
  display: flex;
  gap: 8px;
`;

const Badge = styled.span`
  background: #f0f4f8;
  color: #555;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 500;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-family: "Pretendard-Bold";
  color: #333;
  margin-bottom: 12px;
`;

const InfoList = styled.div`
  background: white;
  border-radius: 16px;
  padding: 0 20px;
  border: 1px solid #eee;
  margin-bottom: 32px;
`;

const InfoItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  border-bottom: 1px solid #f9f9f9;
  font-size: 15px;

  &:last-child {
    border-bottom: none;
  }
`;

const Label = styled.span`
  color: #888;
`;

const Value = styled.span`
  color: #333;
  font-weight: 500;
`;

const ReasonBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  font-size: 15px;
  line-height: 1.6;
  color: #444;
  border: 1px solid #eee;
  min-height: 100px;
`;

const BottomBar = styled.div`
  position: fixed;
  bottom: 70px;
  left: 0;
  right: 0;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 12px 20px;
  border-top: 1px solid #f5f5f5;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 12px;
  z-index: 100;
`;

const ActionButton = styled.button<{ variant: "approve" | "reject" }>`
  flex: 1;
  height: 52px;
  border-radius: 14px;
  border: none;
  font-size: 16px;
  font-family: "Pretendard-Bold";
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.2s;

  background: ${(props) =>
    props.variant === "approve" ? "var(--color-main)" : "#fff5f5"};
  color: ${(props) => (props.variant === "approve" ? "white" : "#e03131")};
  border: ${(props) =>
    props.variant === "reject" ? "1px solid #ffc9c9" : "none"};

  &:active {
    opacity: 0.8;
  }
`;
