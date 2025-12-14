// src/screen/Auth/FindPasswordPhonePage.tsx
import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import Input from "../../components/Input/Input";
import apiClient from "../../api/apiClient";

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

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/* ========== Page Layout ========== */
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8faf9 0%, #e8f5e9 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  padding-top: 40px;
  position: relative;
  overflow-x: hidden;
`;

const BackgroundDecoration = styled.div`
  position: fixed;
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
  pointer-events: none;
`;

const BackgroundCircle = styled.div`
  position: fixed;
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
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 1;
`;

/* ========== Header ========== */
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
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const HeaderTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  margin-right: 44px;
`;

/* ========== Card ========== */
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
  color: var(--color-dark2);
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: var(--color-dark1);
  line-height: 1.6;
  margin-bottom: 28px;
`;

/* ========== Form Elements ========== */
const InputLabel = styled.label`
  display: block;
  font-size: 13px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2);
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
  font-family: "Pretendard-SemiBold";
  color: var(--color-main);
`;

/* ========== Buttons ========== */
const PrimaryButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${(props) =>
    props.disabled
      ? "#e5e5e5"
      : "linear-gradient(135deg, var(--color-main) 0%, var(--color-main-darker) 100%)"};
  color: ${(props) => (props.disabled ? "#999" : "white")};
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-family: "Pretendard-Bold";
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  margin-top: 24px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 98, 68, 0.3);
  }
`;

const SecondaryButton = styled.button<{ disabled?: boolean }>`
  padding: 12px 20px;
  background: ${(props) => (props.disabled ? "#f5f5f5" : "white")};
  color: ${(props) => (props.disabled ? "#999" : "var(--color-main)")};
  border: 2px solid
    ${(props) => (props.disabled ? "#e5e5e5" : "var(--color-main)")};
  border-radius: 12px;
  font-size: 14px;
  font-family: "Pretendard-SemiBold";
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  flex-shrink: 0;
  white-space: nowrap;

  &:hover:not(:disabled) {
    background: var(--color-subtle);
  }
`;

const ResendLink = styled.button`
  background: none;
  border: none;
  color: var(--color-main);
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  margin-top: 8px;

  &:disabled {
    color: #999;
    text-decoration: none;
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

/* ========== Messages ========== */
const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff5f5;
  color: var(--color-error);
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 10px;
  margin-top: 8px;

  &::before {
    content: "⚠️";
    font-size: 14px;
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #f0fdf4;
  color: #16a34a;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 10px;
  margin-top: 8px;

  &::before {
    content: "✓";
    font-size: 14px;
  }
`;

const Spacer = styled.div<{ size?: number }>`
  height: ${(props) => props.size || 20}px;
`;

const FindPasswordPhonePage: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [timer, setTimer] = useState(180);
  const [resendCooldown, setResendCooldown] = useState(0);

  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const resendCooldownRef = useRef<NodeJS.Timeout | null>(null);

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
      setTimer(180);
      setResendCooldown(60);
      setSuccessMessage("인증번호가 발송되었습니다.");
    } catch (err) {
      console.error("인증번호 발송 실패:", err);
      setPhoneError("인증번호 발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (timer === 0) {
      setOtpError("인증 시간이 만료되었습니다.");
      return;
    }
    setIsVerifying(true);
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
      setIsVerifying(false);
    }
  };

  const handleNext = () => {
    if (isVerified) {
      navigate("/login/find-pw/set-new-password", {
        state: { method: "phone", identifier: phone },
      });
    }
  };

  return (
    <PageWrapper>
      <BackgroundDecoration />
      <BackgroundCircle />

      <ContentWrapper>
        <Header>
          <BackButton to="/login/find-pw">
            <HiArrowLeft size={22} />
          </BackButton>
          <HeaderTitle>비밀번호 찾기</HeaderTitle>
        </Header>

        <Card>
          <Title>휴대폰 인증</Title>
          <SubTitle>
            가입 시 등록한 휴대폰 번호를 입력해주세요.
            <br />
            인증번호를 발송해드립니다.
          </SubTitle>

          <InputLabel>휴대폰 번호</InputLabel>
          <InputRow>
            <InputFlex>
              <Input
                type="tel"
                height={50}
                placeholder="010-0000-0000"
                value={phone}
                onChange={handlePhoneChange}
                disabled={isVerified}
                hasError={!!phoneError}
                hasSuccess={isVerified}
              />
            </InputFlex>
            {!isCodeSent && (
              <SecondaryButton
                onClick={handleRequestCode}
                disabled={isLoading || phone.length < 12}
              >
                {isLoading ? "발송중..." : "인증번호 받기"}
              </SecondaryButton>
            )}
          </InputRow>
          {phoneError && <ErrorMessage>{phoneError}</ErrorMessage>}

          {isCodeSent && !isVerified && (
            <>
              <Spacer size={24} />
              <InputLabel>인증번호</InputLabel>
              <InputRow>
                <InputFlex>
                  <Input
                    type="text"
                    height={50}
                    placeholder="인증번호 4자리"
                    value={verificationCode}
                    onChange={(e) => {
                      setVerificationCode(e.target.value);
                      if (otpError) setOtpError(null);
                    }}
                    maxLength={4}
                    hasError={!!otpError}
                  />
                  <TimerBadge>
                    {Math.floor(timer / 60)}:
                    {String(timer % 60).padStart(2, "0")}
                  </TimerBadge>
                </InputFlex>
                <SecondaryButton
                  onClick={handleVerifyCode}
                  disabled={isVerifying || verificationCode.length < 4}
                >
                  {isVerifying ? "확인중..." : "인증하기"}
                </SecondaryButton>
              </InputRow>
              <ResendLink
                onClick={handleRequestCode}
                disabled={resendCooldown > 0 || isLoading}
              >
                {resendCooldown > 0
                  ? `재전송 (${resendCooldown}초)`
                  : "인증번호 재전송"}
              </ResendLink>
            </>
          )}

          {otpError && <ErrorMessage>{otpError}</ErrorMessage>}
          {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

          <PrimaryButton onClick={handleNext} disabled={!isVerified}>
            {isVerified ? "다음" : "인증을 완료해주세요"}
          </PrimaryButton>
        </Card>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default FindPasswordPhonePage;
