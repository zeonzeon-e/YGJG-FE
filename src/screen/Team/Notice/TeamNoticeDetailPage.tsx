import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header2 from "../../../components/Header/Header2/Header2";
import NoticeCard1 from "../../../components/Notice/NoticeCard1/NoticeCard1";
import BottomNavBar from "../../../components/Nevigation/BottomNavBar";
import apiClient from "../../../api/apiClient";

const TeamNoticeDetailPage: React.FC = () => {
  const location = useLocation();
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
          <div style={{ padding: "20px" }}>
            <NoticeCard1
              title={noticeDetail.title}
              createDate={formatDate(noticeDetail.createdAt)}
              updateDate={
                noticeDetail.updatedAt ? formatDate(noticeDetail.updatedAt) : ""
              }
              writer={noticeDetail.writer}
              img={noticeDetail.imageUrl}
            >
              <p>{noticeDetail.content}</p>
            </NoticeCard1>
          </div>
        ) : (
          <p>해당 공지사항을 찾을 수 없습니다.</p>
        )}
      </div>
      <BottomNavBar />
    </div>
  );
};

export default TeamNoticeDetailPage;
