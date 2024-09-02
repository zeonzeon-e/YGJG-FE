import React, { useState } from "react";
import GlobalStyles from "../../component/Styled/GlobalStyled";
import Header1 from "../../component/Header/Header1/Header1";
import styled from "styled-components";
import MiniButton from "../../component/Button/MiniButton";
import { FaCalendarAlt, FaClipboardCheck, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // React Router 사용

const MyPage: React.FC = () => {
  const [teamList, setTeamList] = useState([
    { color: "#000000", img: "", name: "코리아 팀", position: "LW" },
    { color: "#00FF00", img: "", name: "호주 팀", position: "GK" },
  ]);

  const navigate = useNavigate();

  const handleEditClick = (index: number) => {
    navigate(`/team-edit/:id`, {
      state: {
        teamIndex: index,
        color: teamList[index].color,
        position: teamList[index].position,
      },
    });
  };

  return (
    <>
      <GlobalStyles />
      <Container>
        <Header1 text="마이페이지" />
        <Profile>
          <ProfileImage
            src="https://example.com/profile-image.jpg"
            alt="프로필 이미지"
          />
          <ProfileName>홍길동</ProfileName>
          <ProfileEmail>naver1234@naver.com</ProfileEmail>
          <ProfileButton>프로필 설정</ProfileButton>
        </Profile>

        <SectionTitle>가입 중인 팀</SectionTitle>
        {teamList.map((el, index) => (
          <JoinTeamList key={index}>
            <ColorCircle color={el.color} />
            <div>{el.img}</div>
            <div>{el.name}</div>
            <PositionWrapper>
              <PositionText position={el.position}>{el.position}</PositionText>
              <span>으로 활동중</span>
            </PositionWrapper>
            <MiniButton onClick={() => handleEditClick(index)}>
              <FaEdit style={{ marginRight: "5px" }} />
              정보 수정
            </MiniButton>
          </JoinTeamList>
        ))}

        <MenuList>
          <MenuItem>
            <FaCalendarAlt size={24} />
            <MenuText onClick={() => navigate("/my/calendar")}>내 경기 일정 보기</MenuText>
          </MenuItem>
          <MenuItem>
            <FaClipboardCheck size={24} />
            <MenuText onClick={() => navigate("/my/joinstatus")}>가입 승인 현황 보기</MenuText>
          </MenuItem>
        </MenuList>

        <Divider />

        <FooterList>
          <FooterTitle>고객센터</FooterTitle>
          <FooterItem>공지사항</FooterItem>
          <FooterItem>자주 묻는 질문</FooterItem>
          <FooterItem>문의하기</FooterItem>
        </FooterList>

        <Divider />

        <FooterList>
          <FooterTitle>보안</FooterTitle>
          <FooterItem>비밀번호 변경하기</FooterItem>
          <FooterItem>로그아웃</FooterItem>
          <FooterItem>서비스 탈퇴하기</FooterItem>
        </FooterList>
      </Container>
    </>
  );
};

export default MyPage;

// 스타일 컴포넌트 정의

const Container = styled.div`
  padding: 20px;
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const ProfileName = styled.div`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  margin-bottom: 5px;
`;

const ProfileEmail = styled.div`
  font-size: 14px;
  font-family: "Pretendard-Regular";
  color: #777;
  margin-bottom: 10px;
`;

const ProfileButton = styled.button`
  background-color: var(--color-dark2);
  border: 1px solid var(--color-dark1);
  border-radius: 20px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  font-family: "Pretendard-Regular";
  color: var(--color-light1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--color-dark1);
  }
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  margin-bottom: 20px;
`;

const JoinTeamList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--color-light1);
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`;

const ColorCircle = styled.div<{ color: string }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
`;

const PositionWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: var(--color-dark2);
`;

const PositionText = styled.span<{ position: string }>`
  color: ${({ position }) => {
    switch (position) {
      case "FW":
      case "LW":
      case "RW":
        return "var(--color-sk)"; // 공격수
      case "DF":
        return "var(--color-dp)"; // 수비수
      case "MF":
        return "var(--color-mf)"; // 미드필더
      case "GK":
        return "var(--color-gk)"; // 골키퍼
      default:
        return "var(--color-dark2)"; // 기본 색상
    }
  }};
  font-weight: bold;
`;

const MenuList = styled.div`
  margin: 40px 0;
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

const Divider = styled.div`
  border-bottom: 1px solid var(--color-light2);
  margin: 20px 0;
`;

const FooterList = styled.div`
  margin-bottom: 20px;
`;

const FooterItem = styled.div`
  font-size: 14px;
  margin-bottom: 4px;
  cursor: pointer;
  color: var(--color-dark2);

  &:hover {
    text-decoration: underline;
  }
`;

const FooterTitle = styled.div`
  font-size: 12px;
  margin-bottom: 5px;
  cursor: pointer;
  color: var(--color-dark1);
`;
