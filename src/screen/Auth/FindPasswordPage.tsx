import React from "react";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { HiArrowLeft, HiDevicePhoneMobile, HiEnvelope } from "react-icons/hi2";

/* ========== Animations ========== */
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/* ========== Page Layout ========== */
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8faf9 0%, #e8f5e9 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  padding-top: 40px;
  position: relative;
  overflow-x: hidden;
`;

const BackgroundDecoration = styled.div`
  position: fixed;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: linear-gradient(
    135deg,
    var(--color-subtle) 0%,
    var(--color-sub) 100%
  );
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
    var(--color-main) 0%,
    var(--color-main-darker) 100%
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

/* ========== Header ========== */
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
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const HeaderTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  margin-right: 44px;
`;

/* ========== Card ========== */
const Card = styled.div`
  background: white;
  border-radius: 24px;
  padding: 40px 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.5s ease 0.1s backwards;
`;

const Title = styled.h2`
  font-size: 24px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  text-align: center;
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: var(--color-dark1);
  text-align: center;
  margin-bottom: 40px;
`;

/* ========== Option Buttons ========== */
const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const OptionButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  background: #f8f9fa;
  border: 2px solid transparent;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #f0fdf4;
    border-color: var(--color-main);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(14, 98, 68, 0.1);
  }
`;

const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-darker) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
`;

const OptionText = styled.div`
  flex: 1;
`;

const OptionTitle = styled.p`
  font-size: 16px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2);
  margin-bottom: 4px;
`;

const OptionDesc = styled.p`
  font-size: 13px;
  color: var(--color-dark1);
`;

/* ========== Divider ========== */
const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 32px 0;
`;

const DividerLine = styled.div`
  flex: 1;
  height: 1px;
  background: #e8e8e8;
`;

const DividerText = styled.span`
  padding: 0 16px;
  font-size: 13px;
  color: var(--color-dark1);
`;

/* ========== Back to Login ========== */
const BackToLogin = styled(Link)`
  display: block;
  text-align: center;
  padding: 16px;
  background: white;
  border: 2px solid #e8e8e8;
  border-radius: 14px;
  font-size: 15px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2);
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-main);
    color: var(--color-main);
  }
`;

const FindPasswordPage: React.FC = () => {
  return (
    <PageWrapper>
      <BackgroundDecoration />
      <BackgroundCircle />

      <ContentWrapper>
        <Header>
          <BackButton to="/login">
            <HiArrowLeft size={22} />
          </BackButton>
          <HeaderTitle>비밀번호 찾기</HeaderTitle>
        </Header>

        <Card>
          <Title>비밀번호를 잊으셨나요?</Title>
          <SubTitle>본인 확인 후 비밀번호를 재설정할 수 있어요</SubTitle>

          <OptionsContainer>
            <OptionButton to="/login/find-pw/phone">
              <IconWrapper>
                <HiDevicePhoneMobile />
              </IconWrapper>
              <OptionText>
                <OptionTitle>휴대폰 번호로 찾기</OptionTitle>
                <OptionDesc>가입 시 등록한 휴대폰 번호로 인증</OptionDesc>
              </OptionText>
            </OptionButton>

            <OptionButton to="/login/find-pw/email">
              <IconWrapper>
                <HiEnvelope />
              </IconWrapper>
              <OptionText>
                <OptionTitle>이메일로 찾기</OptionTitle>
                <OptionDesc>가입 시 등록한 이메일로 인증</OptionDesc>
              </OptionText>
            </OptionButton>
          </OptionsContainer>

          <Divider>
            <DividerLine />
            <DividerText>또는</DividerText>
            <DividerLine />
          </Divider>

          <BackToLogin to="/login">로그인으로 돌아가기</BackToLogin>
        </Card>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default FindPasswordPage;
