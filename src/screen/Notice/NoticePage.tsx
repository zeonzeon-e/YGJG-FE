import React from "react";
import Header2 from "../../components/Header/Header2/Header2";
import NoticeCard1 from "../../components/Notice/NoticeCard1/NoticeCard1";
import BottomNavBar from "../../components/Nevigation/BottomNavBar";

const Notice: React.FC = () => {
  return (
    <div>
      <Header2 text="최씨 민석" line={true} />
      <div style={{ padding: "20px" }}></div>
    
      <BottomNavBar />
    </div>
  );
};

export default Notice;
