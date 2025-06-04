// src/screen/Auth/FindPasswordPhonePage.tsx
import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Header2 from "../../components/Header/Header2/Header2";
import MainButton from "../../components/Button/MainButton";
import Input from "../../components/Input/Input"; // Input 컴포넌트 경로 확인 필요
// import apiClient from "../../api/apiClient"; // 실제 API 연동 시 필요

const Wrapper = styled.div`
  margin: 0px 10px;
  padding: 0px 10px; /* SignUpPage의 Container 패딩과 유사하게 적용 */
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  /* padding: 0px 10px; */ /* Wrapper로 이동 */
  margin: auto;
`;

const Title = styled.h2`
  font-size: 20px; /* SignUpPage의 Title과 유사하게 */
  font-weight: bold;
  margin: 40px 0 20px 0; /* 상단 여백 조정 */
  color: #333;
  text-align: center; /* 중앙 정렬 */
  width: 100%; /* 부모 요소에 맞게 너비 설정 */
`;

const SubTitle = styled.p`
  color: #555; /* SignUpPage의 SubTitle과 유사하게 */
  margin-bottom: 30px; /* Input과의 간격 */
  font-size: 14px;
  text-align: center;
  line-height: 1.5;
  width: 100%;
`;

const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;

const ButtonGroup = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const TimerText = styled.p`
  font-size: 14px;
  color: var(--color-main);
  margin-top: 8px;
  text-align: right;
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
  width: 100%;
`;

const SuccessMessage = styled.p`
  color: var(--color-success); /* index.css의 --color-success 사용 */
  font-size: 12px;
  margin-top: 5px;
  text-align: left;
  width: 100%;
`;

const FindPasswordPhonePage: React.FC = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [realVerificationCode, setRealVerificationCode] = useState(""); // 실제로는 API 응답
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [timer, setTimer] = useState(180); // 3분 타이머
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isCodeSent && timer > 0 && !isVerified) {
      timerIntervalRef.current = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0 || isVerified) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [isCodeSent, timer, isVerified]);

  const formatPhoneNumber = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "");
    let formattedNumber = "";
    if (numbersOnly.length <= 3) {
      formattedNumber = numbersOnly;
    } else if (numbersOnly.length <= 7) {
      formattedNumber = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
    } else {
      formattedNumber = `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(
        3,
        7
      )}-${numbersOnly.slice(7, 11)}`;
    }
    return formattedNumber;
  };

  const handleRequestCode = async () => {
    if (!/^\d{3}-\d{3,4}-\d{4}$/.test(phone)) {
      setError("올바른 휴대폰 번호 형식이 아닙니다.");
      setSuccess(null);
      return;
    }
    setError(null);
    // try {
    //   // 실제 API 호출: await apiClient.post('/api/auth/send-sms-verification', { phone });
    //   const mockCode = "123456"; // 임시 인증번호
    //   setRealVerificationCode(mockCode);
    //   setIsCodeSent(true);
    //   setTimer(180); // 타이머 리셋
    //   setSuccess("인증번호가 발송되었습니다.");
    //   console.log(`인증번호 [${mockCode}]가 ${phone}으로 발송되었습니다.`);
    // } catch (err) {
    //   setError("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
    //   setSuccess(null);
    // }
    // UI 테스트를 위한 임시 코드
    const mockCode = String(Math.floor(100000 + Math.random() * 900000));
    setRealVerificationCode(mockCode);
    setIsCodeSent(true);
    setTimer(180);
    setSuccess(`인증번호가 발송되었습니다: ${mockCode}`); // 개발 중에만 보이도록
    setError(null);
    console.log(`인증번호 [${mockCode}]가 ${phone}으로 발송되었습니다.`);
  };

  const handleVerifyCode = () => {
    if (timer === 0) {
      setError("인증 시간이 만료되었습니다. 인증번호를 다시 요청해주세요.");
      setSuccess(null);
      setIsCodeSent(false); // 재요청 가능하도록
      return;
    }
    if (verificationCode === realVerificationCode) {
      setIsVerified(true);
      setSuccess("휴대폰 인증이 완료되었습니다.");
      setError(null);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    } else {
      setError("인증번호가 일치하지 않습니다.");
      setSuccess(null);
    }
  };

  const handleNext = () => {
    if (isVerified) {
      navigate("/login/find-pw/set-new-password", {
        state: { method: "phone", identifier: phone },
      });
    } else {
      setError("휴대폰 인증을 먼저 완료해주세요.");
      setSuccess(null);
    }
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
            placeholder="휴대폰 번호 (- 없이 입력)"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            disabled={isCodeSent || isVerified}
          />
        </InputGroup>
        {!isCodeSent && (
          <ButtonGroup>
            <MainButton
              height={50}
              onClick={handleRequestCode}
              disabled={isCodeSent || isVerified || !phone}
            >
              인증번호 받기
            </MainButton>
          </ButtonGroup>
        )}

        {isCodeSent && !isVerified && (
          <>
            <InputGroup>
              <Input
                type="text"
                height={50}
                placeholder="인증번호 입력"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
              {timer > 0 && (
                <TimerText>
                  남은 시간: {Math.floor(timer / 60)}:
                  {String(timer % 60).padStart(2, "0")}
                </TimerText>
              )}
            </InputGroup>
            <ButtonGroup>
              <MainButton height={50} onClick={handleVerifyCode}>
                인증하기
              </MainButton>
            </ButtonGroup>
          </>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <ButtonGroup style={{ marginTop: isVerified ? "20px" : "80px" }}>
          {" "}
          {/* 하단 여백 확보 */}
          <MainButton height={50} onClick={handleNext} disabled={!isVerified}>
            다음
          </MainButton>
        </ButtonGroup>
      </Container>
    </Wrapper>
  );
};

export default FindPasswordPhonePage;
