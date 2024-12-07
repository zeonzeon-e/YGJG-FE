import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header2 from "../../components/Header/Header2/Header2";
import NoticeCard1 from "../../components/Notice/NoticeCard1/NoticeCard1";
import BottomNavBar from "../../components/Nevigation/BottomNavBar";

const TeamNoticeDetailPage: React.FC = () => {
  const location = useLocation();
  const { id } = location.state || {
    id: 1,
  };

  // 더미 데이터
  const dummyData = [
    {
      announcementId: 1,
      title: "필독 공지사항",
      content: "팀원 전체가 꼭 확인해야 할 중요한 공지사항입니다. 회의 일정과 준비물에 대해 자세히 적혀 있습니다.",
      createdAt: "2024-06-13T12:00:00.000Z",
      writer: "관리자 최씨",
      imageUrl: "https://via.placeholder.com/800x400.png?text=필독+공지사항",
    },
    {
      announcementId: 2,
      title: "포지션 안내",
      content: "새로운 포지션 배정에 대한 공지사항입니다. 각 팀원별 역할과 책임에 대해 상세히 설명하고 있습니다.",
      createdAt: "2024-06-13T15:00:00.000Z",
      updatedAt: "2024-06-13T16:00:00.000Z",
      writer: "관리자 민석",
      imageUrl: "https://via.placeholder.com/800x400.png?text=포지션+안내",
    },
    {
      announcementId: 3,
      title: "2024년 하반기 회비 안내",
      content: "2024년 하반기 팀 회비 납부 일정과 금액에 대한 공지입니다. 납부 기한과 계좌 정보를 확인하세요.",
      createdAt: "2024-06-13T18:00:00.000Z",
      updatedAt: "2024-06-14T10:00:00.000Z",
      writer: "관리자 민석",
      imageUrl: "https://via.placeholder.com/800x400.png?text=회비+안내",
    },
  ];

  const [noticeDetail, setNoticeDetail] = useState<{
    title: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
    writer: string;
    imageUrl?: string;
  } | null>(null);

  useEffect(() => {
    // URL의 id와 dummyData의 announcementId를 비교하여 데이터 로드
    const fetchedDetail = dummyData.find(
      (notice) => notice.announcementId === Number(id)
    );

    if (fetchedDetail) {
      setNoticeDetail({
        title: fetchedDetail.title,
        content: fetchedDetail.content,
        createdAt: new Date(fetchedDetail.createdAt).toLocaleString("ko-KR"),
        updatedAt: fetchedDetail.updatedAt
          ? new Date(fetchedDetail.updatedAt).toLocaleString("ko-KR")
          : undefined, // updatedAt이 없는 경우 undefined로 설정
        writer: fetchedDetail.writer,
        imageUrl: fetchedDetail.imageUrl,
      });
    } else {
      setNoticeDetail(null); // 데이터가 없을 경우 null로 설정
    }
  }, [id]);

  return (
    <div>
      <Header2 text="" line={true} />
      <div style={{ padding: "20px" }}>
        {noticeDetail ? (
          <div>
            <NoticeCard1
              title={noticeDetail.title}
              createDate={noticeDetail.createdAt}
              updateDate={noticeDetail.updatedAt || ""}
            >
              <p>{noticeDetail.content}</p>
              <p>
                <strong>작성자:</strong> {noticeDetail.writer}
              </p>
              {noticeDetail.updatedAt && (
                <p>
                  <strong>업데이트일:</strong> {noticeDetail.updatedAt}
                </p>
              )}
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
