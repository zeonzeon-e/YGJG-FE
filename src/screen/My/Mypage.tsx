// import React, { useState } from "react";
// import GlobalStyles from "../../component/Styled/GlobalStyled";
// import logo512 from "../../../public/logo512.png";
// import Header1 from "../../component/Header/Header1/Header1";
// import styled from "styled-components";
// import MenuList from "../../component/MenuList/MenuList";
// import MiniButton from "../../component/Button/MiniButton";

// const MyPage: React.FC = () => {

//   const teamlist = [{color:"#000000", img:"image", name:"코리아 팀", position:"LW"},
//     {color:"#00FF00", img:"image", name:"호주 팀", position:"GK"}]

//   return (
//     <>
//       <GlobalStyles />
//       <div className="MyPage">
//         <Header1 text="마이페이지" />
//         <Profile>
//           <div>이미지</div>
//           <div>
//             <div className="h3">이름</div>
//             <div className="p">julia3277@naver.com</div>
//           </div>
//           <SystemButton>프로필 설정</SystemButton>
//         </Profile>
//           {teamlist.map((el)=>{
//             return(
//               <JoinTeamList>
//                 <div>{el.color}</div>
//                 <div>{el.img}</div>
//                 <div>{el.name}</div>
//                 <div>{el.position}</div>
//                 <MiniButton>정보 수정</MiniButton>
//               </JoinTeamList>
//             )

//           })}
//       </div>
//     </>
//   );
// };

// export default MyPage;

// const Profile = styled.div`
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   text-align: center;
//   height: 120px;
//   padding-top: 20px;
//   justify-content: space-between;
// `;

// const SystemButton = styled.button`
//   margin-right: auto;
//   margin-left: auto;
//   width: 70px;
//   font-family: Pretendard-Light;
//   font-size: 12px;
//   background-color: var(--color-dark1);
//   border: 0px;
//   border-radius: 10px;
//   padding: 2px;
//   color: var(--color-light1);
//   box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.3);
// `;

// const JoinTeamList = styled.div`
  
// `

import React from "react";
import styled from "styled-components";
import { FaCalendarAlt, FaFlag } from "react-icons/fa";
import ProfileCard from "../../component/ProfileCard/ProfileCard";
import MiniButton from "../../component/Button/MiniButton";
/**
 * Mypage 컴포넌트 - 사용자의 마이페이지를 표시
 * @returns {JSX.Element} Mypage 컴포넌트
 */
const Mypage: React.FC = () => {
  return (
    <Container>
      <Header>마이페이지</Header>
      <ProfileSection>
        <ProfileImage
          src="https://example.com/profile-image.jpg"
          alt="프로필 이미지"
        />
        <ProfileName>홍길동</ProfileName>
        <ProfileEmail>naver1234@naver.com</ProfileEmail>
        <ProfileButton>프로필 설정</ProfileButton>
      </ProfileSection>

      <TeamSection>
        <SectionTitle>가입 중인 팀</SectionTitle>
        <TeamCard>
          <ProfileCard
            profileImageUrl="https://example.com/team1-logo.jpg"
            teamName="코리아 팀"
            location="서울특별시"
            teamSize="20명"
            teamAgeRange="20대, 30대"
            teamDays="월 화 수"
            teamTime="오전(9시~12시)"
            teamCost="30,000원"
            teamLevel="레벨 중"
            isManager={false}
            isSubManager={false}
          />
          <MiniButton>정보 수정</MiniButton>
        </TeamCard>
        <TeamCard>
          <ProfileCard
            profileImageUrl="https://example.com/team2-logo.jpg"
            teamName="호주 팀"
            location="부산광역시"
            teamSize="15명"
            teamAgeRange="30대, 40대"
            teamDays="목 금"
            teamTime="오후(6시~9시)"
            teamCost="20,000원"
            teamLevel="레벨 상"
            isManager={false}
            isSubManager={false}
          />
          <MiniButton>정보 수정</MiniButton>
        </TeamCard>
      </TeamSection>

      <MenuSection>
        <MenuItem>
          <FaCalendarAlt size={20} />
          <MenuText>내 경기 일정 보기</MenuText>
        </MenuItem>
        <MenuItem>
          <FaFlag size={20} />
          <MenuText>가입 승인 현황 보기</MenuText>
        </MenuItem>
      </MenuSection>

      <FooterSection>
        <FooterItem>공지사항</FooterItem>
        <FooterItem>자주 묻는 질문</FooterItem>
        <FooterItem>문의하기</FooterItem>
        <FooterDivider />
        <FooterItem>비밀번호 변경하기</FooterItem>
        <FooterItem>로그아웃</FooterItem>
        <FooterItem>서비스 탈퇴하기</FooterItem>
      </FooterSection>
    </Container>
  );
};

export default Mypage;

// 스타일 컴포넌트 정의

const Container = styled.div`
  padding: 16px;
`;

const Header = styled.h1`
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  font-family: "Pretendard-Bold";
`;

const ProfileSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const ProfileName = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ProfileEmail = styled.div`
  font-size: 14px;
  color: #777;
  margin-bottom: 10px;
`;

const ProfileButton = styled.button`
  background-color: var(--color-light2);
  border: 1px solid var(--color-main);
  border-radius: 20px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-main);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--color-light1);
  }
`;

const TeamSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  margin-bottom: 20px;
`;

const TeamCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--color-light1);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const MenuSection = styled.div`
  margin-bottom: 40px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  cursor: pointer;
`;

const MenuText = styled.span`
  margin-left: 10px;
  font-size: 16px;
  font-family: "Pretendard-Medium";
`;

const FooterSection = styled.div`
  margin-top: 40px;
`;

const FooterItem = styled.div`
  font-size: 14px;
  margin-bottom: 12px;
  cursor: pointer;
  color: var(--color-dark2);

  &:hover {
    text-decoration: underline;
  }
`;

const FooterDivider = styled.div`
  border-bottom: 1px solid var(--color-light2);
  margin: 20px 0;
`;

