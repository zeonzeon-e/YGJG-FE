import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { CgCloseO } from "react-icons/cg";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import axios, { AxiosResponse } from "axios";
import Header1 from "../../component/Header/Header1/Header1";

const LoginPage: React.FC = () => {
  // 상태 값에 타입을 명시적으로 지정
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // 카카오와 구글의 OAuth 엔드포인트 및 클라이언트 ID를 설정
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=YOUR_KAKAO_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI`;
  const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=email%20profile`;

  const togglePasswordVisibility = (): void => {
    setShowPassword(!showPassword);
  };

  const clearEmail = (): void => {
    setEmail("");
  };

  const clearPassword = (): void => {
    setPassword("");
  };

  /**
   * 로그인 폼이 제출될 때 호출되는 함수
   * @param {React.FormEvent} e - 폼 제출 이벤트
   */
  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지

    // 서버로 전송할 데이터 객체의 타입을 지정
    const loginData: { email: string; password: string } = {
      email: email,
      password: password,
    };

    try {
      // 서버로 POST 요청 보내기 (예시로 JSONPlaceholder 사용)
      const response: AxiosResponse<{ id: number }> = await axios.post(
        "https://jsonplaceholder.typicode.com/posts",
        loginData
      );

      if (response.status === 200 || response.status === 201) {
        // 요청이 성공한 경우 처리 (예: 사용자 대시보드로 리디렉션)
        console.log("로그인 성공", response.data);
      } else {
        // 요청이 실패한 경우 처리 (예: 오류 메시지 표시)
        console.error("로그인 실패");
      }
    } catch (error) {
      // 네트워크 오류 등의 예외 처리
      console.error("서버와의 통신 오류:", error);
    }
  };

  /**
   * 카카오 로그인 버튼 클릭 시 OAuth 인증 페이지로 이동
   */
  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_URL;
  };

  /**
   * 구글 로그인 버튼 클릭 시 OAuth 인증 페이지로 이동
   */
  const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div>
      <Header1 text="요기조기" line={false} />
      <Container>
        <Title>로그인</Title>
        {/* 로그인 폼 */}
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <StyledInput
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="휴대폰 번호 또는 이메일"
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
              {showPassword ? <FaEyeSlash /> : <FaEye />}
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
          <StyledLink to="/forgot-password">비밀번호 찾기</StyledLink>
          <Divider>|</Divider>
          <StyledLink to="/signup">회원가입</StyledLink>
        </Links>
      </Container>
    </div>
  );
};

export default LoginPage;

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
  color: #333;
`;

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 10px;
`;

const PasswordWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 50px;
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
  right: 45px; // 비밀번호 보이기 아이콘의 위치를 고려하여 오른쪽으로 더 이동
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
    [kakao, google] &&
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
