import React, { useState } from "react";
import styled from "styled-components";
import CheckBox from "../../components/CheckBox/CheckBox";
import Input from "../../components/Input/Input";
import MainButton from "../../components/Button/MainButton";
import ScrollProgress from "../../components/ScrollProgress/ScrollProgress";

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 500px;
  margin: auto;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const ButtonWrapper = styled.div`
  margin-top: 20px;
`;

// Step 1: 휴대폰 인증 컴포넌트
const PhoneVerification: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const handleVerify = () => {
    if (verificationCode === "1234") {
      onNext();
    } else {
      alert("인증번호가 일치하지 않습니다.");
    }
  };

  return (
    <Container>
      <Title>휴대폰 인증</Title>
      <Input
        type="text"
        placeholder="휴대폰 번호를 입력하세요"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <MainButton
        bgColor="#2c7a7b"
        onClick={() => console.log("인증번호 발송")}
      >
        인증번호 받기
      </MainButton>
      <Input
        type="text"
        placeholder="인증번호를 입력하세요"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
      />
      <MainButton bgColor="#2c7a7b" onClick={handleVerify}>
        인증하기
      </MainButton>
    </Container>
  );
};

// Step 2: 약관 동의 컴포넌트
const TermsAgreement: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [isAgreed, setIsAgreed] = useState(false);
  const content: [string, string][] = [
    ["서비스 이용자 동의", "내용1"],
    ["(필수) 서비스 이용에 필요한 필수 약관 동의", "내용2"],
    ["개인정보 수집/이용 동의", "내용3"],
    ["(필수) 개인정보 수집 및 이용 동의", "내용4"],
  ];

  return (
    <Container>
      <Title>약관 동의</Title>
      <CheckBox content={content} isToggle={true} isChecked={isAgreed} />
      <ButtonWrapper>
        <MainButton bgColor="#2c7a7b" onClick={() => setIsAgreed(true)}>
          전체 동의하기
        </MainButton>
      </ButtonWrapper>
      <MainButton bgColor="#2c7a7b" onClick={onNext}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 3: 개인정보 입력 컴포넌트
const PersonalInfo: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    if (password === confirmPassword) {
      onNext({ email, password });
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <Container>
      <Title>개인정보 입력</Title>
      <Input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Input
        type="password"
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <MainButton bgColor="#2c7a7b" onClick={handleSubmit}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 5: 회원가입 완료 컴포넌트
const SignupComplete: React.FC = () => {
  return (
    <Container>
      <Title>회원가입이 완료되었습니다!</Title>
      <MainButton bgColor="#2c7a7b">로그인 하러 가기</MainButton>
    </Container>
  );
};

// 전체 회원가입 페이지 컨테이너
const SignupPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [signupData, setSignupData] = useState<any>({});

  const handleNextStep = (data: any = {}) => {
    setSignupData({ ...signupData, ...data });
    setStep(step + 1);
  };

  return (
    <div>
      <ScrollProgress targetWidth={step * 20} />
      {step === 1 && <PhoneVerification onNext={() => handleNextStep()} />}
      {step === 2 && <TermsAgreement onNext={() => handleNextStep()} />}
      {step === 3 && <PersonalInfo onNext={handleNextStep} />}
      {step === 5 && <SignupComplete />}
    </div>
  );
};

export default SignupPage;
