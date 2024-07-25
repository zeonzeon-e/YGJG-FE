import React from "react";
import Header2 from "../../component/Header/Header2/Header2";
import NoticeCard1 from "../../component/Notice/NoticeCard1/NoticeCard1";
import BottomNavBar from "../../component/Nevigation/BottomNavBar";

const Notice: React.FC = () => {
  return (
    <div>
      <Header2 text="최씨 민석" line={true} />
      <div style={{ padding: "20px" }}></div>
      <NoticeCard1 title="필독 공지사항" date="2024.06.13 12:00 AM">
        공지사항입니다 ^^
      </NoticeCard1>
      <BottomNavBar />
    </div>
  );
};

export default Notice;
