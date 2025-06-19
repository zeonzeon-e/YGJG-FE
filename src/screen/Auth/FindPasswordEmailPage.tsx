// src/screen/Auth/FindPasswordEmailPage.tsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header2 from "../../components/Header/Header2/Header2";
import MainButton from "../../components/Button/MainButton";
import Input from "../../components/Input/Input";
// import apiClient from "../../api/apiClient";

// --- Styled Components (사용자 선호 스타일 기반으로 최종 수정) ---

const Wrapper = styled.div`
  position: relative;
  min-height: calc(100vh - 56px);
  padding: 0 10px 120px 10px;
  box-sizing: border-box;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 100px 0 20px 0;
  text-align: center;
`;

const SubTitle = styled.p`
  color: #555;
  margin-bottom: 80px;
  font-size: 14px;
  text-align: center;
  line-height: 1.5;
`;

const InputGroup = styled.div`
  width: 100%;
  position: relative;
`;

const SubmittedInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  padding: 0 16px;
  box-sizing: border-box;
  background-color: var(--color-light2);
  border: 1px solid var(--color-border);
  border-radius: 8px;
`;

const SubmittedInfoText = styled.p`
  font-size: 16px;
  color: var(--color-dark2);
`;

const EditLink = styled.button`
  background: none;
  border: none;
  color: var(--color-main);
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
`;

const ButtonGroup = styled.div`
  width: 100%;
  margin-top: 5px;
`;

const VerifyButtonGroup = styled.div`
  width: 100%;
  margin-top: 50px;
`;

const FixedButtonGroup = styled.div`
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 20px;
`;

// 피드백 메시지와 재전송 버튼을 한 줄에 배치하기 위한 Wrapper
const FeedbackActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-top: 8px;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: var(--color-dark2);
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  padding: 0 8px;
  white-space: nowrap; // 버튼 텍스트가 줄바꿈되지 않도록

  &:disabled {
    color: var(--color-border);
    cursor: not-allowed;
    text-decoration: none;
  }
`;

const TimerText = styled.p`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 14px;
  color: var(--color-main);
`;

const FeedbackMessage = styled.p<{ type: "error" | "success" | "info" }>`
  font-size: 12px;
  padding-left: 2px;
  min-height: 1.2em;
  color: ${(props) =>
    props.type === "error"
      ? "var(--color-error)"
      : props.type === "success"
      ? "var(--color-success)"
      : "var(--color-dark2)"};
`;

const FindPasswordEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [realVerificationCode, setRealVerificationCode] = useState("");

  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [timer, setTimer] = useState(180);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isEmailSent && timer > 0 && !isVerified) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (timer === 0 && !isVerified && isEmailSent) {
        setOtpError("인증 시간이 만료되었습니다. 다시 요청해주세요.");
      }
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isEmailSent, timer, isVerified]);

  const validateEmail = (emailToValidate: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToValidate);
  };

  const handleReset = () => {
    setIsEmailSent(false);
    setIsVerified(false);
    setVerificationCode("");
    setEmailError(null);
    setOtpError(null);
    setSuccessMessage(null);
    setTimer(180);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError(null);
  };

  const handleSendVerificationEmail = async () => {
    if (!validateEmail(email)) {
      setEmailError("올바른 이메일 형식이 아닙니다.");
      return;
    }
    setIsLoading(true);
    setEmailError(null);
    setOtpError(null);

    console.log(`인증번호 발송 이메일: ${email}`);
    const mockCode = String(Math.floor(100000 + Math.random() * 900000));
    setRealVerificationCode(mockCode);
    setIsEmailSent(true);
    setTimer(180);
    setSuccessMessage("인증번호가 포함된 이메일이 발송되었습니다.");
    setIsLoading(false);
  };

  const handleVerifyCode = () => {
    if (timer === 0) {
      setOtpError("인증 시간이 만료되었습니다.");
      return;
    }
    if (verificationCode === realVerificationCode) {
      setIsVerified(true);
      setOtpError(null);
      setSuccessMessage("이메일 인증이 완료되었습니다.");
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    } else {
      setOtpError("인증번호가 일치하지 않습니다.");
      setSuccessMessage(null);
    }
  };

  const handleNext = () => {
    if (isVerified) {
      navigate("/login/find-pw/set-new-password", {
        state: { method: "email", identifier: email },
      });
    }
  };

  const renderOtpFeedback = () => {
    if (otpError)
      return <FeedbackMessage type="error">{otpError}</FeedbackMessage>;
    if (successMessage && !isVerified)
      return <FeedbackMessage type="success">{successMessage}</FeedbackMessage>;
    return <FeedbackMessage type="info"> </FeedbackMessage>;
  };

  return (
    <Wrapper>
      <Header2 text="비밀번호 찾기" />
      <Container>
        <Title>이메일을 입력하여 주세요</Title>
        <SubTitle>가입 시 등록한 이메일 주소를 입력해주세요.</SubTitle>

        <InputGroup>
          {isEmailSent ? (
            <SubmittedInfoWrapper>
              <SubmittedInfoText>{email}</SubmittedInfoText>
              <EditLink onClick={handleReset}>수정</EditLink>
            </SubmittedInfoWrapper>
          ) : (
            <>
              <Input
                type="email"
                height={50}
                placeholder="이메일 주소 입력"
                value={email}
                onChange={handleEmailChange}
                disabled={isVerified}
                hasError={!!emailError}
              />
              {emailError && (
                <FeedbackMessage type="error">{emailError}</FeedbackMessage>
              )}
            </>
          )}
        </InputGroup>

        {!isEmailSent && (
          <ButtonGroup>
            <MainButton
              height={50}
              onClick={handleSendVerificationEmail}
              disabled={!email || isLoading}
            >
              이메일로 인증번호 받기
            </MainButton>
          </ButtonGroup>
        )}

        {isEmailSent && !isVerified && (
          <div style={{ width: "100%", marginTop: "24px" }}>
            <InputGroup>
              <Input
                type="text"
                height={50}
                placeholder="인증번호 6자리 입력"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                  if (otpError) setOtpError(null);
                }}
                maxLength={6}
                hasError={!!otpError}
              />
              <TimerText>
                {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
              </TimerText>
            </InputGroup>

            <FeedbackActionsWrapper>
              {renderOtpFeedback()}
              <ResendButton
                onClick={handleSendVerificationEmail}
                disabled={isLoading}
              >
                이메일 재전송
              </ResendButton>
            </FeedbackActionsWrapper>

            <VerifyButtonGroup>
              <MainButton
                height={50}
                onClick={handleVerifyCode}
                disabled={
                  !verificationCode || verificationCode.length < 6 || isLoading
                }
              >
                인증하기
              </MainButton>
            </VerifyButtonGroup>
          </div>
        )}

        {isVerified && successMessage && (
          <div style={{ width: "100%", marginTop: "8px" }}>
            <FeedbackMessage type="success">{successMessage}</FeedbackMessage>
          </div>
        )}

        <FixedButtonGroup>
          <MainButton height={50} onClick={handleNext} disabled={!isVerified}>
            다음
          </MainButton>
        </FixedButtonGroup>
      </Container>
    </Wrapper>
  );
};

export default FindPasswordEmailPage;
