// src/screen/Auth/LoginPage.tsx

import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { CgCloseO } from "react-icons/cg";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { AxiosResponse } from "axios";
import { useAuth } from "../../hooks/useAuth";
import Header1 from "../../components/Header/Header1/Header1";
import { setAccessToken, setRefreshToken } from "../../utils/authUtils";
import apiClient from "../../api/apiClient";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();
  const { handleLoginSuccess } = useAuth();

  const KAKAO_AUTH_URL =
    "https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=6de9c9ef1556266bf0bab36b47b7360d&redirect_uri=http://localhost:3000/auth/kakao/callback";
  const GOOGLE_AUTH_URL =
    "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=405167826298-s3a0rdn0e407de1upa54vvrhrshaiu18.apps.googleusercontent.com&redirect_uri=http://localhost:3000/auth/google/callback&scope=email%20profile";

  // 이메일 유효성 검사 함수
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  // 비밀번호 유효성 검사 함수 (예: 최소 4자 이상)
  const isValidPassword = (password: string): boolean => {
    return password.length >= 4;
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword((prev) => !prev);
  };

  const clearEmail = (): void => {
    setEmail("");
  };

  const clearPassword = (): void => {
    setPassword("");
  };

  const goToMainPage = (): void => {
    navigate("/my");
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    // 입력 값 검증
    if (!isValidEmail(email)) {
      setErrorMessage("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    const loginData = { email, password };

    try {
      const response = await apiClient.post("api/sign/sign-in", loginData);

      if (response.status === 200) {
        const { token, refreshToken } = response.data;
        await handleLoginSuccess(token, refreshToken);
      } else {
        setErrorMessage("로그인에 실패했습니다.");
      }
    } catch (error) {
      setErrorMessage("이메일과 비밀번호를 확인해주세요.");
    }
  };

  /**
   * 카카오 로그인 핸들러를 useCallback으로 감싼 예시
   */
  const handleKakaoLogin = useCallback((): void => {
    try {
      window.location.href = KAKAO_AUTH_URL;
    } catch (error) {
      setErrorMessage("카카오 로그인에 실패했습니다. 다시 시도해주세요.");
    }
  }, [KAKAO_AUTH_URL]);

  /**
   * 구글 로그인 핸들러 (필요시 useCallback 적용 가능)
   */
  const handleGoogleLogin = async (): Promise<void> => {
    try {
      window.location.href = GOOGLE_AUTH_URL;
    } catch (error) {
      setErrorMessage("구글 로그인에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div style={{ padding: "0 10px" }}>
      <Header1 text="요기조기" line={false} />
      <Container>
        <Title>로그인</Title>
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <StyledInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              required
            />
            {email && (
              <ClearIcon onClick={clearEmail}>
                <CgCloseO />
              </ClearIcon>
            )}
          </InputWrapper>
          <PasswordWrapper>
            <StyledInput
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              required
            />
            {password && (
              <ClearIconPassword onClick={clearPassword}>
                <CgCloseO />
              </ClearIconPassword>
            )}
            <ShowPasswordIcon onClick={togglePasswordVisibility}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </ShowPasswordIcon>
          </PasswordWrapper>
          {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
          <StyledButton primary type="submit">
            로그인
          </StyledButton>
        </Form>
        <Horizontal />
        <StyledButton kakao onClick={handleKakaoLogin}>
          <RiKakaoTalkFill size={24} />
          &nbsp;카카오로 3초 만에 시작하기
        </StyledButton>
        <StyledButton google onClick={handleGoogleLogin}>
          <FcGoogle size={24} />
          &nbsp;구글 로그인
        </StyledButton>
        <Links>
          <StyledLink to="/login/find-pw">비밀번호 찾기</StyledLink>
          <Divider>|</Divider>
          <StyledLink to="/signup">회원가입</StyledLink>
        </Links>
      </Container>
    </div>
  );
};

export default LoginPage;

// 스타일 컴포넌트 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 5px;
  margin: auto;
`;

const Form = styled.form`
  width: 100%;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin: 90px 0;
  color: var(--color-dark2);
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  background-color: #f9f9f9;
  color: #333;
  box-sizing: border-box;

  &::placeholder {
    color: #bbb;
  }
`;

const ShowPasswordIcon = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #777;
`;

const ClearIcon = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #bbb;
`;

const ClearIconPassword = styled(ClearIcon)`
  right: 45px;
`;

const Horizontal = styled.div`
  height: 1px;
  width: 100%;
  background-color: #ccc;
  margin: 20px;
`;

const StyledButton = styled.button<{
  primary?: boolean;
  kakao?: boolean;
  google?: boolean;
}>`
  width: 100%;
  padding: 15px;
  margin-bottom: 10px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  color: ${({ kakao, google }) => (kakao || google ? "#333" : "#fff")};
  background-color: ${({ primary, kakao, google }) =>
    primary ? "#005e30" : kakao ? "#ffe812" : google ? "#fff" : "#ddd"};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;

  &:hover {
    opacity: 0.9;
  }

  ${({ kakao, google }) =>
    (kakao || google) &&
    `
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`;

const Links = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const StyledLink = styled(Link)`
  font-size: 14px;
  color: #555;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Divider = styled.span`
  margin: 0 10px;
  color: #ccc;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
`;
