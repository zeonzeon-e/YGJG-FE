import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import CheckBox from "../../components/CheckBox/CheckBox";
import Input from "../../components/Input/Input";
import MainButton from "../../components/Button/MainButton";
import ScrollProgress from "../../components/ScrollProgress/ScrollProgress";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import RadioButton from "../../components/Button/RadioButton";
import KakaoMapModal from "../../components/Modal/KakaoAddress";
import apiClient from "../../api/apiClient";

const Container = styled.div`
  margin: auto;
  width: 100%; /* 너비를 100%로 설정하여 내부 아이템 정렬 기준 명확화 */
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
  color: var(--color-error);
  font-size: 12px;
  margin-top: 2px;
`;

const SuccessMessage = styled.p`
  color: green;
  font-size: 12px;
  margin-top: 2px;
`;

const ProgressBar = styled.div`
  margin-bottom: 20px;
`;

const SuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SuccessTitle = styled.div`
  font-size: 22px;
  font-weight: 500;
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
  const [success, setSuccess] = useState<string | null>(null);

  const handleSMS = async (phone: string) => {
    try {
      const response = await apiClient.post("/api/sign/send-sms", null, {
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
    }
  };

  const handleVerify = async () => {
    try {
      const response = await apiClient.post("/api/sign/verify", null, {
        params: { certificationNumber: verificationCode },
      });
      if (response.data.success) {
        setIsVerified(true);
        setError(null);
        setSuccess("인증이 완료되었습니다.");
      } else {
        setError(response.data.msg || "인증에 실패했습니다.");
        setSuccess(null);
      }
    } catch (error: any) {
      console.error("인증 확인 오류:", error);
      setError(error.response?.data?.msg || "인증번호가 일치하지 않습니다.");
      setSuccess(null);
    }
  };

  const handleNext = () => {
    if (isVerified) {
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
        onClick={() => handleSMS(phone)}
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
      {success && <SuccessMessage>{success}</SuccessMessage>}
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
  onNext: (data: any) => void;
}> = ({ onNext }) => {
  // API 필드에 맞게 동의항목을 수정
  // 필수: 서비스 이용자 동의(consentServiceUser), 개인정보 수집/이용 동의(consentPersonalInfo), 3자 제공 동의(consentToThirdPartyOffers)
  // 선택: 메일 수신 동의(consentToReceivingMail)
  const content: [string, string][] = [
    ["(필수) 서비스 이용자 동의", "내용1"],
    ["(필수) 개인정보 수집/이용 동의", "내용2"],
    ["(필수) 제 3자 제공 동의", "내용3"],
    ["(선택) 메일 수신 동의", "내용4"],
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

  const handleSubmit = () => {
    onNext({
      consentServiceUser: checkedState[0],
      consentPersonalInfo: checkedState[1],
      consentToThirdPartyOffers: checkedState[2],
      consentToReceivingMail: checkedState[3],
    });
  };

  return (
    <Container>
      <Title>약관 동의</Title>
      <SubTitle>
        서비스 이용에 필요한 필수 약관과 선택 약관에 동의해주세요
      </SubTitle>
      <div style={{ padding: "20px" }}></div>
      <CheckBox
        content={content}
        checkedState={checkedState}
        isToggle={true}
        onCheckboxClick={handleCheckboxClick}
        onAllClick={handleAllClick}
      />
      <ButtonWrapper>
        <MainButton disabled={!isNextButtonEnabled} onClick={handleSubmit}>
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [emailChecked, setEmailChecked] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSocialLogin) {
      // 소셜 로그인 사용자는 이메일 중복 체크 필요 없음
      setEmailChecked(true);
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
    if (!isSocialLogin && !passwordRegex.test(password)) {
      setPasswordError(
        "비밀번호는 영문, 숫자, 특수문자를 포함한 8-16자로 입력해주세요."
      );
      passwordInputRef.current?.focus();
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (!isSocialLogin && password !== confirmPassword) {
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
      setSuccess(null);
      return;
    }
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
              setSuccess(null);
            }}
            disabled={isSocialLogin}
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
      {success && <SuccessMessage>{success}</SuccessMessage>}
      <InputTitle>비밀번호</InputTitle>
      <Input
        ref={passwordInputRef}
        type={"password"}
        height={45}
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isSocialLogin}
      />
      {passwordError && <ErrorMessage>{passwordError}</ErrorMessage>}
      <InputTitle>비밀번호 확인</InputTitle>
      <Input
        ref={confirmPasswordInputRef}
        type="password"
        height={45}
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        disabled={isSocialLogin}
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
  const [name, setName] = useState(signupData.name || "");
  const [birth, setBirth] = useState(signupData.birthDate || "");
  const [gender, setGender] = useState<string | null>(
    signupData.gender || null
  );
  const [selectedAddress, setSelectedAddress] = useState<string>(
    signupData.address || ""
  );
  const [detailAddress, setDetailAddress] = useState<string>(
    signupData.addressDetail || ""
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

    // 소셜로그인 회원은 name 없이 진행할 것이므로, 소셜 로그인 아닐 때만 name 체크
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
      setGeneralError("모든 필수 항목을 입력해주세요.");
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

      // 소셜로그인 회원은 name 없이 진행
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
    <Container>
      <Title>개인정보 입력</Title>
      <SubTitle>서비스 이용에 필요한 정보를 입력해주세요</SubTitle>
      {generalError && <ErrorMessage>{generalError}</ErrorMessage>}
      {!isSocialLogin && (
        <>
          <InputTitle>이름</InputTitle>
          <Input
            ref={nameInputRef}
            type="text"
            height={45}
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {nameError && <ErrorMessage>{nameError}</ErrorMessage>}
        </>
      )}
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
      {addressError && <ErrorMessage>{addressError}</ErrorMessage>}
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
  const [experience, setExperience] = useState<string | null>(null);
  const [level, setLevel] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!experience) {
      setGeneralError("모든 필수 항목을 선택해주세요.");
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
          setLevel(null);
        }}
      />
      {experience === "있다" && (
        <>
          <InputTitle>선수 경력</InputTitle>
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
          <InputTitle>레벨</InputTitle>
          <RadioButton
            fontSize={14}
            items={["상", "중", "하"]}
            selectedItem={level}
            onChange={(value) => setLevel(value)}
          />
        </>
      )}

      <div style={{ margin: "20px" }}></div>
      <MainButton height={50} onClick={handleSubmit}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 6: 가입 완료 페이지
const SuccessSignUpInfo: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = () => {
    navigate("/login");
  };

  return (
    <Container>
      <SuccessContainer>
        <div style={{ margin: "50px" }}></div>
        <SuccessTitle>회원가입이 완료됐어요!</SuccessTitle>
        <SubTitle>이제 원하는 팀에 가입할 수 있어요</SubTitle>
        <div style={{ margin: "40px" }}></div>
        <FaCheck size={50} color="var(--color-main)" />
        <div style={{ margin: "40px" }}></div>
        <MainButton height={50} width={270} onClick={handleSubmit}>
          로그인 하러가기
        </MainButton>
      </SuccessContainer>
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
    const params = new URLSearchParams(location.search);
    const socialData = params.get("socialData");

    if (socialData) {
      // 소셜로그인으로 넘어온 데이터라고 가정
      // 전화번호 인증, 약관 동의, 이메일/비밀번호 생략
      // 바로 개인정보2 단계로 이동 (이때 이름 제외)
      setIsSocialLogin(true);
      setStep(4);
    }
  }, [location.search]);

  const handleNextStep = async (data: any = {}) => {
    const updatedData = { ...signupData, ...data };
    setSignupData(updatedData);

    if (step === 5) {
      // 마지막 단계에서 서버로 데이터를 전송
      setIsLoading(true);
      try {
        const dataToSend = { ...updatedData };
        if (isSocialLogin) {
          // 소셜 로그인 회원 추가정보 입력 시 name 제외
          const { name, ...dataWithoutName } = dataToSend;
          // const {
          //   address,
          //   addressDetail,
          //   birthDate,
          //   gender,
          //   hasExperience,
          //   level,
          // } = dataWithoutName;
          // PUT 요청 사용
          const response = await apiClient.put(
            "/auth/add-info",
            dataWithoutName
          );

          if (response.status === 200 || response.status === 201) {
            // const { token, refreshToken } = response.data;
            // console.log(response.data);
            // setAccessToken(token);
            // setRefreshToken(refreshToken);
            alert("회원가입에 성공했습니다. 로그인 해주세요.");
            setStep(step + 1);
          } else {
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
          }
        } else {
          // 일반 회원가입
          const response = await apiClient.post("api/sign/sign-up", null, {
            params: dataToSend,
          });
          console.log(response);
          if (response.status === 200 || response.status === 201) {
            alert("회원가입에 성공했습니다. 로그인 해주세요.");
            setStep(step + 1);
          } else {
            alert("회원가입에 실패했습니다. 다시 시도해주세요.");
          }
        }
      } catch (error) {
        console.error("회원가입 오류:", error);
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
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
    <div style={{ padding: "20px" }}>
      <Link to="/login">
        <div style={{ padding: "10px 0" }}>
          <MdClose color="black" size={30} />
        </div>
      </Link>
      <ProgressBar>
        <ScrollProgress
          targetWidth={
            isSocialLogin ? ((step - 3) * 100) / 3 : (step * 100) / 6
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
        {step === 6 && <SuccessSignUpInfo />}
        {isLoading && <p>회원가입 중입니다. 잠시만 기다려주세요...</p>}
      </div>
    </div>
  );
};

export default SignupPage;
