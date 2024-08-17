import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { RiKakaoTalkFill } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import Header1 from "../../component/Header/Header1/Header1";

/**
 * LoginPage 컴포넌트 - 사용자가 로그인할 수 있는 페이지를 표시
 * @returns {JSX.Element} LoginPage 컴포넌트
 */
const LoginPage: React.FC = () => {
  // 비밀번호 입력란의 비밀번호 보이기/숨기기를 제어하는 상태
  const [showPassword, setShowPassword] = useState(false);

  /**
   * 비밀번호 보이기/숨기기 상태를 토글하는 함수
   */
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      {/* 페이지 상단에 있는 헤더 컴포넌트 */}
      <Header1 text="요기조기" line={false} />
      <Container>
        <Title>로그인</Title>
        {/* 사용자 이메일 또는 휴대폰 번호 입력 필드 */}
        <StyledInput placeholder="휴대폰 번호 또는 이메일" />
        {/* 비밀번호 입력 필드와 비밀번호 보이기/숨기기 아이콘을 포함하는 래퍼 */}
        <PasswordWrapper>
          <StyledInput
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
          />
          <ShowPasswordIcon onClick={togglePasswordVisibility}>
            {/* 비밀번호 보이기/숨기기 아이콘 - 상태에 따라 아이콘이 변경됨 */}
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </ShowPasswordIcon>
        </PasswordWrapper>
        {/* 로그인 버튼 */}
        <StyledButton primary>로그인</StyledButton>
        {/* 카카오 로그인 버튼 */}
        <StyledButton kakao>
          <RiKakaoTalkFill size={24} />
          &nbsp;카카오로 3초 만에 시작하기
        </StyledButton>
        {/* 구글 로그인 버튼 */}
        <StyledButton google>
          <FcGoogle size={24} />
          &nbsp;구글 로그인
        </StyledButton>
        {/* 비밀번호 찾기와 회원가입 링크 */}
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

// 스타일링된 컨테이너 - 중앙 정렬 및 패딩 설정
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 5px;
  margin: auto;
`;

// 페이지 제목 스타일링
const Title = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin: 90px 0;
  color: #333;
`;

// 공통 인풋 스타일링
const StyledInput = styled.input`
  width: 100%;
  padding: 15px;
  margin-bottom: 10px;
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

// 비밀번호 입력 필드를 포함하는 래퍼
const PasswordWrapper = styled.div`
  width: 100%;
  position: relative;
  margin-bottom: 50px;
`;

// 비밀번호 보이기/숨기기 아이콘 스타일링
const ShowPasswordIcon = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(calc(-50% - 4px)); // 아이콘 자체 높이 단차 보정
  cursor: pointer;
  font-size: 18px;
  color: #777;
`;

// 스타일링된 버튼 - 기본, 카카오, 구글에 따른 스타일링
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

// 비밀번호 찾기 및 회원가입 링크들을 포함하는 래퍼
const Links = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

// 스타일링된 Link 컴포넌트 - react-router-dom의 Link 사용
const StyledLink = styled(Link)`
  font-size: 14px;
  color: #555;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

// 링크 사이의 구분선
const Divider = styled.span`
  margin: 0 10px;
  color: #ccc;
`;
