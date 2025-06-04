import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Header2 from "../../components/Header/Header2/Header2";
import MainButton from "../../components/Button/MainButton";

const ChangePasswordPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePhoneVerification = async () => {
    setLoading(true);
    setError(null);

    try {
      // 예시 API 호출, 실제로는 여러분의 서버 URL로 대체하세요.
      const response = await fetch("/api/verify-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: "01012345678" }), // 실제로는 폼에서 값을 받아와야 합니다.
      });

      if (!response.ok) {
        throw new Error("휴대폰 인증에 실패했습니다.");
      }

      const data = await response.json();
      console.log(data); // 성공적으로 인증된 경우 처리

      // 인증 성공 시 이동할 페이지로 네비게이트 (예: 비밀번호 재설정 페이지)
      // navigate("/reset-password"); // 필요에 따라 네비게이션 추가
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header2 text="비밀번호 변경하기" />
      <Container>
        <Title>휴대폰 인증을 해주세요</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <MainButton onClick={handlePhoneVerification} disabled={loading}>
          {loading ? "인증 중..." : "휴대폰 인증하기"}
        </MainButton>
      </Container>
    </div>
  );
};

export default ChangePasswordPage;

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

const ErrorMessage = styled.p`
  color: red;
  margin-bottom: 20px;
`;
