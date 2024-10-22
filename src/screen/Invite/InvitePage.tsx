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
  const handleCheckCode = () => {
    if (validCodes.includes(inviteCode.toUpperCase())) {
      setState(1);
    } else {
      setError("일치하는 팀이 없어요");
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
            <MainButton onClick={handleCheckCode}>바로 가입하기</MainButton>
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
    </>
  );
};

export default InvitePage;

// 초대 코드 확인 페이지 컴포넌트
const InvitePassPageContent: React.FC<{ onNext: () => void }> = ({
  onNext,
}) => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState(""); // 초대코드 입력 상태
  const [teamName, setTeamName] = useState(""); // 팀 이름 상태
  const [teamLocation, setTeamLocation] = useState(""); // 팀 위치 상태
  const [profileImageUrl, setProfileImageUrl] = useState(""); // 팀 프로필 이미지 상태
  const validCodes = ["ABC123", "DEF456", "GHI789"];

  const handleCheckCode = () => {
    if (validCodes.includes(inviteCode.toUpperCase())) {
      navigate(`/invite-pass${inviteCode}`);
    }
  };

  return (
    <>
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
        <MainButton onClick={handleCheckCode}>바로 가입하기</MainButton>
        <MainButton
          bgColor="white"
          textColor="var(--color-main)"
          onClick={() => navigate("/invite")}
        >
          다시 검색하기
        </MainButton>
      </ContainerInput>
    </>
  );
};

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
