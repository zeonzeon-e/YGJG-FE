import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import CheckBox from "../../components/CheckBox/CheckBox";
import Input from "../../components/Input/Input";
import MainButton from "../../components/Button/MainButton";
import ScrollProgress from "../../components/ScrollProgress/ScrollProgress";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdClose, MdVisibility, MdVisibilityOff } from "react-icons/md";
import { setAccessToken, setRefreshToken } from "../../utils/authUtils";
import RadioButton from "../../components/Button/RadioButton";
import KakaoMapModal from "../../components/Modal/KakaoAddress";
import apiClient from "../../api/apiClient";

// Styled Components 정의
const Container = styled.div`
  margin: auto;
`;

const Title = styled.h2`
  padding: 10px 0;
`;

const SubTitle = styled.p`
  color: black;
  margin-top: 8px;
  font-size: 14px;
`;

const InputTitle = styled.p`
  color: black;
  margin-top: 10px;
  margin-left: 3px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  margin-top: 20px;
`;

const SelectedAddress = styled.div`
  margin: 10px 0;
  font-size: 14px;
  color: #333;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 2px;
`;

const ProgressBar = styled.div`
  margin-bottom: 20px;
`;

const ShowPasswordIcon = styled.span`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 18px;
  color: #777;
`;

// Step 1: 휴대폰 인증 컴포넌트
const PhoneVerification: React.FC<{
  onNext: () => void;
  phone: string;
  setPhone: (value: string) => void;
}> = ({ onNext, phone, setPhone }) => {
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = () => {
    if (verificationCode === "1234") {
      setIsVerified(true);
      setError(null);
    } else {
      setError("인증번호가 일치하지 않습니다.");
    }
  };

  const handleNext = () => {
    if (isVerified) {
      onNext();
    } else {
      setError("휴대폰 인증을 완료해주세요.");
    }
  };

  const formatPhoneNumber = (value: string) => {
    const numbersOnly = value.replace(/\D/g, "");

    let formattedNumber = "";

    if (numbersOnly.startsWith("02")) {
      // 서울 지역번호 (02) 처리
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
      // 휴대폰 번호 또는 다른 지역번호 처리
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
    <Container>
      <Title>휴대폰 인증</Title>
      <SubTitle>
        회원가입을 위해 휴대폰 번호 인증을 해주세요
        <br />
        번호는 어디에도 공개되지 않고 안전하게 보관돼요
      </SubTitle>
      <Input
        type="text"
        height={50}
        placeholder="휴대폰 번호를 입력하세요"
        value={phone}
        onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
        disabled={isVerified}
      />
      <MainButton
        height={50}
        onClick={() => console.log("인증번호 발송")}
        disabled={isVerified}
      >
        인증번호 받기
      </MainButton>
      <div style={{ margin: "90px" }}></div>
      <SubTitle>
        휴대폰 번호로 인증문자를 발송해드렸어요
        <br />
        3분 이내로 인증번호를 입력해주세요
      </SubTitle>
      <Input
        height={50}
        type="text"
        placeholder="인증번호를 입력하세요"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        disabled={isVerified}
      />
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <MainButton height={50} onClick={handleVerify} disabled={isVerified}>
        인증하기
      </MainButton>
      <div style={{ margin: "20px" }}></div>
      <MainButton height={50} onClick={handleNext} disabled={!isVerified}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 2: 약관 동의 컴포넌트
const TermsAgreement: React.FC<{
  onNext: (selectedTerms: { index: number; content: string }[]) => void;
}> = ({ onNext }) => {
  const content: [string, string][] = [
    ["(필수) 서비스 이용자 동의", "내용1"],
    ["(필수) 개인정보 수집/이용 동의", "내용2"],
    ["(필수) 제 3자 제공 동의", "내용3"],
    ["(선택) 메일 수신 동의", "내용4"],
    ["(선택) 마케팅 수신 동의", "내용5"],
    ["(선택) 야간 마케팅 수신 동의", "내용6"],
  ];

  const requiredIndexes = [0, 1, 2];
  const [checkedState, setCheckedState] = useState<boolean[]>(
    Array(content.length).fill(false)
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
    (index) => checkedState[index]
  );

  const getSelectedTerms = () => {
    return content
      .map((item, index) => ({
        index,
        content: item[0],
      }))
      .filter((_, index) => checkedState[index]);
  };

  return (
    <Container>
      <Title>약관 동의</Title>
      <SubTitle>
        서비스 이용에 필요한 필수 약관과 선택 약관에 동의해주세요
      </SubTitle>
      <CheckBox
        content={content}
        checkedState={checkedState}
        isToggle={true}
        onCheckboxClick={handleCheckboxClick}
        onAllClick={handleAllClick}
      />
      <ButtonWrapper>
        <MainButton
          disabled={!isNextButtonEnabled}
          onClick={() => onNext(getSelectedTerms())}
        >
          다음
        </MainButton>
      </ButtonWrapper>
    </Container>
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
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<
    string | null
  >(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [emailChecked, setEmailChecked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSocialLogin) {
      setEmailChecked(true); // 소셜 로그인 사용자는 이메일 중복 체크 생략
    }
  }, [isSocialLogin]);

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

    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;
    if (!passwordRegex.test(password)) {
      setPasswordError(
        "비밀번호는 영문, 숫자, 특수문자를 포함한 8-16자로 입력해주세요."
      );
      passwordInputRef.current?.focus();
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("비밀번호가 일치하지 않습니다.");
      confirmPasswordInputRef.current?.focus();
      isValid = false;
    } else {
      setConfirmPasswordError(null);
    }

    return isValid;
  };

  const handleEmailCheck = async () => {
    if (!email) {
      setEmailError("이메일을 입력해주세요.");
      return;
    }
    try {
      // 서버에 이메일 중복 확인 요청
      const response = await apiClient.get(`api/sign/checkEmail/${email}`);
      if (response.data.exists) {
        setEmailError("이미 사용 중인 이메일입니다.");
        setEmailChecked(false);
      } else {
        setEmailError(null);
        setEmailChecked(true);
      }
    } catch (error) {
      console.error(error);
      setEmailError("사용할 수 없는 이메일입니다.");
    }
  };

  const handleSubmit = () => {
    if (validateFields()) {
      onNext({
        email,
        password,
      });
    }
  };

  return (
    <Container>
      <Title>개인정보 입력</Title>
      <SubTitle>서비스 이용에 필요한 정보를 입력해주세요</SubTitle>
      {generalError && <ErrorMessage>{generalError}</ErrorMessage>}
      <InputTitle>이메일</InputTitle>
      <div style={{ display: "flex", gap: "2px", alignItems: "center" }}>
        <div style={{ flexGrow: "1" }}>
          <Input
            ref={emailInputRef}
            type="email"
            height={45}
            placeholder="이메일"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailChecked(false);
            }}
            disabled={isSocialLogin} // 소셜 로그인 사용자는 입력 불가
          />
        </div>
        <div style={{ right: "0" }}>
          {!isSocialLogin && (
            <MainButton
              width={100}
              height={45}
              fontSize={15}
              onClick={handleEmailCheck}
            >
              중복 확인
            </MainButton>
          )}
        </div>
      </div>
      {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
      <InputTitle>비밀번호</InputTitle>
      <div style={{ position: "relative" }}>
        <Input
          ref={passwordInputRef}
          type={showPassword ? "text" : "password"}
          height={45}
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isSocialLogin} // 소셜 로그인 사용자는 입력 불가
        />
        <ShowPasswordIcon onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
        </ShowPasswordIcon>
      </div>
      {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
      <InputTitle>비밀번호 확인</InputTitle>
      <Input
        ref={confirmPasswordInputRef}
        type="password"
        height={45}
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isSocialLogin} // 소셜 로그인 사용자는 입력 불가
      />
      {confirmPasswordError && (
        <ErrorMessage>{confirmPasswordError}</ErrorMessage>
      )}
      <div style={{ margin: "20px" }}></div>
      <MainButton height={50} onClick={handleSubmit}>
        다음
      </MainButton>
    </Container>
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
  const [birth, setBirth] = useState(signupData.birth || "");
  const [gender, setGender] = useState<string | null>(
    signupData.gender || null
  );
  const [selectedAddress, setSelectedAddress] = useState<string>(
    signupData.selectedAddress || ""
  );
  const [detailAddress, setDetailAddress] = useState<string>(
    signupData.detailAddress || ""
  );
  const [showMapModal, setShowMapModal] = useState(false);
  const [birthError, setBirthError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const birthInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSocialLogin) {
    }
  }, [isSocialLogin]);

  const validateFields = () => {
    let isValid = true;

    const birthRegex = /^\d{6}$/;
    if (!birthRegex.test(birth)) {
      setBirthError("생년월일은 6자리 숫자로 입력해주세요.");
      birthInputRef.current?.focus();
      isValid = false;
    } else {
      setBirthError(null);
    }

    if (!gender || !selectedAddress) {
      setGeneralError("모든 필수 항목을 입력해주세요.");
      isValid = false;
    } else {
      setGeneralError(null);
    }

    return isValid;
  };

  const handleSubmit = () => {
    if (validateFields()) {
      onNext({
        gender,
        birth,
        selectedAddress,
        detailAddress,
      });
    }
  };

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
  };

  return (
    <Container>
      <Title>개인정보 입력</Title>
      <SubTitle>서비스 이용에 필요한 정보를 입력해주세요</SubTitle>
      {generalError && <ErrorMessage>{generalError}</ErrorMessage>}
      <InputTitle>생년월일 (6자리)</InputTitle>
      <Input
        ref={birthInputRef}
        type="text"
        height={45}
        placeholder="YYMMDD"
        value={birth}
        maxLength={6}
        onChange={(e) => setBirth(e.target.value.replace(/\D/g, ""))}
      />
      {birthError && <ErrorMessage>{birthError}</ErrorMessage>}
      <InputTitle>성별</InputTitle>
      <RadioButton
        items={["남성", "여성"]}
        selectedItem={gender}
        onChange={(value) => setGender(value)}
      />
      <InputTitle>주소</InputTitle>
      <MainButton
        width={100}
        height={40}
        fontSize={15}
        onClick={() => setShowMapModal(true)}
      >
        주소 찾기
      </MainButton>
      <SelectedAddress>{selectedAddress}</SelectedAddress>
      {showMapModal && (
        <KakaoMapModal
          onClose={() => setShowMapModal(false)}
          onAddressSelect={handleAddressSelect}
        />
      )}
      <Input
        type="text"
        height={45}
        placeholder="상세 주소를 입력하세요 (선택)"
        value={detailAddress}
        onChange={(e) => setDetailAddress(e.target.value)}
      />
      <div style={{ margin: "20px" }}></div>
      <MainButton height={50} onClick={handleSubmit}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 5: 추가정보 입력 컴포넌트
const SubPersonalInfo: React.FC<{
  onNext: (data: any) => void;
  signupData: any;
}> = ({ onNext, signupData }) => {
  const [experience, setExperience] = useState<string | null>(
    signupData.experience || null
  );
  const [former, setFormer] = useState<string | null>(
    signupData.former || null
  );
  const [level, setLevel] = useState<string | null>(signupData.level || null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!experience || !level) {
      setGeneralError("모든 필수 항목을 선택해주세요.");
      return;
    }
    if (experience === "있다" && !former) {
      setGeneralError("선수 경력을 선택해주세요.");
      return;
    }
    setGeneralError(null);
    onNext({ experience, former, level });
  };

  return (
    <Container>
      <Title>추가정보 입력</Title>
      <SubTitle>서비스 이용에 필요한 추가 정보를 입력해주세요</SubTitle>
      {generalError && <ErrorMessage>{generalError}</ErrorMessage>}
      <InputTitle>선수 경험</InputTitle>
      <RadioButton
        fontSize={14}
        items={["있다", "없다"]}
        selectedItem={experience}
        onChange={(value) => {
          setExperience(value);
          if (value !== "있다") {
            setFormer(null);
          }
        }}
      />
      {experience === "있다" && (
        <>
          <InputTitle>선수 경력</InputTitle>
          <RadioButton
            fontSize={14}
            items={["초등학교 선출", "중학교 선출", "고등학교 선출"]}
            selectedItem={former}
            onChange={(value) => setFormer(value)}
          />
        </>
      )}
      <InputTitle>레벨</InputTitle>
      <RadioButton
        fontSize={14}
        items={["상", "중", "하"]}
        selectedItem={level}
        onChange={(value) => setLevel(value)}
      />
      <div style={{ margin: "20px" }}></div>
      <MainButton height={50} onClick={handleSubmit}>
        다음
      </MainButton>
    </Container>
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

  useEffect(() => {
    // 소셜 로그인 데이터를 쿼리 파라미터에서 추출
    // const params = new URLSearchParams(location.search);
    // const socialData = params.get("socialData");
    const params = new URLSearchParams(location.search);
    const socialData = params.get("socialData");

    if (socialData) {
      // const parsedData = JSON.parse(decodeURIComponent(socialData));
      // setSignupData(parsedData);
      setIsSocialLogin(true);
      setStep(4); // 전화번호 인증과 약관 동의, 이메일, 비밀번호 건너뛰기
    }
  }, [location.search]);

  const handleNextStep = async (data: any = {}) => {
    const updatedData = { ...signupData, ...data };
    setSignupData(updatedData);
    console.log(updatedData);

    if (step === 5) {
      // 마지막 단계에서 서버로 데이터를 전송
      setIsLoading(true);
      try {
        const dataToSend = { ...updatedData };
        if (!isSocialLogin) {
          // dataToSend.phone = phone;
        } else {
          const response = await apiClient.post("api/sign/sign-up", dataToSend);
          if (response.status === 200 || response.status === 201) {
            // 회원가입 성공 시 로그인 처리 및 메인 페이지로 이동
            const { token, refreshToken } = response.data;
            setAccessToken(token);
            setRefreshToken(refreshToken);
            navigate("/"); // 메인 페이지로 이동
          } else {
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
          }
        }
      } catch (error) {
        console.error("회원가입 오류:", error);
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
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
    <div style={{ padding: "20px" }}>
      <Link to="/login">
        <div style={{ padding: "10px 0" }}>
          <MdClose color="black" size={30} />
        </div>
      </Link>
      <ProgressBar>
        <ScrollProgress
          targetWidth={
            isSocialLogin ? ((step - 3) * 100) / 2 : (step * 100) / 5
          }
        />
      </ProgressBar>
      <div style={{ padding: "5px" }}>
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
        {isLoading && <p>회원가입 중입니다. 잠시만 기다려주세요...</p>}
      </div>
    </div>
  );
};

export default SignupPage;
