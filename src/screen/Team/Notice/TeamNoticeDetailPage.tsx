import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header2 from "../../../components/Header/Header2/Header2";
import NoticeCard1 from "../../../components/Notice/NoticeCard1/NoticeCard1";
import BottomNavBar from "../../../components/Nevigation/BottomNavBar";
import apiClient from "../../../api/apiClient";
import MiniButton from "../../../components/Button/MiniButton";
import Modal2 from "../../../components/Modal/Modal2";
import styled from "styled-components";
import { FaPen, FaRegTrashCan } from "react-icons/fa6";

const TeamNoticeDetailPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id, teamId } = location.state || {
    id: 1,
    teamId: 1,
  };

  const [noticeDetail, setNoticeDetail] = useState<{
    title: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    writer: string;
    imageUrl?: string;
  } | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 관리

  const handleRewrite = () => {
    navigate(`/team/notice/rewrite/${id}`, {
      state: {
        id: id,
        teamId: teamId,
      },
    });
  };

  const handleRemove = () => {
    setIsModalOpen(true); // 모달 열기
  };

  const handleConfirmRemove = async () => {
    try {
      const response = await apiClient.get(`api/announcement/manager/delete`, {
        params: {
          announcementId: Number(id),
          teamId: Number(teamId),
        },
      });

      if (response.status === 200) {
        alert("공지사항이 성공적으로 삭제되었습니다.");
        navigate("/team/notice"); // 공지사항 목록으로 이동
      }
    } catch (err) {
      console.error("공지사항 삭제 중 에러가 발생했습니다.", err);
      alert("공지사항 삭제에 실패했습니다.");
    } finally {
      setIsModalOpen(false); // 모달 닫기
    }
  };

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formatter = new Intl.DateTimeFormat("ko-KR", options);
    return (
      formatter
        .format(date)
        .replace(/년 /g, "년 ")
        .replace(/월 /g, "월 ")
        .replace(/일 /, "일 ")
        .replace(/:/, "시 ") + "분"
    );
  };

  useEffect(() => {
    if (id !== "" && teamId !== "") {
      const fetchedDetail = async () => {
        try {
          const response = await apiClient.get(
            `api/announcement/manager/detail`,
            {
              params: {
                announcementId: Number(id),
                teamId: Number(teamId),
              },
            }
          );
          setNoticeDetail(response.data);
          return response.data;
        } catch (err) {
          console.error("데이터를 가져오는 중 에러가 발생했습니다.", err);
        }
      };
      fetchedDetail();
    }
  }, [id, teamId]);

  return (
    <div>
      <Header2 text="" line={true} />
      <div>
        {noticeDetail ? (
          <div style={{ padding: "0px 20px", marginBottom: "100px" }}>
            <ButtonWrapper>
              <MiniButton onClick={() => handleRemove()}>
                <FaRegTrashCan /> 삭제하기
              </MiniButton>
              <MiniButton onClick={() => handleRewrite()}>
                <FaPen /> 수정하기
              </MiniButton>
            </ButtonWrapper>
            <NoticeCard1
              title={noticeDetail.title}
              createDate={formatDate(noticeDetail.createdAt)}
              updateDate={
                noticeDetail.updatedAt ? formatDate(noticeDetail.updatedAt) : ""
              }
              writer={noticeDetail.writer}
              img={noticeDetail.imageUrl || ""}
            >
              <p>{noticeDetail.content}</p>
            </NoticeCard1>
          </div>
        ) : (
          <p>해당 공지사항을 찾을 수 없습니다.</p>
        )}
      </div>
      <BottomNavBar />

      {/* 모달 컴포넌트 */}
      <Modal2
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // 모달 닫기
        title="공지사항을 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmRemove} // 확인 버튼 클릭 시 삭제 수행
      >
        <p>삭제 시 복구할 수 없습니다.</p>
        <p>그래도 삭제하시겠습니까?</p>
      </Modal2>
    </div>
  );
};

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row-reverse;
  margin: 10px 0px;
  gap: 5px;
`;

export default TeamNoticeDetailPage;
