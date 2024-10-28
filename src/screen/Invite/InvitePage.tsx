import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GlobalStyles from "../../components/Styled/GlobalStyled";
import Header2 from "../../components/Header/Header2/Header2";
import Input from "../../components/Input/Input";
import MainButton from "../../components/Button/MainButton";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// 컴포넌트들을 내보내기
const InvitePage = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState(""); // 초대코드 입력 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  const validCodes = ["ABC123", "DEF456", "GHI789"];
  const [state, setState] = useState(0); //0: 초대코드 조회 1: 팀 카드 확인

  const [teamName, setTeamName] = useState(""); // 팀 이름 상태
  const [teamLocation, setTeamLocation] = useState(""); // 팀 위치 상태
  const [profileImageUrl, setProfileImageUrl] = useState(""); // 팀 프로필 이미지 상태
  const [isLoading, setIsLoading] = useState(false); //서버로 데이터 전송 중인지 아닌지
  const [signupData, setSignupData] = useState<any>({}); // 데이터 정보

  const handleCheckCode = () => {
    if (validCodes.includes(inviteCode.toUpperCase())) {
      setState(1);
    } else {
      setError("일치하는 팀이 없어요");
    }
  };

  const handleNextStep = () => {
    setState(state + 1);
  };

  const handleSelectPosition = (e: any) => {
    console.log(e.target.value);
  };

  const handleinvite = async () => {
    // const updatedData = { ...signupData, ...data };
    // console.log(updatedData);
    // setSignupData(updatedData);
    setIsLoading(true);
    try {
      const response = axios.post("/api/sign/sign-up", "123");
      if ((await response).status === 200) {
        setState(state + 1); // 성공 시 완료 페이지로 이동
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(() => {
  //   const fetchTeamData = async () => {
  //     try {
  //       const response = await axios.get("/api/team-info", {
  //         params: { inviteCode },
  //       });
  //       const { teamName, matchLocation, profileImageUrl } = response.data;
  //       setTeamName(teamName);
  //       setTeamLocation(matchLocation);
  //       setProfileImageUrl(profileImageUrl);
  //     } catch (error) {
  //       console.error("팀 정보를 가져오는 중 오류 발생", error);
  //     }
  //   };

  //   if (inviteCode) {
  //     fetchTeamData();
  //   }
  // }, [inviteCode]);

  return (
    <>
      <GlobalStyles />
      <Header2 text="초대코드" />
      {state === 0 && (
        <Container>
          <ContainerHeader>
            <ContainerTitle className="Title2">
              받으신 초대코드가 있으신가요?
            </ContainerTitle>
            <ContainerCaption className="Footnote">
              초대코드를 입력하면, 승인없이 바로 팀에 가입할 수 있어요
            </ContainerCaption>
          </ContainerHeader>
          <ContainerInput>
            <Input
              type="string"
              placeholder="초대코드 입력"
              height={50}
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              border={error && "1px solid var(--color-error)"}
            />
            {error && <ErrorMessage className="Footnote">{error}</ErrorMessage>}
            <MainButton onClick={handleCheckCode}>초대코드 조회하기</MainButton>
          </ContainerInput>
        </Container>
      )}
      {state === 1 && (
        <Container>
          <ContainerHeader>
            <ContainerTitle className="Title2">
              초대받은 팀이 맞나요?
            </ContainerTitle>
          </ContainerHeader>
          <Card className="shadow-df">
            <ProfileImage
              src={profileImageUrl || "/default-profile.png"}
              alt="Profile"
            />
            <CardTeamName className="Headline">
              {teamName || "팀 이름"}
            </CardTeamName>
            <CardTeamLoc className="Caption1">
              {teamLocation || "주요 경기 장소"}
            </CardTeamLoc>
          </Card>
          <ContainerInput>
            <MainButton onClick={handleNextStep}>바로 가입하기</MainButton>
            <MainButton
              bgColor="white"
              textColor="var(--color-main)"
              onClick={() => navigate("/invite")}
            >
              다시 검색하기
            </MainButton>
          </ContainerInput>
        </Container>
      )}
      {state === 2 && (
        <Container>
          <ContainerHeader>
            <ContainerTitle className="Title2">
              가입을 위해 희망하는 포지션을 입력해주세요
            </ContainerTitle>
            <SelectPosition onChange={handleSelectPosition}>
              <option>공격수</option>
              <option>수비수</option>
              <option>미드필더</option>
              <option>골키퍼</option>
            </SelectPosition>
          </ContainerHeader>

          <ContainerInput>
            <MainButton onClick={handleinvite}>바로 가입하기</MainButton>
          </ContainerInput>
        </Container>
      )}
      {state === 3 && (
        <Container>
          <ContainerHeader>
            <ContainerTitle className="Title2">
              가입이 완료됐어요
            </ContainerTitle>
            <ContainerCaption className="Footnote">
              메뉴에 생긴 팀 정보를 확인해보세요
            </ContainerCaption>
          </ContainerHeader>

          <ContainerInput>
            <MainButton onClick={() => navigate("/")}>홈으로 가기</MainButton>
          </ContainerInput>
        </Container>
      )}
      {isLoading && <p>회원가입 중입니다. 잠시만 기다려주세요...</p>}
    </>
  );
};

export default InvitePage;

// 공통 스타일 컴포넌트 정의
const Container = styled.div`
  height: 100%;
  padding: 20px;
  margin-top: 30%;
`;
const ContainerHeader = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 5px;
  padding-bottom: 40px;
`;
const ContainerTitle = styled.div`
  font-family: "Pretendard-SemiBold";
`;
const ContainerCaption = styled.div`
  color: var(--color-dark1);
`;
const ContainerInput = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: auto;
`;
const ErrorMessage = styled.div`
  color: var(--color-error);
  margin-bottom: 10px;
`;
const Card = styled.div`
  width: fit-content;
  padding: 20px;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: auto;
  border: 1px solid var(--color-border);
  align-items: center;
  border-radius: 8px;
  gap: 10px;
  margin-bottom: 40px;
`;
const ProfileImage = styled.img`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
`;
const CardTeamName = styled.div``;
const CardTeamLoc = styled.div``;
const SelectPosition = styled.select`
  padding: 8px;
  border-radius: 8px;
  width: 50%;
  margin: auto;
  margin-top: 10px;
`;
