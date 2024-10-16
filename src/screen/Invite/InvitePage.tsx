import React, { useState } from "react";
import GlobalStyles from "../../components/Styled/GlobalStyled";
import Header2 from "../../components/Header/Header2/Header2";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // React Router 사용
import Input from "../../components/Input/Input";
import MainButton from "../../components/Button/MainButton";

const InvitePage: React.FC = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState(""); // 초대코드 입력 상태
  const [error, setError] = useState(""); // 에러 메시지 상태
  // 미리 정의된 유효한 초대코드 리스트
  const validCodes = ["ABC123", "DEF456", "GHI789"];

  // 초대코드 검증 및 페이지 이동 함수
  const handleCheckCode = () => {
    if (validCodes.includes(inviteCode.toUpperCase())) {
      navigate(`/invite-pass/${inviteCode}`); // 유효한 코드인 경우 다음 페이지로 이동
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
    </>
  );
};

export default InvitePage;

// 스타일 컴포넌트 정의

const Container = styled.div`
  height: 100%;
  padding: 20px;
  margin-top: 60%;
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
