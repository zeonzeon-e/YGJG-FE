import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Header2 from "../../../components/Header/Header2/Header2";
import apiClient from "../../../api/apiClient";
import { FaPen, FaTrash } from "react-icons/fa";
import { HiChevronLeft, HiCalendarDays, HiUserCircle } from "react-icons/hi2";
import Modal2 from "../../../components/Modal/Modal2";
import { useUserStore } from "../../../stores/userStore";
import { getAccessToken } from "../../../utils/authUtils";

// --- Types ---
interface NoticeDetail {
  announcementId: number;
  content: string;
  createdAt: string;
  imageUrl?: string;
  title: string;
  updatedAt?: string;
  writer: string;
}

// --- Dev Mock Data ---
const DEV_MOCK_NOTICE_DETAIL: NoticeDetail = {
  announcementId: 1,
  title: "📢 [필독] 5월 팀 정기 회비 납부 안내",
  content: `안녕하세요. 팀원 여러분, 
2024년 2분기 팀 회비 납부 기간입니다. 

이번 분기는 풋살장 예약비 인상으로 인해 불가피하게 회비가 소폭 인상되었습니다. 
팀 운영을 위해 늦지 않게 납부 부탁드립니다.

📅 납부 기한: 2024년 5월 31일까지
💰 납부 금액: 30,000원
🏦 입금 계좌: 카카오뱅크 3333-00-0000000 (예금주: 박총무)

입금 후에는 반드시 단톡방에 "입금 완료"라고 남겨주세요!
문의사항은 총무에게 개인 톡 부탁드립니다.`,
  createdAt: "2024-05-20T10:00:00",
  updatedAt: "2024-05-20T10:00:00",
  writer: "박총무",
  imageUrl:
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
};

const TeamNoticeDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { teamId, noticeId } = useParams<{
    teamId: string;
    noticeId: string;
  }>();
  const numericTeamId = Number(teamId);

  const getRoleByTeamId = useUserStore((state) => state.getRoleByTeamId);
  const [noticeDetail, setNoticeDetail] = useState<NoticeDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 권한 체크
  const userRole = teamId ? getRoleByTeamId(Number(teamId)) : undefined;
  const isManager =
    userRole && ["MANAGER", "SUB_MANAGER"].includes(userRole.role);
  // 개발 모드에서는 항상 관리자 권한 부여 (테스트용)
  const isDevMode = getAccessToken()?.startsWith("dev-");
  const canEdit = isManager || isDevMode;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일 ${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    const fetchDetail = async () => {
      if (!teamId || !noticeId) return;
      setIsLoading(true);

      try {
        // 🔧 개발 모드 체크
        const token = getAccessToken();
        if (token?.startsWith("dev-")) {
          console.warn("[DEV MODE] Using mock data for Notice Detail");
          await new Promise((resolve) => setTimeout(resolve, 500));
          setNoticeDetail(DEV_MOCK_NOTICE_DETAIL);
          return;
        }

        const response = await apiClient.get<NoticeDetail>(
          `/api/announcement/member/detail`,
          {
            params: {
              teamId: numericTeamId,
              announcementId: noticeId,
            },
          }
        );
        setNoticeDetail(response.data);
      } catch (err) {
        console.error("Failed to fetch notice detail:", err);
        setError("공지사항을 불러오지 못했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [teamId, noticeId, numericTeamId]);

  const handleRemove = () => setIsModalOpen(true);

  const handleConfirmRemove = async () => {
    try {
      // 🔧 개발 모드 삭제 시뮬레이션
      if (isDevMode) {
        alert("[개발 모드] 공지사항이 삭제되었습니다.");
        navigate(`/team/${teamId}/notice`);
        return;
      }

      await apiClient.get(`/api/announcement/manager/delete`, {
        params: {
          announcementId: noticeId,
          teamId: numericTeamId,
        },
      });
      alert("삭제되었습니다.");
      navigate(`/team/${teamId}/notice`);
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <PageWrapper>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <HiChevronLeft size={24} />
        </BackButton>
        <HeaderTitle>공지사항</HeaderTitle>
        <div style={{ width: 24 }} />
      </Header>

      <ContentContainer>
        {isLoading ? (
          <LoadingState>불러오는 중...</LoadingState>
        ) : error ? (
          <ErrorState>{error}</ErrorState>
        ) : noticeDetail ? (
          <>
            <TitleSection>
              <NoticeTitle>{noticeDetail.title}</NoticeTitle>
              <MetaInfo>
                <MetaItem>
                  <HiUserCircle size={16} />
                  <span>{noticeDetail.writer}</span>
                </MetaItem>
                <MetaDivider />
                <MetaItem>
                  <HiCalendarDays size={16} />
                  <span>{formatDate(noticeDetail.createdAt)}</span>
                </MetaItem>
              </MetaInfo>
            </TitleSection>

            <Divider />

            <BodySection>
              {noticeDetail.imageUrl && (
                <ImageWrapper>
                  <NoticeImage src={noticeDetail.imageUrl} alt="공지 이미지" />
                </ImageWrapper>
              )}
              <ContentText>
                {noticeDetail.content.split("\n").map((line, i) => (
                  <span key={i}>
                    {line}
                    <br />
                  </span>
                ))}
              </ContentText>
            </BodySection>
          </>
        ) : null}
      </ContentContainer>

      {/* 관리자(또는 개발모드)일 때만 수정/삭제 버튼 노출 */}
      {canEdit && !isLoading && !error && (
        <BottomActionBar>
          <ActionButton
            onClick={() =>
              navigate(`/team/${teamId}/notice/rewrite/${noticeId}`)
            }
          >
            <FaPen size={14} /> 수정
          </ActionButton>
          <DeleteButton onClick={handleRemove}>
            <FaTrash size={14} /> 삭제
          </DeleteButton>
        </BottomActionBar>
      )}

      <Modal2
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmRemove}
      >
        <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.5" }}>
          이 공지사항을 정말 삭제하시겠습니까?
          <br />
          삭제 후에는 복구할 수 없습니다.
        </p>
      </Modal2>
    </PageWrapper>
  );
};

export default TeamNoticeDetailPage;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background: white;
  padding-bottom: 80px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: white;
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid #f0f0f0;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  color: var(--color-dark2);
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
`;

const ContentContainer = styled.div`
  padding: 24px 20px;
`;

const TitleSection = styled.div`
  margin-bottom: 20px;
`;

const NoticeTitle = styled.h2`
  font-size: 22px;
  font-family: "Pretendard-Bold";
  color: #111;
  line-height: 1.4;
  margin-bottom: 12px;
`;

const MetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #888;
  font-size: 13px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const MetaDivider = styled.div`
  width: 1px;
  height: 12px;
  background: #eee;
`;

const Divider = styled.div`
  height: 1px;
  background: #f0f0f0;
  margin: 0 -20px 24px -20px;
`;

const BodySection = styled.div`
  font-size: 16px;
  color: #333;
  line-height: 1.7;
`;

const ImageWrapper = styled.div`
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
`;

const NoticeImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const ContentText = styled.p`
  white-space: pre-wrap;
  word-break: break-all;
`;

const BottomActionBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  border-top: 1px solid #f0f0f0;
  padding: 12px 20px;
  display: flex;
  gap: 10px;
  padding-bottom: max(12px, env(safe-area-inset-bottom));
`;

const ActionButton = styled.button`
  flex: 1;
  height: 48px;
  border-radius: 12px;
  border: 1px solid #eee;
  background: white;
  color: var(--color-dark2);
  font-size: 15px;
  font-family: "Pretendard-SemiBold";
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f8f9fa;
  }
`;

const DeleteButton = styled(ActionButton)`
  flex: 0.5;
  color: var(--color-error);
  border-color: rgba(229, 62, 62, 0.2);

  &:hover {
    background: #fff5f5;
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 0;
  color: #999;
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 60px 0;
  color: var(--color-error);
`;
