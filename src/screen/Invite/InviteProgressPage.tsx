import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GlobalStyles from "../../components/Styled/GlobalStyled";
import Header2 from "../../components/Header/Header2/Header2";
import Input from "../../components/Input/Input";
import MainButton from "../../components/Button/MainButton";

interface TeamInfo {
  name: string;
  location: string;
  imageUrl: string;
}

const InvitePage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0: 코드 입력, 1: 코드 확인, 2: 팀 정보 보기
  const [inviteCode, setInviteCode] = useState("");
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({
    name: "",
    location: "",
    imageUrl: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await axios.get<TeamInfo>("/api/team-info", {
          params: { inviteCode },
        });
        setTeamInfo(response.data);
        setStep(2); // 팀 정보 표시
      } catch (error) {
        console.error("팀 정보를 가져오는 중 오류 발생", error);
        setError("팀 정보를 가져올 수 없습니다.");
        setStep(1); // 에러 발생시 코드 재입력 유도
      }
    };

    if (step === 1 && inviteCode) {
      fetchTeamData();
    }
  }, [inviteCode, step]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInviteCode(e.target.value);
    setError("");
  };

  const handleCheckCode = () => {
    // 코드 유효성 검증 후 다음 단계로 이동
    setStep(1);
  };

  const handleJoinTeam = () => {
    navigate(`/team/${inviteCode}`); // 팀 페이지로 이동
  };

  return (
    <>
      <GlobalStyles />
      <Header2 text="초대코드" />
      <Container>
        {step === 0 && (
          <ContainerInput>
            <Input
              type="text"
              placeholder="초대코드 입력"
              height={50}
              value={inviteCode}
              onChange={handleInputChange}
            />
            <MainButton onClick={handleCheckCode}>초대코드 조회하기</MainButton>
          </ContainerInput>
        )}
        {step === 1 && error && <ErrorMessage>{error}</ErrorMessage>}
        {step === 2 && (
          <Card>
            <ProfileImage
              src={teamInfo.imageUrl || "/default-profile.png"}
              alt="Team Profile"
            />
            <CardTeamName>{teamInfo.name}</CardTeamName>
            <CardTeamLoc>{teamInfo.location}</CardTeamLoc>
            <MainButton onClick={handleJoinTeam}>바로 가입하기</MainButton>
            <MainButton onClick={() => setStep(0)}>다시 검색하기</MainButton>
          </Card>
        )}
      </Container>
    </>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 5px;
  margin: auto;
`;

const ContainerInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ErrorMessage = styled.div`
  color: var(--color-error);
  margin-top: 20px;
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

const CardTeamName = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const CardTeamLoc = styled.div`
  font-size: 14px;
`;

export default InvitePage;
