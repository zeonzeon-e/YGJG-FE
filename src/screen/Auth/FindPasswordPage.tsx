import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header2 from "../../components/Header/Header2/Header2";
import MainButton from "../../components/Button/MainButton";

const FindPasswordPage: React.FC = () => {
  return (
    <div>
      <Header2 text="비밀번호 찾기" />
      <Container>
        <Title>비밀번호를 잊으셨나요?</Title>
        <Link style={{ width: "100%" }} to="/login/find-pw/phone">
          <MainButton>휴대폰 번호로 찾기</MainButton>
        </Link>
        <Link style={{ width: "100%" }} to="/login/find-pw/email">
          <MainButton>이메일로 찾기</MainButton>
        </Link>
      </Container>
    </div>
  );
};

export default FindPasswordPage;

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
