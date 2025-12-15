import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header2 from "../../../components/Header/Header2/Header2";
import apiClient from "../../../api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiPencil,
  HiMagnifyingGlass,
  HiMegaphone,
  HiChevronRight,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import { getAccessToken } from "../../../utils/authUtils";
import { useUserStore } from "../../../stores/userStore";

// --- Types ---
interface Notice {
  id: number;
  title: string;
  createAt: string;
  isUrgent?: boolean;
  writer?: string;
}

// --- Dev Mock Data ---
const DEV_MOCK_NOTICES: Notice[] = [
  {
    id: 1,
    title: "📢 [필독] 5월 팀 정기 회비 납부 안내",
    createAt: "2024-05-20T10:00:00",
    isUrgent: true,
    writer: "박지성(매니저)",
  },
  {
    id: 2,
    title: "새 유니폼 디자인 투표 결과 발표",
    createAt: "2024-05-18T15:30:00",
    isUrgent: false,
    writer: "이강인(부매니저)",
  },
  {
    id: 3,
    title: "이번 주 주말 연습 경기 일정 변경",
    createAt: "2024-05-15T09:00:00",
    isUrgent: true,
    writer: "박지성",
  },
  {
    id: 4,
    title: "신입 회원 환영회 일정",
    createAt: "2024-05-10T11:20:00",
    isUrgent: false,
    writer: "김민재",
  },
];

const TeamNoticePage: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const numericTeamId = Number(teamId);

  const getRoleByTeamId = useUserStore((state) => state.getRoleByTeamId);

  const [noticeList, setNoticeList] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const userRole = teamId ? getRoleByTeamId(Number(teamId)) : undefined;
  const isManager =
    userRole && ["MANAGER", "SUB_MANAGER"].includes(userRole.role);
  const canWrite = isManager;

  useEffect(() => {
    const fetchNoticeList = async () => {
      if (!teamId) return;
      setIsLoading(true);

      try {
        const token = getAccessToken();
        if (token?.startsWith("dev-")) {
          console.warn("[DEV MODE] Using mock data for Notices");
          await new Promise((resolve) => setTimeout(resolve, 500));
          setNoticeList(DEV_MOCK_NOTICES);
          return;
        }

        const response = await apiClient.get<Notice[]>(
          `/api/announcement/member/get-all`,
          {
            params: { teamId: numericTeamId },
          }
        );
        setNoticeList(response.data);
      } catch (err) {
        console.error("Failed to fetch notices:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoticeList();
  }, [teamId, numericTeamId]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredNotices(noticeList);
      return;
    }
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = noticeList.filter((notice) =>
      notice.title.toLowerCase().includes(lowerQuery)
    );
    setFilteredNotices(filtered);
  }, [searchQuery, noticeList]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${month}월 ${day}일`;
  };

  return (
    <PageWrapper>
      <Header2 text="게시판" />

      <ContentContainer>
        <PageHeader>
          <PageTitleArea>
            <Title>공지사항</Title>
            <SubTitle>팀의 중요한 소식을 확인하세요</SubTitle>
          </PageTitleArea>

          <SearchWrapper>
            <HiMagnifyingGlass color="#999" size={20} />
            <SearchInput
              placeholder="검색어 입력"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </SearchWrapper>
        </PageHeader>

        <NoticeList>
          {isLoading ? (
            <LoadingState>공지사항을 불러오고 있습니다...</LoadingState>
          ) : filteredNotices.length > 0 ? (
            filteredNotices.map((notice) => (
              <NoticeCard
                key={notice.id}
                onClick={() => navigate(`/team/${teamId}/notice/${notice.id}`)}
                isUrgent={!!notice.isUrgent}
              >
                <IconWrapper isUrgent={!!notice.isUrgent}>
                  {notice.isUrgent ? (
                    <HiMegaphone />
                  ) : (
                    <HiOutlineDocumentText />
                  )}
                </IconWrapper>
                <TextContent>
                  <NoticeTitleWrapper>
                    {notice.isUrgent && <Badge>필독</Badge>}
                    <NoticeTitle>{notice.title}</NoticeTitle>
                  </NoticeTitleWrapper>
                  <NoticeMeta>
                    <DateText>{formatDate(notice.createAt)}</DateText>
                    {notice.writer && (
                      <WriterText>· {notice.writer}</WriterText>
                    )}
                  </NoticeMeta>
                </TextContent>
                <ChevronWrapper>
                  <HiChevronRight />
                </ChevronWrapper>
              </NoticeCard>
            ))
          ) : (
            <EmptyState>
              <EmptyIcon>📭</EmptyIcon>
              <p>등록된 공지사항이 없습니다.</p>
              {canWrite && (
                <CreateButtonSmall
                  onClick={() => navigate(`/team/${teamId}/notice/create`)}
                >
                  첫 글 작성하기
                </CreateButtonSmall>
              )}
            </EmptyState>
          )}
        </NoticeList>
      </ContentContainer>

      {canWrite && (
        <FloatingActionButton
          onClick={() => navigate(`/team/${teamId}/notice/create`)}
        >
          <HiPencil size={24} />
        </FloatingActionButton>
      )}
    </PageWrapper>
  );
};

export default TeamNoticePage;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafb;
  padding-bottom: 80px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
`;

const ContentContainer = styled.div`
  padding: 20px;
`;

const PageHeader = styled.div`
  margin-bottom: 24px;
`;

const PageTitleArea = styled.div`
  margin-bottom: 16px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  margin-bottom: 4px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: #888;
`;

const SearchWrapper = styled.div`
  background: white;
  border-radius: 14px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #eee;
  transition: all 0.2s;

  &:focus-within {
    border-color: var(--color-main);
    box-shadow: 0 0 0 3px rgba(14, 98, 68, 0.1);
  }
`;

const SearchInput = styled.input`
  border: none;
  width: 100%;
  font-size: 15px;
  outline: none;

  &::placeholder {
    color: #bbb;
  }
`;

const NoticeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const NoticeCard = styled.div<{ isUrgent: boolean }>`
  background: white;
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  border: 1px solid
    ${(props) => (props.isUrgent ? "rgba(229, 62, 62, 0.2)" : "transparent")};
  background-color: ${(props) => (props.isUrgent ? "#fffbfc" : "white")};
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.div<{ isUrgent: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background-color: ${(props) => (props.isUrgent ? "#ffe5e5" : "#f0f7ff")};
  color: ${(props) =>
    props.isUrgent ? "var(--color-error)" : "var(--color-main)"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
`;

const TextContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const NoticeTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
`;

const Badge = styled.span`
  background-color: var(--color-error);
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  flex-shrink: 0;
`;

const NoticeTitle = styled.div`
  font-size: 16px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const NoticeMeta = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #999;
`;

const DateText = styled.span``;

const WriterText = styled.span`
  margin-left: 4px;
`;

const ChevronWrapper = styled.div`
  color: #ccc;
  font-size: 20px;
`;

const FloatingActionButton = styled.button`
  position: fixed;
  bottom: 90px;
  /* Centering Logic for Desktop Webview */
  left: 50%;
  transform: translateX(
    220px
  ); /* 600px width / 2 = 300px center. Button(56px) + Margin(25px) approx 80px from edge. 300 - 80 = 220px */
  margin-left: 0;

  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--color-main);
  color: white;
  border: none;
  box-shadow: 0 4px 15px rgba(14, 98, 68, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s;
  z-index: 100;

  @media (max-width: 620px) {
    left: auto;
    right: 25px;
    transform: none;
  }

  &:hover {
    transform: translateX(220px) scale(1.05); /* Maintain translation on hover */
    background: var(--color-main-darker);
  }

  @media (max-width: 620px) {
    &:hover {
      transform: scale(1.05); /* Reset translation on mobile hover */
    }
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  gap: 16px;

  p {
    color: #bbb;
    font-size: 15px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 40px;
`;

const CreateButtonSmall = styled.button`
  padding: 8px 16px;
  background-color: var(--color-main);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  font-family: "Pretendard-SemiBold";
`;
