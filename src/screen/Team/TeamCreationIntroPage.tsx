// src/screen/Team/TeamCreationIntroPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import {
  HiArrowLeft,
  HiUserGroup,
  HiCalendarDays,
  HiCog6Tooth,
  HiArrowRight,
} from "react-icons/hi2";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0) rotate(-5deg); }
  50% { transform: translateY(-15px) rotate(5deg); }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8faf9 0%, #e8f5e9 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  padding-top: 40px;
`;

const BackgroundDecoration = styled.div`
  position: fixed;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--color-subtle), var(--color-sub));
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(60px);
  pointer-events: none;
`;

const BackgroundCircle = styled.div`
  position: fixed;
  bottom: -150px;
  left: -150px;
  width: 400px;
  height: 400px;
  background: linear-gradient(
    135deg,
    var(--color-main),
    var(--color-main-darker)
  );
  border-radius: 50%;
  opacity: 0.1;
  filter: blur(80px);
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: white;
  color: var(--color-dark2);
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const Card = styled.div`
  background: white;
  border-radius: 24px;
  padding: 40px 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.5s ease 0.1s backwards;
  text-align: center;
`;

const IconWrapper = styled.div`
  font-size: 80px;
  margin-bottom: 24px;
  animation: ${float} 4s ease-in-out infinite;
`;

const Title = styled.h1`
  font-size: 26px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  line-height: 1.4;
  margin-bottom: 12px;
`;

const SubTitle = styled.p`
  font-size: 15px;
  color: var(--color-dark1);
  margin-bottom: 40px;
`;

const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-radius: 16px;
  text-align: left;
  transition: all 0.2s;
`;

const FeatureIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    var(--color-main),
    var(--color-main-darker)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 22px;
  flex-shrink: 0;
`;

const FeatureText = styled.div`
  flex: 1;
`;

const FeatureTitle = styled.p`
  font-size: 15px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2);
  margin-bottom: 2px;
`;

const FeatureDesc = styled.p`
  font-size: 13px;
  color: #666666;
`;

const PrimaryButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 18px;
  box-sizing: border-box;
  background: linear-gradient(
    135deg,
    var(--color-main),
    var(--color-main-darker)
  );
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 17px;
  font-family: "Pretendard-Bold";
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 4px 15px rgba(14, 98, 68, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(14, 98, 68, 0.4);
  }
`;

const TeamCreationIntroPage: React.FC = () => {
  return (
    <PageWrapper>
      <BackgroundDecoration />
      <BackgroundCircle />

      <ContentWrapper>
        <Header>
          <BackButton to="/team/list">
            <HiArrowLeft size={22} />
          </BackButton>
        </Header>

        <Card>
          <IconWrapper>🚀</IconWrapper>

          <Title>
            팀을 생성하고
            <br />
            선수를 모아보세요
          </Title>

          <SubTitle>나만의 축구팀을 만들고 관리할 수 있어요</SubTitle>

          <FeatureList>
            <FeatureItem>
              <FeatureIcon>
                <HiUserGroup />
              </FeatureIcon>
              <FeatureText>
                <FeatureTitle>팀원 관리</FeatureTitle>
                <FeatureDesc>팀원 목록을 한 눈에 볼 수 있어요</FeatureDesc>
              </FeatureText>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>
                <HiCalendarDays />
              </FeatureIcon>
              <FeatureText>
                <FeatureTitle>일정 공유</FeatureTitle>
                <FeatureDesc>경기 일정을 추가하고 공유할 수 있어요</FeatureDesc>
              </FeatureText>
            </FeatureItem>

            <FeatureItem>
              <FeatureIcon>
                <HiCog6Tooth />
              </FeatureIcon>
              <FeatureText>
                <FeatureTitle>팀 설정</FeatureTitle>
                <FeatureDesc>내 팀을 자유롭게 관리할 수 있어요</FeatureDesc>
              </FeatureText>
            </FeatureItem>
          </FeatureList>

          <PrimaryButton to="/team/create">
            팀 생성하기
            <HiArrowRight size={20} />
          </PrimaryButton>
        </Card>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default TeamCreationIntroPage;
