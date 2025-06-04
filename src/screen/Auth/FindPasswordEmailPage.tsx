// src/screen/Auth/FindPasswordEmailPage.tsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header2 from "../../components/Header/Header2/Header2";
import MainButton from "../../components/Button/MainButton";
import Input from "../../components/Input/Input";
// import apiClient from "../../api/apiClient"; // 실제 API 연동 시 필요

const Wrapper = styled.div`
  margin: 0px 10px;
  padding: 0px 10px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin: 40px 0 20px 0;
  color: #333;
  text-align: center;
  width: 100%;
`;

const SubTitle = styled.p`
  color: #555;
  margin-bottom: 30px;
  font-size: 14px;
  text-align: center;
  line-height: 1.5;
  width: 100%;
`;

const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 5px; /* 다음 요소와의 간격을 위해 약간 줄임 */
  position: relative;
`;

const MessageBase = styled.p`
  font-size: 12px;
  margin-top: 6px;
  text-align: left;
  width: 100%;
  padding-left: 2px;
  min-height: 1.2em; /* 메시지 공간 확보 */
`;

const ErrorMessage = styled(MessageBase)`
  color: var(--color-error);
`;

const SuccessMessage = styled(MessageBase)`
  color: var(--color-success);
`;

const ButtonGroup = styled.div`
  width: 100%;
  margin-top: 15px; /* InputGroup과의 간격 */
`;

const TimerText = styled.p`
  font-size: 14px;
  color: var(--color-main);
  margin-top: 8px;
  text-align: right;
  width: 100%;
`;

const FindPasswordEmailPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [realVerificationCode, setRealVerificationCode] = useState(""); // 실제로는 API 응답

  const [isEmailSent, setIsEmailSent] = useState(false); // 인증번호 포함 이메일 발송 여부
  const [isVerified, setIsVerified] = useState(false); // OTP 인증 완료 여부

  const [timer, setTimer] = useState(180); // 3분 타이머
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 메시지 및 테두리 상태
  const [emailInputError, setEmailInputError] = useState<string | null>(null);
  const [otpInputError, setOtpInputError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null); // 이메일 발송 성공 등 일반 메시지

  const [showEmailErrorBorder, setShowEmailErrorBorder] = useState(false);
  const [showEmailSuccessBorder, setShowEmailSuccessBorder] = useState(false);
  const [showOtpErrorBorder, setShowOtpErrorBorder] = useState(false);
  // const [showOtpSuccessBorder, setShowOtpSuccessBorder] = useState(false); // OTP 성공은 isVerified로 처리

  useEffect(() => {
    if (isEmailSent && timer > 0 && !isVerified) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 || isVerified) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (timer === 0 && !isVerified && isEmailSent) {
        setOtpInputError("인증 시간이 만료되었습니다. 다시 시도해주세요.");
        setShowOtpErrorBorder(true);
        // setIsEmailSent(false); // 주석 처리: 인증번호 재요청을 위해 이메일 입력은 유지
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isEmailSent, timer, isVerified]);

  const validateEmail = (emailToValidate: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailToValidate);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailInputError(null);
    setShowEmailErrorBorder(false);
    setShowEmailSuccessBorder(false);
    setStatusMessage(null);
    // 만약 이메일 수정 시 OTP 관련 상태 초기화
    if (isEmailSent) {
      setIsEmailSent(false);
      setIsVerified(false);
      setVerificationCode("");
      setOtpInputError(null);
      setShowOtpErrorBorder(false);
      setTimer(180);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const handleSendVerificationEmail = async () => {
    if (!validateEmail(email)) {
      setEmailInputError("올바른 이메일 형식이 아닙니다.");
      setShowEmailErrorBorder(true);
      setShowEmailSuccessBorder(false);
      setStatusMessage(null);
      return;
    }
    setEmailInputError(null);
    setShowEmailErrorBorder(false);

    // --- UI 테스트를 위한 임시 API 호출 로직 ---
    console.log(`인증번호 발송 이메일: ${email}`);
    const mockCode = String(Math.floor(100000 + Math.random() * 900000));
    setRealVerificationCode(mockCode);
    setIsEmailSent(true);
    setTimer(180); // 타이머 리셋
    setStatusMessage(
      `인증번호가 포함된 이메일이 발송되었습니다. (테스트용 코드: ${mockCode})`
    );
    setShowEmailSuccessBorder(true); // 이메일 입력창 성공 테두리

    // OTP 관련 필드 초기화
    setVerificationCode("");
    setOtpInputError(null);
    setShowOtpErrorBorder(false);
    setIsVerified(false);

    /* // 실제 API 호출 로직 예시
    try {
      // const response = await apiClient.post('/api/auth/send-email-otp', { email });
      // setRealVerificationCode(response.data.otp); // 가정
      setIsEmailSent(true);
      setTimer(180);
      setStatusMessage("인증번호가 포함된 이메일이 발송되었습니다.");
      setShowEmailSuccessBorder(true);
      // OTP 관련 필드 초기화...
    } catch (err) {
      setEmailInputError("인증 메일 발송에 실패했습니다. 다시 시도해주세요.");
      setShowEmailErrorBorder(true);
      setShowEmailSuccessBorder(false);
      setStatusMessage(null);
    }
    */
  };

  const handleVerifyCode = () => {
    if (timer === 0) {
      setOtpInputError("인증 시간이 만료되었습니다. 다시 시도해주세요.");
      setShowOtpErrorBorder(true);
      // setIsEmailSent(false); // 재요청을 위해 이메일 입력은 유지
      return;
    }
    if (verificationCode === realVerificationCode) {
      setIsVerified(true);
      setOtpInputError(null); // 성공 시 에러 메시지 제거
      setShowOtpErrorBorder(false);
      setStatusMessage("이메일 인증이 완료되었습니다."); // 상태 메시지를 OTP 성공으로 변경
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    } else {
      setOtpInputError("인증번호가 일치하지 않습니다.");
      setShowOtpErrorBorder(true);
    }
  };

  const handleNext = () => {
    if (isVerified) {
      navigate("/login/find-pw/set-new-password", {
        state: { method: "email", identifier: email },
      });
    } else {
      // 이 경우는 보통 버튼이 비활성화 되어야 함
      setOtpInputError("이메일 인증을 먼저 완료해주세요.");
      setShowOtpErrorBorder(true);
    }
  };

  return (
    <Wrapper>
      <Header2 text="비밀번호 찾기" />
      <Container>
        <Title>이메일을 입력하여 주세요</Title>
        <SubTitle>가입 시 등록한 이메일 주소를 입력해주세요.</SubTitle>

        <InputGroup>
          <Input
            type="email"
            height={50}
            placeholder="이메일 주소 입력"
            value={email}
            onChange={handleEmailChange}
            disabled={isEmailSent && !isVerified} // 이메일 발송 후 & 인증 전까지 비활성화
            hasError={showEmailErrorBorder}
            hasSuccess={showEmailSuccessBorder && !showEmailErrorBorder}
          />
          {emailInputError && <ErrorMessage>{emailInputError}</ErrorMessage>}
          {statusMessage && !emailInputError && (
            <SuccessMessage>{statusMessage}</SuccessMessage>
          )}
          {/* 초기 상태 또는 메시지 없을 때 공간 유지 */}
          {!emailInputError && !statusMessage && <MessageBase> </MessageBase>}
        </InputGroup>

        {!isEmailSent && (
          <ButtonGroup>
            <MainButton
              height={50}
              onClick={handleSendVerificationEmail}
              disabled={!email || isEmailSent}
            >
              이메일로 인증번호 받기
            </MainButton>
          </ButtonGroup>
        )}

        {isEmailSent && !isVerified && (
          <>
            <InputGroup style={{ marginTop: "20px" }}>
              <Input
                type="text"
                height={50}
                placeholder="인증번호 입력"
                value={verificationCode}
                onChange={(e) => {
                  setVerificationCode(e.target.value);
                  if (otpInputError) {
                    setOtpInputError(null);
                    setShowOtpErrorBorder(false);
                  }
                }}
                maxLength={6}
                disabled={isVerified}
                hasError={showOtpErrorBorder}
                // hasSuccess={isVerified} // 인증 성공 시 OTP 입력창을 초록색으로 할 수도 있음
              />
              {otpInputError && <ErrorMessage>{otpInputError}</ErrorMessage>}
              {!otpInputError && <MessageBase> </MessageBase>} {/* 공간 유지 */}
              {timer > 0 && (
                <TimerText>
                  남은 시간: {Math.floor(timer / 60)}:
                  {String(timer % 60).padStart(2, "0")}
                </TimerText>
              )}
            </InputGroup>
            <ButtonGroup>
              <MainButton
                height={50}
                onClick={handleVerifyCode}
                disabled={isVerified || !verificationCode}
              >
                인증하기
              </MainButton>
            </ButtonGroup>
          </>
        )}

        <ButtonGroup style={{ marginTop: isVerified ? "20px" : "80px" }}>
          <MainButton height={50} onClick={handleNext} disabled={!isVerified}>
            다음
          </MainButton>
        </ButtonGroup>
      </Container>
    </Wrapper>
  );
};

export default FindPasswordEmailPage;
