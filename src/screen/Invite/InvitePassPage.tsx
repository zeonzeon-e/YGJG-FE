import React, { useState } from "react";
import GlobalStyles from "../../components/Styled/GlobalStyled";
import Header2 from "../../components/Header/Header2/Header2";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // React Router 사용
import Input from "../../components/Input/Input";
import MainButton from "../../components/Button/MainButton";
import ProfileCard from "../../components/ProfileCard/ProfileCard";

const InvitePassPage: React.FC = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState(""); // 초대코드 입력 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  // 미리 정의된 유효한 초대코드 리스트
  const validCodes = ["ABC123", "DEF456", "GHI789"];

  // 초대코드 검증 및 페이지 이동 함수
  const handleCheckCode = () => {
    if (validCodes.includes(inviteCode.toUpperCase())) {
      navigate(`/invite-pass${inviteCode}`); // 유효한 코드인 경우 다음 페이지로 이동
    } else {
      setError("일치하는 팀이 없어요"); // 유효하지 않은 코드인 경우 에러 메시지 설정
    }
  };

  return (
    <>
      <GlobalStyles />
      <Header2 text="초대코드" />
      <Container>
        <ContainerHeader>
          <ContainerTitle className="Title2">
            초대받은 팀이 맞나요?
          </ContainerTitle>
        </ContainerHeader>
        <Card className="shadow-df">
          <ProfileImage src="" alt="Profile" />
          <CardTeamName className="Headline">팀 이름</CardTeamName>
          <CardTeamLoc className="Caption1">주요 경기 장소</CardTeamLoc>
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
    </>
  );
};

export default InvitePassPage;

// 스타일 컴포넌트 정의

const Container = styled.div`
  height: 100%;
  padding: 20px;
  margin-top: 50%;
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

const ContainerInput = styled.div`
  width: 70%;
  display: flex;
  flex-direction: column;
  text-align: center;
  margin: auto;
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
/**
 * ProfileImage 스타일 컴포넌트 - 프로필 이미지 스타일링
 */
const ProfileImage = styled.img`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
`;

const CardTeamName = styled.div``;

const CardTeamLoc = styled.div``;
