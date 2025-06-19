// src/screen/Auth/FindPasswordPhonePage.tsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header2 from "../../components/Header/Header2/Header2";
import MainButton from "../../components/Button/MainButton";
import Input from "../../components/Input/Input";
import apiClient from "../../api/apiClient"; // 실제 API 연동

// --- Styled Components ---

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
  color: #333;
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

const ButtonGroup = styled.div`
  width: 100%;
  margin-top: 5px;
`;

const FixedButtonGroup = styled.div`
  position: absolute;
  bottom: 40px;
  left: 20px;
  right: 20px;
`;

// 재전송 버튼과 안내 문구를 위한 그룹
const ResendGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-top: 2px;
`;

// 재전송 버튼 (보조적인 형태로 스타일링)
const ResendButton = styled.button`
  background: none;
  border: none;
  color: var(--color-dark2);
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  padding: 2px 8px;

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

const FeedbackMessage = styled.p<{ type: "error" | "success" }>`
  font-size: 12px;
  margin-top: 8px;
  padding-left: 2px;
  width: 100%;
  min-height: 1.2em;
  color: ${(props) =>
    props.type === "error" ? "var(--color-error)" : "var(--color-success)"};
`;

const FindPasswordPhonePage: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 타이머 상태: 3분(인증 유효시간), 1분(재전송 쿨다운)
  const [timer, setTimer] = useState(180);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resendCooldownRef = useRef<NodeJS.Timeout | null>(null);

  // 인증 유효시간 타이머
  useEffect(() => {
    if (timer > 0 && isCodeSent && !isVerified) {
      timerRef.current = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0 && isCodeSent && !isVerified) {
      setOtpError("인증 시간이 만료되었습니다. 인증번호를 다시 요청해주세요.");
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timer, isCodeSent, isVerified]);

  // 재전송 쿨다운 타이머
  useEffect(() => {
    if (resendCooldown > 0) {
      resendCooldownRef.current = setInterval(
        () => setResendCooldown((t) => t - 1),
        1000
      );
    }
    return () => {
      if (resendCooldownRef.current) clearInterval(resendCooldownRef.current);
    };
  }, [resendCooldown]);

  // const formatPhoneNumber = (value: string) => {
  //   const numbers = value.replace(/\D/g, "");
  //   if (numbers.length > 11) return phone; // 11자리 초과 입력 방지
  //   return numbers.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  // };

  const formatPhoneNumber = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "");
    let formatted = "";
    if (numbersOnly.length > 3 && numbersOnly.length <= 7) {
      formatted = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    } else if (numbersOnly.length > 7) {
      formatted = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
        3,
        7
      )}-${numbersOnly.slice(7, 11)}`;
    } else {
      formatted = numbersOnly;
    }
    return formatted;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhoneNumber(e.target.value));
    if (phoneError) setPhoneError(null);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerificationCode(e.target.value);
    if (otpError) setOtpError(null);
  };

  // 인증번호 발송 함수
  const handleRequestCode = async () => {
    if (!/^\d{3}-\d{4}-\d{4}$/.test(phone)) {
      setPhoneError("올바른 휴대폰 번호 형식이 아닙니다.");
      return;
    }
    setIsLoading(true);
    setPhoneError(null);
    setSuccessMessage(null);

    try {
      const phoneNum = phone.replace(/\D/g, "");
      await apiClient.post(`/api/sign/send-sms?phoneNum=${phoneNum}`);
      setIsCodeSent(true);
      setTimer(180); // 3분 타이머 시작
      setResendCooldown(60); // 1분 재전송 쿨다운 시작
      setSuccessMessage("인증번호가 발송되었습니다.");
    } catch (err) {
      console.error("인증번호 발송 실패:", err);
      setPhoneError("인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  // 인증번호 확인 함수
  const handleVerifyCode = async () => {
    if (timer === 0) {
      setOtpError("인증 시간이 만료되었습니다.");
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.post(
        `/api/sign/verify?certificationNumber=${verificationCode}`
      );
      setIsVerified(true);
      setSuccessMessage("휴대폰 인증이 완료되었습니다.");
      setOtpError(null);
      if (timerRef.current) clearInterval(timerRef.current);
      if (resendCooldownRef.current) clearInterval(resendCooldownRef.current);
    } catch (err) {
      console.error("인증 실패:", err);
      setOtpError("인증번호가 일치하지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (isVerified) {
      navigate("/login/find-pw/set-new-password", {
        state: { method: "phone", identifier: phone },
      });
    }
  };

  const displayMessage = () => {
    if (phoneError)
      return <FeedbackMessage type="error">{phoneError}</FeedbackMessage>;
    if (otpError)
      return <FeedbackMessage type="error">{otpError}</FeedbackMessage>;
    if (successMessage)
      return <FeedbackMessage type="success">{successMessage}</FeedbackMessage>;
    return <FeedbackMessage type="success"> </FeedbackMessage>;
  };

  return (
    <Wrapper>
      <Header2 text="비밀번호 찾기" />
      <Container>
        <Title>휴대폰 인증을 해주세요</Title>
        <SubTitle>가입 시 등록한 휴대폰 번호를 입력해주세요.</SubTitle>

        <InputGroup>
          <Input
            type="tel"
            height={50}
            placeholder="휴대폰 번호 (숫자만 입력)"
            value={phone}
            onChange={handlePhoneChange}
            disabled={isVerified}
            hasError={!!phoneError}
          />
        </InputGroup>

        {!isCodeSent && (
          <ButtonGroup>
            <MainButton
              height={50}
              onClick={handleRequestCode}
              disabled={isLoading || !phone}
            >
              인증번호 받기
            </MainButton>
          </ButtonGroup>
        )}

        {isCodeSent && !isVerified && (
          <div style={{ width: "100%", marginTop: "24px" }}>
            <InputGroup>
              <Input
                type="text"
                height={50}
                placeholder="인증번호 입력"
                value={verificationCode}
                onChange={handleOtpChange}
                maxLength={4}
                hasError={!!otpError}
              />
              <TimerText>
                {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
              </TimerText>
            </InputGroup>
            <ResendGroup>
              <ResendButton
                onClick={handleRequestCode}
                disabled={resendCooldown > 0 || isLoading}
              >
                {resendCooldown > 0
                  ? `재전송 (${resendCooldown}초)`
                  : "인증번호 재전송"}
              </ResendButton>
            </ResendGroup>
            <ButtonGroup>
              <MainButton
                height={50}
                onClick={handleVerifyCode}
                disabled={
                  !verificationCode || verificationCode.length < 4 || isLoading
                }
              >
                인증하기
              </MainButton>
            </ButtonGroup>
          </div>
        )}

        {displayMessage()}

        <FixedButtonGroup>
          <MainButton height={50} onClick={handleNext} disabled={!isVerified}>
            다음
          </MainButton>
        </FixedButtonGroup>
      </Container>
    </Wrapper>
  );
};

export default FindPasswordPhonePage;
