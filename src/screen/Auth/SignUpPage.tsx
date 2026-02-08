import React, { useState, useRef, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import CheckBox from "../../components/CheckBox/CheckBox";
import Input from "../../components/Input/Input";
import ScrollProgress from "../../components/ScrollProgress/ScrollProgress";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiArrowLeft, HiCheckCircle } from "react-icons/hi2";
import RadioButton from "../../components/Button/RadioButton";
import KakaoMapModal from "../../components/Modal/KakaoAddress";
import apiClient from "../../api/apiClient";
import { useToastStore } from "../../stores/toastStore";

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

const slideInRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
`;

// pulse keyframe removed - unused

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/* ========== Page Wrapper & Background ========== */
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

const HeaderInfo = styled.div`
  flex: 1;
  text-align: center;
  margin-right: 44px;
`;

const StepIndicator = styled.span`
  font-size: 13px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-main);
`;

/* ========== Progress Bar ========== */
const ProgressContainer = styled.div`
  margin-bottom: 28px;
  animation: ${fadeIn} 0.5s ease 0.1s backwards;
`;

/* ========== Card ========== */
const SignupCard = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.5s ease 0.2s backwards;
`;

const StepContent = styled.div`
  animation: ${slideInRight} 0.4s ease;
`;

/* ========== Typography ========== */
const Title = styled.h2`
  font-size: 24px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  color: var(--color-dark1);
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 28px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 13px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2);
  margin-bottom: 8px;
  margin-top: 20px;
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

  &:active:not(:disabled) {
    transform: translateY(0);
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

  &:hover:not(:disabled) {
    background: var(--color-subtle);
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

/* ========== Input Row ========== */
const InputRow = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-end;
`;

const InputFlex = styled.div`
  flex: 1;
`;

/* ========== Address ========== */
const SelectedAddress = styled.div`
  margin: 12px 0;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 14px;
  color: #333;
  border: 1px solid #e8e8e8;
`;

/* ========== Spacer ========== */
const Spacer = styled.div<{ size?: number }>`
  height: ${(props) => props.size || 20}px;
`;

/* ========== Success Page ========== */
const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 20px;
  animation: ${fadeIn} 0.6s ease;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-darker) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 40px;
  margin-bottom: 24px;
  animation: ${float} 3s ease-in-out infinite;
  box-shadow: 0 10px 30px rgba(14, 98, 68, 0.3);
`;

const SuccessTitle = styled.h2`
  font-size: 24px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  margin-bottom: 8px;
  text-align: center;
`;

const SuccessSubtitle = styled.p`
  font-size: 14px;
  color: var(--color-dark1);
  text-align: center;
  margin-bottom: 32px;
`;

/* ========== Terms Checkbox Wrapper ========== */
const TermsWrapper = styled.div`
  margin-top: 16px;
`;

// Step 1: 휴대폰 인증 컴포넌트
const PhoneVerification: React.FC<{
  onNext: (data?: any) => void;
  phone: string;
  setPhone: (value: string) => void;
}> = ({ onNext, phone, setPhone }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSMS = async (phone: string) => {
    setIsSending(true);
    try {
      const response = await apiClient.post("/api/sign/signup/send-sms", null, {
        params: { phoneNum: phone },
      });
      if (response.data) {
        setSuccess("인증번호가 발송되었습니다.");
        setError(null);
      }
    } catch (error: any) {
      console.error("SMS 발송 오류:", error);
      setError("인증번호 발송에 실패했습니다. 다시 시도해주세요.");
      setSuccess(null);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const response = await apiClient.post("/api/sign/signup/verify", {
        certificationNumber: verificationCode,
        phoneNumber: phone,
      });
      if (response.data.success) {
        setIsVerified(true);
        setError(null);
        setSuccess("인증이 완료되었습니다.");
        // Pass token to parent component
        onNext && onNext({ verifyToken: response.data.verifyToken });
      } else {
        setError(response.data.msg || "인증에 실패했습니다.");
        setSuccess(null);
      }
    } catch (error: any) {
      console.error("인증 확인 오류:", error);
      setError(error.response?.data?.msg || "인증번호가 일치하지 않습니다.");
      setSuccess(null);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleNext = () => {
    if (isVerified) {
      // Token is already passed via onNext when verification succeeded,
      // but we need to trigger next step here.
      // Modifying onNext signature in parent to accept data for this step if needed.
      // Actually, we should store token in state.
      // Let's modify handleVerify to store it locally, and pass it here?
      // Better: handleVerify calls setVerifyToken state in this component?
      // No, PhoneVerification props definition: onNext: () => void; -> changing to (data?: any) => void
      onNext();
    } else {
      setError("휴대폰 인증을 완료해주세요.");
      setSuccess(null);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "");

    let formattedNumber = "";

    if (numbersOnly.startsWith("02")) {
      if (numbersOnly.length < 3) {
        formattedNumber = numbersOnly;
      } else if (numbersOnly.length < 6) {
        formattedNumber =
          numbersOnly.substring(0, 2) + "-" + numbersOnly.substring(2);
      } else if (numbersOnly.length < 10) {
        formattedNumber =
          numbersOnly.substring(0, 2) +
          "-" +
          numbersOnly.substring(2, 5) +
          "-" +
          numbersOnly.substring(5);
      } else {
        formattedNumber =
          numbersOnly.substring(0, 2) +
          "-" +
          numbersOnly.substring(2, 6) +
          "-" +
          numbersOnly.substring(6, 10);
      }
    } else {
      if (numbersOnly.length < 4) {
        formattedNumber = numbersOnly;
      } else if (numbersOnly.length < 7) {
        formattedNumber =
          numbersOnly.substring(0, 3) + "-" + numbersOnly.substring(3);
      } else if (numbersOnly.length < 11) {
        formattedNumber =
          numbersOnly.substring(0, 3) +
          "-" +
          numbersOnly.substring(3, 6) +
          "-" +
          numbersOnly.substring(6);
      } else {
        formattedNumber =
          numbersOnly.substring(0, 3) +
          "-" +
          numbersOnly.substring(3, 7) +
          "-" +
          numbersOnly.substring(7, 11);
      }
    }

    return formattedNumber;
  };

  return (
    <StepContent>
      <Title>휴대폰 인증</Title>
      <SubTitle>
        회원가입을 위해 휴대폰 번호 인증을 해주세요
        <br />
        번호는 어디에도 공개되지 않고 안전하게 보관돼요
      </SubTitle>

      <InputLabel>휴대폰 번호</InputLabel>
      <InputRow>
        <InputFlex>
          <Input
            type="text"
            height={50}
            placeholder="010-0000-0000"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            disabled={isVerified}
          />
        </InputFlex>
        <SecondaryButton
          onClick={() => handleSMS(phone)}
          disabled={isVerified || isSending || phone.length < 12}
        >
          {isSending ? "발송중..." : "인증번호 받기"}
        </SecondaryButton>
      </InputRow>

      <Spacer size={32} />

      <InputLabel>인증번호</InputLabel>
      <SubTitle style={{ marginBottom: 12 }}>
        휴대폰 번호로 인증문자를 발송해드렸어요
        <br />
        3분 이내로 인증번호를 입력해주세요
      </SubTitle>
      <InputRow>
        <InputFlex>
          <Input
            height={50}
            type="text"
            placeholder="인증번호 6자리"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={isVerified}
            hasSuccess={isVerified}
          />
        </InputFlex>
        <SecondaryButton
          onClick={handleVerify}
          disabled={isVerified || isVerifying || verificationCode.length < 4}
        >
          {isVerifying ? "확인중..." : isVerified ? "인증완료" : "인증하기"}
        </SecondaryButton>
      </InputRow>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <PrimaryButton onClick={handleNext} disabled={!isVerified}>
        다음
      </PrimaryButton>
    </StepContent>
  );
};

// Step 2: 약관 동의 컴포넌트
const TermsAgreement: React.FC<{
  onNext: (data: any) => void;
}> = ({ onNext }) => {
  const content: [string, string][] = [
    [
      "(필수) 서비스 이용자 동의",
      "제1조 (목적)\n본 약관은 요기조기(이하 '회사')가 제공하는 서비스의 이용조건 및 절차, 회사와 회원의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.\n\n제2조 (용어의 정의)\n1. '서비스'란 회사가 제공하는 모든 서비스를 의미합니다.\n2. '회원'이란 회사와 서비스 이용계약을 체결하고 이용자 아이디(ID)를 부여받은 자를 말합니다.\n\n제3조 (약관의 효력 및 변경)\n회사는 본 약관의 내용을 회원이 쉽게 확인할 수 있도록 서비스 화면에 게시합니다.\n\n(상세 내용은 홈페이지 참조)",
    ],
    [
      "(필수) 개인정보 수집/이용 동의",
      "1. 수집하는 개인정보 항목\n- 필수항목: 이메일, 비밀번호, 이름, 생년월일, 성별, 휴대폰 번호\n- 선택항목: 프로필 이미지, 팀 정보\n\n2. 수집 및 이용 목적\n- 회원 가입 및 관리\n- 서비스 제공 및 운영\n- 고객 상담 및 불만 처리\n\n3. 보유 및 이용 기간\n- 회원 탈퇴 시까지 보유합니다. 단, 관계 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다.",
    ],
    [
      "(필수) 제 3자 제공 동의",
      "회사는 회원의 개인정보를 원칙적으로 외부에 제공하지 않습니다. 다만, 아래의 경우에는 예외로 합니다.\n\n1. 이용자들이 사전에 동의한 경우\n2. 법령의 규정에 의거하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우",
    ],
    [
      "(선택) 메일 수신 동의",
      "회사는 서비스 운영과 관련된 중요한 정보, 이벤트, 프로모션 등을 이메일로 전송할 수 있습니다.\n\n동의를 거부하시더라도 기본 서비스 이용에는 제한이 없으나, 이벤트 참여 및 혜택 제공에 제한이 있을 수 있습니다.",
    ],
  ];

  const requiredIndexes = [0, 1, 2];
  const [checkedState, setCheckedState] = useState<boolean[]>(
    Array(content.length).fill(false),
  );

  const handleCheckboxClick = (index: number) => {
    const updatedCheckedState = [...checkedState];
    updatedCheckedState[index] = !updatedCheckedState[index];
    setCheckedState(updatedCheckedState);
  };

  const handleAllClick = (checked: boolean) => {
    setCheckedState(Array(content.length).fill(checked));
  };

  const isNextButtonEnabled = requiredIndexes.every(
    (index) => checkedState[index],
  );

  const handleSubmit = () => {
    onNext({
      consentServiceUser: checkedState[0],
      consentPersonalInfo: checkedState[1],
      consentToThirdPartyOffers: checkedState[2],
      consentToReceivingMail: checkedState[3],
    });
  };

  return (
    <StepContent>
      <Title>약관 동의</Title>
      <SubTitle>
        서비스 이용에 필요한 필수 약관과 선택 약관에 동의해주세요
      </SubTitle>

      <TermsWrapper>
        <CheckBox
          content={content}
          checkedState={checkedState}
          isToggle={true}
          onCheckboxClick={handleCheckboxClick}
          onAllClick={handleAllClick}
        />
      </TermsWrapper>

      <PrimaryButton disabled={!isNextButtonEnabled} onClick={handleSubmit}>
        다음
      </PrimaryButton>
    </StepContent>
  );
};

// Step 3: 개인정보 입력 컴포넌트
interface PersonalInfoProps {
  onNext: (data: any) => void;
  signupData: any;
  isSocialLogin?: boolean;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({
  onNext,
  signupData,
  isSocialLogin = false,
}) => {
  const [email, setEmail] = useState(signupData.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);

  // Validation States
  const [isValidLength, setIsValidLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);
  const [isMatch, setIsMatch] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [emailChecked, setEmailChecked] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSocialLogin) {
      setEmailChecked(true);
    }
  }, [isSocialLogin]);

  // Real-time validation
  useEffect(() => {
    if (!isSocialLogin) {
      setIsValidLength(password.length >= 8 && password.length <= 15);
      setHasNumber(/\d/.test(password));
      setHasSpecial(/[!@#$%^&*()_+]/.test(password));
    }
  }, [password, isSocialLogin]);

  useEffect(() => {
    if (!isSocialLogin) {
      setIsMatch(password !== "" && password === confirmPassword);
    }
  }, [password, confirmPassword, isSocialLogin]);

  const validateFields = () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("올바른 이메일 형식을 입력해주세요.");
      emailInputRef.current?.focus();
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (!emailChecked) {
      setEmailError("이메일 중복 확인을 해주세요.");
      isValid = false;
    }

    if (!isSocialLogin) {
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
      if (!passwordRegex.test(password)) {
        // Error is handled visually by the rules, but we block submit here
        isValid = false;
      }
      if (password !== confirmPassword) {
        isValid = false;
      }
    }

    return isValid;
  };

  const handleEmailCheck = async () => {
    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      setSuccess(null);
      return;
    }
    setIsChecking(true);
    try {
      const response = await apiClient.get(`api/sign/checkEmail/${email}`);
      if (response.data.code) {
        setEmailError("사용할 수 없는 이메일입니다.");
        setEmailChecked(false);
        setSuccess(null);
      } else {
        const pattern = /^[A-Za-z0-9_.-]+@[A-Za-z0-9-]+\.[A-za-z0-9-]+/;
        if (pattern.test(email) === true) {
          setEmailError(null);
          setEmailChecked(true);
          setSuccess("사용 가능한 이메일입니다.");
        } else {
          setEmailError("올바른 이메일 형식을 입력해주세요.");
          setEmailChecked(false);
          setSuccess(null);
        }
      }
    } catch (error) {
      console.error(error);
      setEmailError("사용할 수 없는 이메일입니다.");
      setEmailChecked(false);
      setSuccess(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = () => {
    if (validateFields()) {
      const passwordCheck = confirmPassword;
      onNext({
        email,
        password,
        passwordCheck,
      });
    }
  };

  return (
    <StepContent>
      <Title>개인정보 입력</Title>
      <SubTitle>서비스 이용에 필요한 정보를 입력해주세요</SubTitle>

      <InputLabel>이메일</InputLabel>
      <InputRow>
        <InputFlex>
          <Input
            ref={emailInputRef}
            type="email"
            height={50}
            placeholder="example@email.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailChecked(false);
              setSuccess(null);
            }}
            disabled={isSocialLogin}
            hasError={!!emailError}
            hasSuccess={emailChecked}
          />
        </InputFlex>
        {!isSocialLogin && (
          <SecondaryButton onClick={handleEmailCheck} disabled={isChecking}>
            {isChecking ? "확인중..." : "중복 확인"}
          </SecondaryButton>
        )}
      </InputRow>
      {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}

      <InputLabel>비밀번호</InputLabel>
      <CustomInputWrapper>
        <CustomInput
          type="password"
          placeholder="영문, 숫자, 특수문자 포함 8-16자"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSocialLogin}
        />
      </CustomInputWrapper>

      {/* Validation Criteria - shown only if not social login and typing started */}
      {!isSocialLogin && (
        <ValidationRules>
          <RuleItem valid={isValidLength}>
            {isValidLength ? (
              <HiCheckCircle />
            ) : (
              <HiCheckCircle color="#adb5bd" />
            )}{" "}
            8~15자
          </RuleItem>
          <RuleItem valid={hasNumber}>
            {hasNumber ? <HiCheckCircle /> : <HiCheckCircle color="#adb5bd" />}{" "}
            숫자 포함
          </RuleItem>
          <RuleItem valid={hasSpecial}>
            {hasSpecial ? <HiCheckCircle /> : <HiCheckCircle color="#adb5bd" />}{" "}
            특수문자 포함
          </RuleItem>
        </ValidationRules>
      )}

      <InputLabel>비밀번호 확인</InputLabel>
      <CustomInputWrapper className={isMatch && password ? "valid" : ""}>
        <CustomInput
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={isSocialLogin}
        />
        {isMatch && password && (
          <ValidIcon>
            <HiCheckCircle />
          </ValidIcon>
        )}
      </CustomInputWrapper>
      {!isMatch && confirmPassword && (
        <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>
      )}

      <PrimaryButton onClick={handleSubmit}>다음</PrimaryButton>
    </StepContent>
  );
};

// Step 4: 개인정보2 입력 컴포넌트
interface PersonalInfo2Props {
  onNext: (data: any) => void;
  signupData: any;
  isSocialLogin?: boolean;
}

const PersonalInfo2: React.FC<PersonalInfo2Props> = ({
  onNext,
  signupData,
  isSocialLogin = false,
}) => {
  const [name, setName] = useState(signupData.name || "");
  const [birth, setBirth] = useState(signupData.birthDate || "");
  const [gender, setGender] = useState<string | null>(
    signupData.gender || null,
  );
  const [selectedAddress, setSelectedAddress] = useState<string>(
    signupData.address || "",
  );
  const [detailAddress, setDetailAddress] = useState<string>(
    signupData.addressDetail || "",
  );
  const [showMapModal, setShowMapModal] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [birthError, setBirthError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const birthInputRef = useRef<HTMLInputElement>(null);

  const validateFields = () => {
    let isValid = true;

    if (!isSocialLogin) {
      if (!name) {
        setNameError("이름을 입력해주세요.");
        nameInputRef.current?.focus();
        isValid = false;
      } else {
        setNameError(null);
      }
    }

    const birthRegex = /^\d{6}$/;
    if (!birthRegex.test(birth)) {
      setBirthError("생년월일은 6자리 숫자로 입력해주세요.");
      birthInputRef.current?.focus();
      isValid = false;
    } else {
      setBirthError(null);
    }

    if (!selectedAddress) {
      setAddressError("주소를 찾아주세요.");
      isValid = false;
    } else {
      setAddressError(null);
    }

    if (!gender) {
      setGeneralError("성별을 선택해주세요.");
      isValid = false;
    } else {
      setGeneralError(null);
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      const birthDate = birth;
      const address = selectedAddress;
      const addressDetail = detailAddress;

      if (isSocialLogin) {
        onNext({
          gender,
          birthDate,
          address,
          addressDetail,
        });
      } else {
        onNext({
          name,
          gender,
          birthDate,
          address,
          addressDetail,
        });
      }
    }
  };

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
  };

  return (
    <StepContent>
      <Title>개인정보 입력</Title>
      <SubTitle>서비스 이용에 필요한 정보를 입력해주세요</SubTitle>

      {generalError && <ErrorMessage>{generalError}</ErrorMessage>}

      {!isSocialLogin && (
        <>
          <InputLabel>이름</InputLabel>
          <Input
            ref={nameInputRef}
            type="text"
            height={50}
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            hasError={!!nameError}
          />
          {nameError && <ErrorMessage>{nameError}</ErrorMessage>}
        </>
      )}

      <InputLabel>생년월일 (6자리)</InputLabel>
      <Input
        ref={birthInputRef}
        type="text"
        height={50}
        placeholder="YYMMDD (예: 950101)"
        value={birth}
        maxLength={6}
        onChange={(e) => setBirth(e.target.value.replace(/\D/g, ""))}
        hasError={!!birthError}
      />
      {birthError && <ErrorMessage>{birthError}</ErrorMessage>}

      <InputLabel>성별</InputLabel>
      <RadioButton
        items={["남성", "여성"]}
        selectedItem={gender}
        onChange={(value) => setGender(value)}
      />

      <InputLabel>주소</InputLabel>
      <SecondaryButton onClick={() => setShowMapModal(true)}>
        🔍 주소 찾기
      </SecondaryButton>
      {addressError && <ErrorMessage>{addressError}</ErrorMessage>}
      {selectedAddress && <SelectedAddress>{selectedAddress}</SelectedAddress>}
      {showMapModal && (
        <KakaoMapModal
          onClose={() => setShowMapModal(false)}
          onAddressSelect={handleAddressSelect}
        />
      )}

      <InputLabel>상세 주소 (선택)</InputLabel>
      <Input
        type="text"
        height={50}
        placeholder="상세 주소를 입력하세요"
        value={detailAddress}
        onChange={(e) => setDetailAddress(e.target.value)}
      />

      <PrimaryButton onClick={handleSubmit}>다음</PrimaryButton>
    </StepContent>
  );
};

// Step 5: 추가정보 입력 컴포넌트
const SubPersonalInfo: React.FC<{
  onNext: (data: any) => void;
  signupData: any;
}> = ({ onNext, signupData }) => {
  const [experience, setExperience] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!experience) {
      setGeneralError("선수 경험을 선택해주세요.");
      return;
    }
    if (experience === "있다" && !level) {
      setGeneralError("선수 경력을 선택해주세요.");
      return;
    }
    if (experience === "없다" && !level) {
      setGeneralError("레벨을 선택해주세요.");
      return;
    }
    setGeneralError(null);

    const hasExperience = experience === "있다" ? true : false;
    onNext({ hasExperience, level });
  };

  return (
    <StepContent>
      <Title>추가정보 입력</Title>
      <SubTitle>더 나은 서비스 제공을 위해 추가 정보를 입력해주세요</SubTitle>

      {generalError && <ErrorMessage>{generalError}</ErrorMessage>}

      <InputLabel>선수 경험</InputLabel>
      <RadioButton
        fontSize={14}
        items={["있다", "없다"]}
        selectedItem={experience}
        onChange={(value) => {
          setExperience(value);
          setLevel(null);
        }}
      />

      {experience === "있다" && (
        <>
          <InputLabel>선수 경력</InputLabel>
          <RadioButton
            fontSize={13}
            items={["초등학교 선출", "중학교 선출", "고등학교 선출"]}
            selectedItem={level}
            onChange={(value) => setLevel(value)}
          />
        </>
      )}

      {experience === "없다" && (
        <>
          <InputLabel>레벨</InputLabel>
          <RadioButton
            fontSize={14}
            items={["상", "중", "하"]}
            selectedItem={level}
            onChange={(value) => setLevel(value)}
          />
        </>
      )}

      <PrimaryButton onClick={handleSubmit}>가입 완료</PrimaryButton>
    </StepContent>
  );
};

// Step 6: 가입 완료 페이지
const SuccessSignUpInfo: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/login");
  };

  return (
    <SuccessContainer>
      <SuccessIcon>
        <HiCheckCircle size={48} />
      </SuccessIcon>
      <SuccessTitle>회원가입이 완료됐어요! 🎉</SuccessTitle>
      <SuccessSubtitle>
        이제 원하는 팀에 가입하고
        <br />
        함께 축구를 즐길 수 있어요
      </SuccessSubtitle>
      <PrimaryButton onClick={handleSubmit} style={{ width: "100%" }}>
        로그인 하러가기
      </PrimaryButton>
    </SuccessContainer>
  );
};

// 전체 회원가입 페이지 컴포넌트
const SignupPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [signupData, setSignupData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [isSocialLogin, setIsSocialLogin] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const totalSteps = isSocialLogin ? 3 : 6;
  // currentStep calculation removed - currently unused

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const socialData = params.get("socialData");

    if (socialData) {
      setIsSocialLogin(true);
      setStep(4);
    }
  }, [location.search]);

  const handleNextStep = async (data: any = {}) => {
    const updatedData = { ...signupData, ...data };
    setSignupData(updatedData);

    if (step === 5) {
      setIsLoading(true);
      try {
        const dataToSend = { ...updatedData };
        if (isSocialLogin) {
          const { name, ...dataWithoutName } = dataToSend;
          const response = await apiClient.put(
            "/auth/add-info",
            dataWithoutName,
          );

          if (response.status === 200 || response.status === 201) {
            useToastStore
              .getState()
              .addToast("회원가입에 성공했습니다. 로그인 해주세요.", "success");
            setStep(step + 1);
          } else {
            useToastStore
              .getState()
              .addToast("회원가입에 실패했습니다. 다시 시도해주세요.", "error");
          }
        } else {
          const response = await apiClient.post(
            "/api/sign/signup/sign-up",
            null,
            {
              params: dataToSend,
              headers: {
                "X-AUTH-TOKEN": dataToSend.verifyToken,
              },
            },
          );
          console.log(response);
          if (response.status === 200 || response.status === 201) {
            useToastStore
              .getState()
              .addToast("회원가입에 성공했습니다. 로그인 해주세요.", "success");
            setStep(step + 1);
          } else {
            useToastStore
              .getState()
              .addToast("회원가입에 실패했습니다. 다시 시도해주세요.", "error");
          }
        }
      } catch (error) {
        console.error("회원가입 오류:", error);
        useToastStore
          .getState()
          .addToast(
            "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
            "error",
          );
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  return (
    <PageWrapper>
      <BackgroundDecoration />
      <BackgroundCircle />

      <ContentWrapper>
        {/* 헤더 */}
        <Header>
          <BackButton to="/login">
            <HiArrowLeft size={20} />
          </BackButton>
          <HeaderInfo>
            <StepIndicator>
              Step {step} of {totalSteps}
            </StepIndicator>
          </HeaderInfo>
        </Header>

        {/* 진행률 */}
        <ProgressContainer>
          <ScrollProgress targetWidth={(step / totalSteps) * 100} />
        </ProgressContainer>

        {/* 카드 */}
        <SignupCard>
          {!isSocialLogin && step === 1 && (
            <PhoneVerification
              onNext={handleNextStep}
              phone={phone}
              setPhone={setPhone}
            />
          )}
          {!isSocialLogin && step === 2 && (
            <TermsAgreement onNext={handleNextStep} />
          )}
          {!isSocialLogin && step === 3 && (
            <PersonalInfo
              onNext={handleNextStep}
              signupData={signupData}
              isSocialLogin={isSocialLogin}
            />
          )}
          {step === 4 && (
            <PersonalInfo2
              onNext={handleNextStep}
              signupData={signupData}
              isSocialLogin={isSocialLogin}
            />
          )}
          {step === 5 && (
            <SubPersonalInfo onNext={handleNextStep} signupData={signupData} />
          )}
          {step === 6 && <SuccessSignUpInfo />}

          {isLoading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                marginTop: 20,
              }}
            >
              <LoadingSpinner />
              <span style={{ color: "var(--color-dark1)", fontSize: 14 }}>
                회원가입 중입니다...
              </span>
            </div>
          )}
        </SignupCard>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default SignupPage;

/* Styled Components for Custom Password Input */
const CustomInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  padding: 0 12px;
  height: 50px;
  transition: all 0.2s;

  &:focus-within {
    border-color: #00b894;
    box-shadow: 0 0 0 3px rgba(0, 184, 148, 0.1);
  }

  &.valid {
    border-color: #00b894;
    background-color: #f0fdf4;
  }
`;

// CustomInputIcon removed - unused

const CustomInput = styled.input`
  flex: 1;
  border: none;
  background: none;
  font-size: 15px;
  height: 100%;
  outline: none;

  &::placeholder {
    color: #ced4da;
  }
`;

const ValidIcon = styled.div`
  color: #00b894;
  font-size: 20px;
  display: flex;
  align-items: center;
`;

const ValidationRules = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 8px;
  padding-left: 4px;
`;

const RuleItem = styled.div<{ valid: boolean }>`
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${(props) => (props.valid ? "#00b894" : "#adb5bd")};
  font-weight: ${(props) => (props.valid ? "600" : "400")};
  transition: color 0.2s;
`;
