// src/screen/Auth/FindPasswordEmailPage.tsx
import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { HiArrowLeft, HiPencil } from "react-icons/hi2";
import Input from "../../components/Input/Input";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
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

const HeaderTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-family: "Pretendard-Bold";
  margin-right: 44px;
`;

const Card = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.5s ease 0.1s backwards;
`;

const Title = styled.h2`
  font-size: 24px;
  font-family: "Pretendard-Bold";
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: var(--color-dark1);
  line-height: 1.6;
  margin-bottom: 28px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 13px;
  font-family: "Pretendard-SemiBold";
  margin-bottom: 8px;
  margin-top: 20px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
`;

const InputFlex = styled.div`
  flex: 1;
  position: relative;
`;

const TimerBadge = styled.span`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: var(--color-main);
`;

const SubmittedEmail = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: #f8f9fa;
  border-radius: 12px;
`;

const EditButton = styled.button`
  display: flex;
  align-items: center;
  gap: 4px;
  background: none;
  border: none;
  color: var(--color-main);
  cursor: pointer;
`;

const PrimaryButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${(p) =>
    p.disabled
      ? "#e5e5e5"
      : "linear-gradient(135deg, var(--color-main), var(--color-main-darker))"};
  color: ${(p) => (p.disabled ? "#999" : "white")};
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-family: "Pretendard-Bold";
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  margin-top: 24px;
  min-height: 52px;
`;

const SecondaryButton = styled.button<{ disabled?: boolean }>`
  padding: 12px 20px;
  background: white;
  color: var(--color-main);
  border: 2px solid var(--color-main);
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  flex-shrink: 0;
`;

const ErrorMessage = styled.div`
  background: #fff5f5;
  color: var(--color-error);
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 10px;
  margin-top: 8px;
`;

const SuccessMessage = styled.div`
  background: #f0fdf4;
  color: #16a34a;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 10px;
  margin-top: 8px;
`;

const Spacer = styled.div<{ size?: number }>`
  height: ${(p) => p.size || 20}px;
`;

const FindPasswordEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [realCode, setRealCode] = useState("");
  const [isSent, setIsSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(180);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isSent && timer > 0 && !isVerified) {
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0 && isSent && !isVerified) {
      setError("인증 시간이 만료되었습니다.");
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isSent, timer, isVerified]);

  const handleSend = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("올바른 이메일 형식이 아닙니다.");
      return;
    }
    const mockCode = String(Math.floor(100000 + Math.random() * 900000));
    setRealCode(mockCode);
    setIsSent(true);
    setTimer(180);
    setSuccess("인증번호가 발송되었습니다.");
    setError(null);
  };

  const handleVerify = () => {
    if (code === realCode) {
      setIsVerified(true);
      setSuccess("이메일 인증이 완료되었습니다.");
      setError(null);
    } else {
      setError("인증번호가 일치하지 않습니다.");
    }
  };

  const handleReset = () => {
    setIsSent(false);
    setIsVerified(false);
    setCode("");
    setError(null);
    setSuccess(null);
    setTimer(180);
  };

  return (
    <PageWrapper>
      <BackgroundDecoration />
      <ContentWrapper>
        <Header>
          <BackButton to="/login/find-pw">
            <HiArrowLeft size={22} />
          </BackButton>
          <HeaderTitle>비밀번호 찾기</HeaderTitle>
        </Header>
        <Card>
          <Title>이메일 인증</Title>
          <SubTitle>가입 시 등록한 이메일 주소를 입력해주세요.</SubTitle>

          <InputLabel>이메일</InputLabel>
          {isSent ? (
            <SubmittedEmail>
              <span>{email}</span>
              <EditButton onClick={handleReset}>
                <HiPencil /> 수정
              </EditButton>
            </SubmittedEmail>
          ) : (
            <InputRow>
              <InputFlex>
                <Input
                  type="email"
                  height={50}
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  hasError={!!error && !isSent}
                />
              </InputFlex>
              <SecondaryButton onClick={handleSend}>
                인증번호 받기
              </SecondaryButton>
            </InputRow>
          )}

          {isSent && !isVerified && (
            <>
              <Spacer size={24} />
              <InputLabel>인증번호</InputLabel>
              <InputRow>
                <InputFlex>
                  <Input
                    type="text"
                    height={50}
                    placeholder="인증번호 6자리"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                  />
                  <TimerBadge>
                    {Math.floor(timer / 60)}:
                    {String(timer % 60).padStart(2, "0")}
                  </TimerBadge>
                </InputFlex>
                <SecondaryButton onClick={handleVerify}>
                  인증하기
                </SecondaryButton>
              </InputRow>
            </>
          )}

          {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}
          {success && <SuccessMessage>✓ {success}</SuccessMessage>}

          <PrimaryButton
            onClick={() =>
              navigate("/login/find-pw/set-new-password", {
                state: { method: "email", identifier: email },
              })
            }
            disabled={!isVerified}
          >
            {isVerified ? "다음" : "인증을 완료해주세요"}
          </PrimaryButton>
        </Card>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default FindPasswordEmailPage;
