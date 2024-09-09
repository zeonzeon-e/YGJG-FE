import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header2 from "../../component/Header/Header2/Header2";
import MainButton from "../../component/Button/MainButton";
import Input from "../../component/Input/Input";
import { useNavigate } from "react-router-dom";

const FindPassWardEmailPage: React.FC = () => {
  const navigate = useNavigate();

  const goToFindPage = () => {
    navigate("/");
  };

  return (
    <div>
      <Header2 text="비밀번호 찾기" />
      <Container>
        <Title>비밀번호를 잊으셨나요?</Title>
        <Input
          type="input"
          placeholder="이메일을 입력해주세요"
          bgColor="#eee"
          height={50}
        />
        <MainButton onClick={goToFindPage}>이메일로 찾기</MainButton>
      </Container>
    </div>
  );
};

export default FindPassWardEmailPage;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 5px;
  margin: auto;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 120px 0 160px 0;
  color: #333;
`;
