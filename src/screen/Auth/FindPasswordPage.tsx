import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header2 from "../../components/Header/Header2/Header2";
import MainButton from "../../components/Button/MainButton";

const FindPasswordPage: React.FC = () => {
  return (
    <Wrapper>
      <Header2 text="비밀번호 찾기" />
      <Container>
        <Title>비밀번호를 잊으셨나요?</Title>
        <Link style={{ width: "100%" }} to="/login/find-pw/phone">
          <MainButton>휴대폰 번호로 찾기</MainButton>
        </Link>
        <Link style={{ width: "100%" }} to="/login/find-pw/email">
          <MainButton>이메일로 찾기</MainButton>
        </Link>

        <Horizontal />
        <Link style={{ width: "100%" }} to="/login">
          <MainButton>로그인 홈으로 돌아가기</MainButton>
        </Link>
      </Container>
    </Wrapper>
  );
};

export default FindPasswordPage;

const Wrapper = styled.div`
  margin: 0px 10px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 10px;
  margin: auto;
`;

const Horizontal = styled.div`
  height: 1px;
  width: 100%;
  background-color: #ccc;
  margin: 20px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 120px 0 160px 0;
  color: #333;
`;
