// src/pages/LoginPage/LoginPage.tsx

import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { CgCloseO } from "react-icons/cg";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import axios, { AxiosResponse } from "axios";
import Header1 from "../../components/Header/Header1/Header1";
import { setAccessToken, setRefreshToken } from "../../utils/authUtils";

/**
 * 로그인 페이지 컴포넌트
 * @returns {JSX.Element} 로그인 페이지
 */
const LoginPage: React.FC = () => {
  // 상태 변수 설정
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const navigate = useNavigate();

  // OAuth 엔드포인트 URL
  const KAKAO_AUTH_URL = "/api/auth/kakao/get-url";
  const GOOGLE_AUTH_URL = "/api/auth/google/get-url";

  /**
   * 비밀번호 표시/숨기기 토글 함수
   * @returns {void}
   */
  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  /**
   * 이메일 입력값 초기화 함수
   * @returns {void}
   */
  const clearEmail = (): void => {
    setEmail("");
  };

  /**
   * 비밀번호 입력값 초기화 함수
   * @returns {void}
   */
  const clearPassword = (): void => {
    setPassword("");
  };

  /**
   * 메인 페이지로 이동하는 함수
   * @returns {void}
   */
  const goToMainPage = (): void => {
    navigate("/");
  };

  /**
   * 로그인 폼 제출 처리 함수
   * @param {React.FormEvent} e - 폼 제출 이벤트
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const loginData: { email: string; password: string } = {
      email: email,
      password: password,
    };

    try {
      const response: AxiosResponse = await axios.post(
        "/api/sign/sign-in",
        loginData
      );

      if (response.status === 200 || response.status === 201) {
        const { token, refreshToken } = response.data;
        setAccessToken(token);
        setRefreshToken(refreshToken);
        console.log("로그인 성공", response.data);
        goToMainPage();
      } else {
        console.error("로그인 실패");
      }
    } catch (error) {
      console.error("서버와의 통신 오류:", error);
    }
  };

  /**
   * 카카오 로그인 처리 함수
   * @returns {Promise<void>}
   */
  const handleKakaoLogin = async (): Promise<void> => {
    try {
      const response: AxiosResponse<{ kakaoUrl: string }> = await axios.get(
        KAKAO_AUTH_URL
      );
      window.location.href = response.data.kakaoUrl;
    } catch (error) {
      console.error("카카오 로그인 URL 가져오기 실패:", error);
    }
  };

  /**
   * 구글 로그인 처리 함수
   * @returns {Promise<void>}
   */
  const handleGoogleLogin = async (): Promise<void> => {
    try {
      const response: AxiosResponse<{ googleUrl: string }> = await axios.get(
        GOOGLE_AUTH_URL
      );
      window.location.href = response.data.googleUrl;
    } catch (error) {
      console.error("구글 로그인 URL 가져오기 실패:", error);
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
          <StyledButton primary type="submit">
            로그인
          </StyledButton>
        </Form>
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

/**
 * 컨테이너 스타일 컴포넌트
 * @type {StyledComponent}
 */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 5px;
  margin: auto;
`;

/**
 * 폼 스타일 컴포넌트
 * @type {StyledComponent}
 */
const Form = styled.form`
  width: 100%;
`;

/**
 * 제목 스타일 컴포넌트
 * @type {StyledComponent}
 */
const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin: 90px 0;
  color: var(--color-dark2);
`;

/**
 * 입력 래퍼 스타일 컴포넌트
 * @type {StyledComponent}
 */
const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

/**
 * 비밀번호 래퍼 스타일 컴포넌트
 * @type {StyledComponent}
 */
const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 50px;
`;

/**
 * 입력 필드 스타일 컴포넌트
 * @type {StyledComponent}
 */
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

/**
 * 비밀번호 표시 아이콘 스타일 컴포넌트
 * @type {StyledComponent}
 */
const ShowPasswordIcon = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #777;
`;

/**
 * 입력 필드 초기화 아이콘 스타일 컴포넌트
 * @type {StyledComponent}
 */
const ClearIcon = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #bbb;
`;

/**
 * 비밀번호 입력 필드 초기화 아이콘 스타일 컴포넌트
 * @type {StyledComponent}
 */
const ClearIconPassword = styled(ClearIcon)`
  right: 45px;
`;

/**
 * 버튼 스타일 컴포넌트
 * @param {object} props - 버튼 속성
 * @returns {StyledComponent} 스타일된 버튼 컴포넌트
 */
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
    [kakao, google] &&
    `
    display: flex;
    align-items: center;
    justify-content: center;
  `}
`;

/**
 * 링크 래퍼 스타일 컴포넌트
 * @type {StyledComponent}
 */
const Links = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

/**
 * 스타일된 링크 컴포넌트
 * @type {StyledComponent}
 */
const StyledLink = styled(Link)`
  font-size: 14px;
  color: #555;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

/**
 * 구분자 스타일 컴포넌트
 * @type {StyledComponent}
 */
const Divider = styled.span`
  margin: 0 10px;
  color: #ccc;
`;
