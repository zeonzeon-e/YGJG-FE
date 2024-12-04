import React, { useState, useEffect } from "react";
import GlobalStyles from "../../components/Styled/GlobalStyled";
import Header1 from "../../components/Header/Header1/Header1";
import styled from "styled-components";
import MiniButton from "../../components/Button/MiniButton";
import { FaCalendarAlt, FaClipboardCheck, FaEdit,FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // React Router 사용
import apiClient from "../../api/apiClient"; // apiClient 임포트
import { getAccessToken } from "../../utils/authUtils";
import axios, { AxiosResponse } from "axios";
import { setAccessToken, setRefreshToken } from "../../utils/authUtils";

const MyPage: React.FC = () => {
  const [teamList, setTeamList] = useState<
    Array<{
      position: string;
      teamId: number;
      teamColor: string;
      teamImageUrl: string;
      teamName: string;
      
    }>
  >([]);
const [profile, setProfile] = useState<{
  name: string;
  email: string;
  imageUrl: string;
} | null>(null);
const [loading, setLoading] = useState<boolean>(true);
const [error, setError] = useState<string | null>(null);

const navigate = useNavigate();

// useEffect(() => {
//   // 백엔드에서 팀 목록과 프로필 정보를 가져오는 함수
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const accessToken = getAccessToken(); // accessToken 가져오기
//       const headers = {
//         Authorization: `Bearer ${accessToken}`,
//       };
      
//       // 실제 API 엔드포인트에 맞게 수정하세요
//       const [teamResponse, profileResponse] = await Promise.all([
//         apiClient.get("/api/teams", { headers }), // 팀 목록을 가져오는 API
//         apiClient.get("/api/user/profile", { headers }), // 사용자 프로필을 가져오는 API
//       ]);
//       setTeamList(teamResponse.data);
//       setProfile(profileResponse.data);
//     } catch (err) {
//       console.error(err);
//       setError("데이터를 가져오는 중 에러가 발생했습니다.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchData();
// }, []);

  useEffect(() => {
    
  const profileData = async () => {
    try{
      const accessToken = getAccessToken();
      const headers = {
        Authorization: `Bearer ${accessToken}`,
      };

      const response = await apiClient.get('api/member/getUser');
      console.log(response.data)
      setProfile({name: response.data.name, email:response.data.email, imageUrl:response.data.profileUrl})
      console.log('profile', profile)
    }catch(err){console.error(err);
      setError("데이터를 가져오는 중 에러가 발생했습니다.")
    }
  }
  const teamData = async () => {
    try{
      const response = await apiClient.get('api/myPage/teams');
      console.log(response.data)
      setTeamList(response.data)
      console.log('Team', teamList)
    }catch(err){console.error(err);
      setError("데이터를 가져오는 중 에러가 발생했습니다.")
    }
  }


  profileData();
  teamData();
  }, [])


// // API 호출 결과 타입 정의
// interface ApiResponse {
//   id: number;
//   name: string;
//   email: string;
// }
// const accessToken = getAccessToken(); // 여기에 실제 토큰을 입력하세요.
// console.log('accessToken', accessToken)

//   const [data, setData] = useState<ApiResponse[]>([]);


  // // API 데이터 가져오기 함수
  // const fetchData = async () => {
  //   setLoading(true);
  //   setError(null);

  //   try {
  //     const response = await fetch('http://13.124.10.231:8080/api/team', {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `bearer ${accessToken}`,
  //       },
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const result: ApiResponse[] = await response.json();
  //     setData(result);
  //   } catch (err) {
  //     setError((err as Error).message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // 컴포넌트가 처음 렌더링될 때 데이터 가져오기
  // useEffect(() => {
  //   fetchData();
  // }, []);


  const handleEditClick = (index: number) => {
    navigate(`/team-edit/${teamList[index].teamId}`, {
      state: {
        teamId: teamList[index].teamId,
        teamColor: teamList[index].teamColor,
        position: teamList[index].position,
      },
    });
  };  

  if (loading) {
    return (
      <>
        <GlobalStyles />
        <Header1 text="마이페이지" />
        <Container>
          <Profile>
            <ProfileImage
              src={profile?.imageUrl || "https://example.com/profile-image.jpg"}
              alt="프로필 이미지"
              className="shadow-df"
            />
            <ProfileName>{profile?.name || "이름 없음"}</ProfileName>
            <ProfileEmail>{profile?.email || "이메일 없음"}</ProfileEmail>
            <ProfileButton>프로필 설정</ProfileButton>
          </Profile>

          <TeamContainer className="border-df">
          <SectionTitle>가입 중인 팀</SectionTitle>
          {teamList.length !== 0 ? (
            teamList.map((el, index) => (
              <JoinTeamList key={index}>
                <TeamDiv>
                <ColorLine color={el.teamColor} />
                <TeamProfileImg src={el.teamImageUrl}/>
                <TeamNameText>{el.teamName}</TeamNameText>
                </TeamDiv>
                <PositionWrapper>
                  <PositionText position={el.position}>
                    {el.position}
                  </PositionText>
                  
                </PositionWrapper>
                <MiniButton onClick={() => handleEditClick(index)}>
                  <FaEdit style={{ marginRight: "5px" }} />
                  
                </MiniButton>
              </JoinTeamList>
            ))
          ) : (
            <JoinTeamList>가입 중인 팀이 없어요</JoinTeamList>
          )}
</TeamContainer>
          <MenuList>
            <MenuItem>
              <FaCalendarAlt size={24} />
              <MenuText onClick={() => navigate("/my/calendar")}>
                내 경기 일정 보기
              </MenuText>
            </MenuItem>
            <MenuItem>
              <FaClipboardCheck size={24} />
              <MenuText onClick={() => navigate("/my/joinstatus")}>
                가입 승인 현황 보기
              </MenuText>
            </MenuItem>
            <MenuItem>
              <FaBell size={24} />
              <MenuText onClick={() => navigate("/my/alarm")}>
                알림 설정하기
              </MenuText>
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
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <GlobalStyles />
      <Header1 text="마이페이지" />
      <Container>
        <Profile>
          <ProfileImage
            src={profile?.imageUrl || "https://example.com/profile-image.jpg"}
            alt="프로필 이미지"
            className="shadow-df"
          />
          <ProfileName>{profile?.name || "이름 없음"}</ProfileName>
          <ProfileEmail>{profile?.email || "이메일 없음"}</ProfileEmail>
          <ProfileButton>프로필 설정</ProfileButton>
        </Profile>

        <SectionTitle>가입 중인 팀</SectionTitle>
        {teamList.length !== 0 ? (
          teamList.map((el, index) => (
            <JoinTeamList key={index}>
              {/* <ColorCircle color={el.teamColor} /> */}
              <div>{el.teamImageUrl}</div>
              <TeamNameText>{el.teamName}</TeamNameText>
              <PositionWrapper>
                <PositionText position={el.position}>
                  {el.position}으로 활동중
                </PositionText>
              </PositionWrapper>
              <MiniButton onClick={() => handleEditClick(index)}>
                <FaEdit style={{ marginRight: "5px" }} />
                정보 수정
              </MiniButton>
            </JoinTeamList>
          ))
        ) : (
          <JoinTeamList>가입 중인 팀이 없어요</JoinTeamList>
        )}

        <MenuList>
          <MenuItem>
            <FaCalendarAlt size={24} />
            <MenuText onClick={() => navigate("/my/calendar")}>
              내 경기 일정 보기
            </MenuText>
          </MenuItem>
          <MenuItem>
            <FaClipboardCheck size={24} />
            <MenuText onClick={() => navigate("/my/joinstatus")}>
              가입 승인 현황 보기
            </MenuText>
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
`;

const ProfileImage = styled.img`
  width: 20vw;
  height: 20vw;
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
  font-size: 16px;
  font-family: "Pretendard-Bold";
  margin-bottom: 20px;
`;

const JoinTeamList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const TeamContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`

const TeamDiv = styled.div`
  display: flex;
  gap : 2vw;
  align-items: center;
`

const ColorLine = styled.div<{color:string}>`
  height: 60px;
  border-left: 5px solid ${({ color }) => color};
  border-radius: 10px;
`

const TeamProfileImg = styled.img`
  width: 10vw;
  height: 10vw;
  border-radius: 50%;
  
`;

const TeamNameText = styled.div`
  font-size: 14px;
`

const PositionWrapper = styled.div`
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
      case "CB":
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
