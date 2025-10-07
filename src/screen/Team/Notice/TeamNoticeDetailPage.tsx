import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Header2 from "../../../components/Header/Header2/Header2";
import NoticeCard1 from "../../../components/Notice/NoticeCard1/NoticeCard1";
import apiClient from "../../../api/apiClient";
import MiniButton from "../../../components/Button/MiniButton";
import Modal2 from "../../../components/Modal/Modal2";
import styled from "styled-components";
import { FaPen, FaRegTrashCan } from "react-icons/fa6";
import { useUserStore } from "../../../stores/userStore";

// 공지사항 상세 데이터 타입 정의
interface NoticeDetail {
  announcementId: number;
  content: string;
  createdAt: string;
  imageUrl?: string;
  title: string;
  updatedAt?: string;
  writer: string;
}

// 임시 데이터 (Mock Data)
const MOCK_NOTICE_DETAILS: NoticeDetail[] = [
  {
    announcementId: 1,
    title: "필독! 팀 회비 납부 공지",
    content:
      "안녕하세요. 팀원 여러분, 2024년 2분기 팀 회비 납부 기간입니다. 늦지 않게 납부 부탁드립니다. \n\n자세한 내용은 아래 계좌로 입금 후 총무에게 확인 문자를 보내주세요.",
    createdAt: "2024-05-20T10:00:00Z",
    updatedAt: "2024-05-20T10:00:00Z",
    imageUrl: "https://i.ibb.co/6y4t6y3/temp-image.png",
    writer: "김주장",
  },
  {
    announcementId: 2,
    title: "새 유니폼 디자인 투표",
    content:
      "다가오는 새 시즌을 맞아 새로운 유니폼 디자인을 선정하고자 합니다. A, B, C 세 가지 디자인 중 마음에 드는 디자인에 투표해주세요! 투표 링크는 팀 채팅방을 참고하세요.",
    createdAt: "2024-05-18T15:30:00Z",
    updatedAt: "2024-05-19T10:00:00Z",
    imageUrl: "",
    writer: "박총무",
  },
  {
    announcementId: 3,
    title: "팀 연습 경기 일정 공지",
    content:
      "이번 주 토요일 오후 3시, 00풋살장에서 연습 경기가 있습니다. 많은 참여 부탁드립니다. 참가 가능 여부를 댓글로 남겨주세요.",
    createdAt: "2024-05-15T09:00:00Z",
    updatedAt: "",
    imageUrl: "",
    writer: "이감독",
  },
];

const TeamNoticeDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { teamId, noticeId } = useParams<{
    teamId: string;
    noticeId: string;
  }>();

  const getRoleByTeamId = useUserStore((state) => state.getRoleByTeamId);

  const [noticeDetail, setNoticeDetail] = useState<NoticeDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userRole = teamId ? getRoleByTeamId(Number(teamId)) : undefined;

  // 수정: userRole이 undefined일 가능성을 명시적으로 처리
  const isManager =
    userRole &&
    (userRole.role === "MANAGER" || userRole.role === "SUB_MANAGER");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (!teamId || !noticeId) {
      setError("잘못된 접근입니다. 팀 또는 공지 ID를 찾을 수 없습니다.");
      setIsLoading(false);
      return;
    }

    const fetchedDetail = async () => {
      try {
        setIsLoading(true);
        const foundNotice = MOCK_NOTICE_DETAILS.find(
          (item) => item.announcementId === Number(noticeId)
        );

        if (foundNotice) {
          setNoticeDetail(foundNotice);
          setError(null);
        } else {
          setError("해당 공지사항을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("데이터를 가져오는 중 에러가 발생했습니다.", err);
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchedDetail();
  }, [teamId, noticeId]);

  const handleRewrite = () => {
    navigate(`/team/${teamId}/notice/rewrite/${noticeId}`);
  };

  const handleRemove = () => {
    setIsModalOpen(true);
  };

  const handleConfirmRemove = async () => {
    try {
      alert("공지사항이 성공적으로 삭제되었습니다.");
      setIsModalOpen(false);
      navigate(`/team/${teamId}/notice`);
    } catch (error) {
      console.error("공지사항 삭제 중 오류 발생:", error);
      alert("공지사항 삭제에 실패했습니다.");
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Header2 text="공지사항" line={true} />
      <div>
        {isLoading ? (
          <InfoMessage>공지사항을 불러오는 중입니다...</InfoMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : noticeDetail ? (
          <>
            <div style={{ padding: "20px 20px 100px 20px" }}>
              <NoticeCard1
                title={noticeDetail.title}
                createDate={formatDate(noticeDetail.createdAt)}
                updateDate={
                  noticeDetail.updatedAt
                    ? formatDate(noticeDetail.updatedAt)
                    : ""
                }
                writer={noticeDetail.writer}
                img={noticeDetail.imageUrl || ""}
              >
                <p>{noticeDetail.content}</p>
              </NoticeCard1>
            </div>
            {isManager && (
              <FixedButtonWrapper>
                <MiniButton onClick={handleRemove}>
                  <FaRegTrashCan /> 삭제하기
                </MiniButton>
                <MiniButton onClick={handleRewrite}>
                  <FaPen /> 수정하기
                </MiniButton>
              </FixedButtonWrapper>
            )}
          </>
        ) : (
          <InfoMessage>해당 공지사항을 찾을 수 없습니다.</InfoMessage>
        )}
      </div>
      <Modal2
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="공지사항을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmRemove}
      >
        <p>삭제 시 복구할 수 없습니다.</p>
        <p>그래도 삭제하시겠습니까?</p>
      </Modal2>
    </>
  );
};

export default TeamNoticeDetailPage;

// --- Styled Components ---

const InfoMessage = styled.p`
  text-align: center;
  margin-top: 20px;
  color: var(--color-dark1);
`;

const ErrorMessage = styled(InfoMessage)`
  color: var(--color-error);
`;

const FixedButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
  position: fixed;
  bottom: 20px;
  z-index: 1000;
`;
