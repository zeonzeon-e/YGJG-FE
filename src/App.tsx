import React from "react";
import "./App.css";
import GlobalStyles from "./component/Styled/GlobalStyled";
import ProfileCard from "./component/ProfileCard/ProfileCard";
import Header1 from "./component/Header/Header1/Header1";

const App = () => {
  return (
    <>
      <GlobalStyles />
      <div className="App">
        <Header1 text="요기조기" />
        <ProfileCard
          isManager={true} // 매니저 여부
          profileImageUrl="https://via.placeholder.com/100" // 프로필 이미지 URL
          teamName="코리아" // 팀 이름
          location="주 경기장" // 경기 장소
          teamSize="20명" // 팀원 수
          teamAgeRange="20대, 30대" // 팀 연령대
          teamDays="월 화 수 목 금" // 팀 경기 요일
          teamTime="오전(9시~12시)" // 팀 경기 시간대
          teamCost="30,000" // 팀 월 비용
          teamLevel="레벨 중" // 팀 레벨
        />
      </div>
    </>
  );
};

export default App;
