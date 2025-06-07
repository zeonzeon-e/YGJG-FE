// src/screen/Team/TeamCreationIntroPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import MainButton from "../../components/Button/MainButton";
import Header2 from "../../components/Header/Header2/Header2";

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  padding: 20px;
  margin: auto;
`;

const SubContainer = styled.div`
  padding: 5px;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const IconWrapper = styled.div`
  margin: 30px 0 50px 0;
  img {
    width: 174px;
    height: 180px;
  }
`;

const SubTitle = styled.h3`
  font-size: 15px;
  font-weight: bold;
  color: black;
  margin-bottom: 7px;
  margin-left: 10px;
  text-align: left;
`;

const InfoBox = styled.div`
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 20px;
  text-align: left;
  font-size: 14px;
  line-height: 1.2;

  ul {
    list-style-type: disc;
    margin: 0;
    padding-left: 20px;
  }
`;

const TeamCreationIntroPage: React.FC = () => {
  return (
    <Container>
      <Header2 line={false} />
      <SubContainer>
        <div style={{ padding: "30px" }}></div>
        <Title>
          팀을 생성하여
          <div style={{ padding: "2px" }}></div>
          선수를 모아보세요
        </Title>
        <IconWrapper>
          <img src="/rocket.svg" alt="Rocket" />
        </IconWrapper>
        <SubTitle>팀을 생성하면?</SubTitle>
        <InfoBox>
          <ul>
            <li>팀원 목록을 한 눈에 볼 수 있어요</li>
            <li>경기 일정 추가하여 공유할 수 있어요</li>
            <li>내 팀을 관리할 수 있어요</li>
          </ul>
        </InfoBox>
        <div style={{ padding: "18px" }}></div>
        <Link to="/team/create">
          <MainButton height={50}>팀 생성하기</MainButton>
        </Link>
      </SubContainer>
    </Container>
  );
};

export default TeamCreationIntroPage;
