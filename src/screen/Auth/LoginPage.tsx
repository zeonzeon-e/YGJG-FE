// src/screen/Auth/LoginPage.tsx

import React, { useState, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { HiEye, HiEyeSlash, HiXCircle } from "react-icons/hi2";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../hooks/useAuth";
import { setAccessToken, setRefreshToken } from "../../utils/authUtils";
import apiClient from "../../api/apiClient";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { handleLoginSuccess } = useAuth();

  const KAKAO_AUTH_URL =
    "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=6de9c9ef1556266bf0bab36b47b7360d&redirect_uri=http://localhost:3000/auth/kakao/callback";
  const GOOGLE_AUTH_URL =
    "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=405167826298-s3a0rdn0e407de1upa54vvrhrshaiu18.apps.googleusercontent.com&redirect_uri=http://localhost:3000/auth/google/callback&scope=email%20profile";

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const isValidPassword = (password: string): boolean => {
    return password.length >= 4;
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setErrorMessage("");

    if (!isValidEmail(email)) {
      setErrorMessage("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage("비밀번호는 최소 4자 이상이어야 합니다.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post("api/sign/sign-in", {
        email,
        password,
      });

      if (response.status === 200) {
        const { token, refreshToken } = response.data;
        await handleLoginSuccess(token, refreshToken);
      } else {
        setErrorMessage("로그인에 실패했습니다.");
      }
    } catch (error) {
      setErrorMessage("이메일 또는 비밀번호를 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKakaoLogin = useCallback((): void => {
    window.location.href = KAKAO_AUTH_URL;
  }, [KAKAO_AUTH_URL]);

  const handleGoogleLogin = (): void => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <PageWrapper>
      {/* 배경 장식 */}
      <BackgroundDecoration />
      <BackgroundCircle />

      <ContentWrapper>
        {/* 로고 및 환영 메시지 */}
        <LogoSection>
          <LogoIcon>⚽</LogoIcon>
          <LogoText>요기조기</LogoText>
          <WelcomeText>함께하는 즐거움, 축구의 시작</WelcomeText>
        </LogoSection>

        {/* 로그인 카드 */}
        <LoginCard>
          <CardTitle>로그인</CardTitle>

          <Form onSubmit={handleSubmit}>
            {/* 이메일 입력 */}
            <InputGroup>
              <InputLabel>이메일</InputLabel>
              <InputWrapper>
                <StyledInput
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  hasError={!!errorMessage && !isValidEmail(email)}
                />
                {email && (
                  <ClearButton type="button" onClick={() => setEmail("")}>
                    <HiXCircle size={20} />
                  </ClearButton>
                )}
              </InputWrapper>
            </InputGroup>

            {/* 비밀번호 입력 */}
            <InputGroup>
              <InputLabel>비밀번호</InputLabel>
              <InputWrapper>
                <StyledInput
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  required
                  hasError={
                    !!errorMessage && password.length > 0 && password.length < 4
                  }
                />
                {password && (
                  <ClearButton
                    type="button"
                    onClick={() => setPassword("")}
                    style={{ right: "44px" }}
                  >
                    <HiXCircle size={20} />
                  </ClearButton>
                )}
                <ToggleButton type="button" onClick={togglePasswordVisibility}>
                  {showPassword ? (
                    <HiEye size={20} />
                  ) : (
                    <HiEyeSlash size={20} />
                  )}
                </ToggleButton>
              </InputWrapper>
            </InputGroup>

            {/* 에러 메시지 */}
            {errorMessage && (
              <ErrorMessage>
                <span>⚠️</span> {errorMessage}
              </ErrorMessage>
            )}

            {/* 로그인 버튼 */}
            <LoginButton type="submit" disabled={isLoading}>
              {isLoading ? <LoadingSpinner /> : "로그인"}
            </LoginButton>
          </Form>

          {/* 구분선 */}
          <Divider>
            <DividerLine />
            <DividerText>또는</DividerText>
            <DividerLine />
          </Divider>

          {/* 소셜 로그인 */}
          <SocialButtons>
            <KakaoButton type="button" onClick={handleKakaoLogin}>
              <RiKakaoTalkFill size={22} />
              카카오로 시작하기
            </KakaoButton>
            <GoogleButton type="button" onClick={handleGoogleLogin}>
              <FcGoogle size={22} />
              Google로 시작하기
            </GoogleButton>
          </SocialButtons>

          {/* 링크들 */}
          <FooterLinks>
            <FooterLink to="/login/find-pw">비밀번호 찾기</FooterLink>
            <LinkDivider>•</LinkDivider>
            <FooterLink to="/signup" highlight>
              회원가입
            </FooterLink>
          </FooterLinks>
        </LoginCard>

        {/* 하단 정보 */}
        <BottomInfo>© 2024 요기조기. All rights reserved.</BottomInfo>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default LoginPage;

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

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/* ========== Styled Components ========== */
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8faf9 0%, #e8f5e9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
`;

const BackgroundDecoration = styled.div`
  position: absolute;
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
`;

const BackgroundCircle = styled.div`
  position: absolute;
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
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
`;

const LogoSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
  animation: ${fadeIn} 0.6s ease;
`;

const LogoIcon = styled.div`
  font-size: 48px;
  margin-bottom: 12px;
  animation: ${float} 3s ease-in-out infinite;
`;

const LogoText = styled.h1`
  font-size: 32px;
  font-family: "Pretendard-Black";
  color: var(--color-main);
  margin-bottom: 8px;
`;

const WelcomeText = styled.p`
  font-size: 14px;
  color: var(--color-dark1);
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.6s ease 0.1s backwards;
`;

const CardTitle = styled.h2`
  font-size: 22px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  text-align: center;
  margin-bottom: 28px;
`;

const Form = styled.form``;

const InputGroup = styled.div`
  margin-bottom: 20px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 13px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2);
  margin-bottom: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 14px 16px;
  padding-right: 44px;
  border: 2px solid
    ${(props) => (props.hasError ? "var(--color-error)" : "#e8e8e8")};
  border-radius: 12px;
  font-size: 15px;
  background: #fafafa;
  color: var(--color-dark2);
  box-sizing: border-box;
  transition: all 0.2s ease;

  &::placeholder {
    color: #bbb;
  }

  &:focus {
    outline: none;
    border-color: var(--color-main);
    background: white;
    box-shadow: 0 0 0 4px rgba(14, 98, 68, 0.1);
  }
`;

const ClearButton = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;

  &:hover {
    color: #999;
  }
`;

const ToggleButton = styled(ClearButton)`
  right: 14px;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff5f5;
  color: var(--color-error);
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 10px;
  margin-bottom: 16px;

  span {
    font-size: 14px;
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 16px;
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-darker) 100%
  );
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-family: "Pretendard-Bold";
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 98, 68, 0.3);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 24px 0;
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

const SocialButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SocialButton = styled.button`
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-family: "Pretendard-SemiBold";
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }
`;

const KakaoButton = styled(SocialButton)`
  background: #fee500;
  color: #191919;

  &:hover {
    box-shadow: 0 4px 12px rgba(254, 229, 0, 0.4);
  }
`;

const GoogleButton = styled(SocialButton)`
  background: white;
  color: var(--color-dark2);
  border: 1px solid #e8e8e8;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
`;

const FooterLink = styled(Link)<{ highlight?: boolean }>`
  font-size: 14px;
  color: ${(props) =>
    props.highlight ? "var(--color-main)" : "var(--color-dark1)"};
  font-family: ${(props) =>
    props.highlight ? "Pretendard-SemiBold" : "Pretendard-Regular"};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const LinkDivider = styled.span`
  color: #ddd;
  font-size: 10px;
`;

const BottomInfo = styled.p`
  text-align: center;
  font-size: 12px;
  color: var(--color-dark1);
  margin-top: 32px;
  animation: ${fadeIn} 0.6s ease 0.2s backwards;
`;
