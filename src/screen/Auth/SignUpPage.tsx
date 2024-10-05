import React, { useState } from "react";
import styled from "styled-components";
import CheckBox from "../../components/CheckBox/CheckBox";
import Input from "../../components/Input/Input";
import MainButton from "../../components/Button/MainButton";
import ScrollProgress from "../../components/ScrollProgress/ScrollProgress";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";
import RadioButton from "../../components/Button/RadioButton";
import KakaoMapModal from "../../components/Modal/KakaoAddress";

// Styled Components
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

const SubContainer = styled.div`
  height: 70vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const IconWrapper = styled.div`
  margin: 50px 0;
`;

const SelectedAddress = styled.div`
  margin: 10px 0;
  font-size: 14px;
  color: #333;
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
        onChange={(e) => setPhone(e.target.value)}
      />
      <MainButton height={50} onClick={() => console.log("인증번호 발송")}>
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
      />
      <MainButton height={50} onClick={handleVerify}>
        인증하기
      </MainButton>
    </Container>
  );
};

// Step 2: 약관 동의 컴포넌트
const TermsAgreement: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const content: [string, string][] = [
    ["(필수) 서비스 이용자 동의", "내용1"],
    ["(필수) 개인정보 수집/이용 동의", "내용2"],
    ["(필수) 제 3자 제공 동의", "내용3"],
    ["(선택) 메일 수신 동의", "내용4"],
    ["(선택) 마케팅 수신 동의", "내용5"],
    ["(선택) 야간 마케팅 수신 동의", "내용6"],
  ];

  const requiredIndexes = [0, 1, 2]; // 필수 항목 인덱스
  const [checkedState, setCheckedState] = useState<boolean[]>(
    Array(content.length).fill(false)
  );

  // 개별 체크박스 클릭 핸들러
  const handleCheckboxClick = (index: number) => {
    const updatedCheckedState = [...checkedState];
    updatedCheckedState[index] = !updatedCheckedState[index];
    setCheckedState(updatedCheckedState);
  };

  // 전체 체크박스 클릭 핸들러
  const handleAllClick = (checked: boolean) => {
    setCheckedState(Array(content.length).fill(checked));
  };

  // 필수 항목 체크 여부 확인
  const isNextButtonEnabled = requiredIndexes.every(
    (index) => checkedState[index]
  );

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
        <MainButton disabled={!isNextButtonEnabled} onClick={onNext}>
          다음
        </MainButton>
      </ButtonWrapper>
    </Container>
  );
};

// Step 3: 개인정보 입력
const PersonalInfo: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState<string | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  const handleSubmit = () => {
    if (password === confirmPassword) {
      onNext({ email, password, gender });
    } else {
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
  };

  return (
    <Container>
      <Title>개인정보 입력</Title>
      <SubTitle>서비스 이용에 필요한 정보를 입력해주세요</SubTitle>
      <InputTitle>이메일</InputTitle>
      <Input
        type="email"
        height={45}
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputTitle>비밀번호</InputTitle>
      <Input
        type="password"
        height={45}
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <InputTitle>비밀번호 확인</InputTitle>
      <Input
        type="password"
        height={45}
        placeholder="비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <InputTitle>생년월일 (6자리)</InputTitle>
      <Input
        type="text"
        height={45}
        placeholder="000000"
        value={birth}
        onChange={(e) => setBirth(e.target.value)}
      />
      <InputTitle>성별</InputTitle>
      <RadioButton
        items={["남성", "여성"]}
        onChange={(value) => setGender(value)} // 선택된 성별 값을 설정
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
      <div style={{ margin: "20px" }}></div>
      <MainButton height={50} onClick={handleSubmit}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 4: 추가정보 입력
const SubPersonalInfo: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [experience, setExperience] = useState<string | null>(null);
  const [former, setFormer] = useState<string | null>(null);
  const [level, setLever] = useState<string | null>(null);

  const handleSubmit = () => {
    onNext({ experience, former, level });
  };

  return (
    <Container>
      <Title>추가정보 입력</Title>
      <SubTitle>서비스 이용에 필요한 추가 정보를 입력해주세요</SubTitle>
      <InputTitle>선수 경험</InputTitle>
      <RadioButton
        items={["있다", "없다"]}
        onChange={(value) => setExperience(value)}
      />
      <InputTitle>선수 경험</InputTitle>
      <RadioButton
        items={["초등학교 선출", "중학교 선출", "고등학교 선출"]}
        onChange={(value) => setFormer(value)}
      />
      <InputTitle>선수 경험</InputTitle>
      <RadioButton
        items={["상", "중", "하"]}
        onChange={(value) => setLever(value)}
      />

      <div style={{ margin: "20px" }}></div>
      <MainButton height={50} onClick={handleSubmit}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 5: 회원가입 완료 컴포넌트
const SignupComplete: React.FC = () => {
  return (
    <SubContainer>
      <Title>회원가입이 완료됐어요!</Title>
      <p>이제 원하는 팀에 가입할 수 있어요</p>
      <IconWrapper>
        <FaCheck size={70} color="#0e6244" />
      </IconWrapper>
      <Link to="/login">
        <MainButton width={240} height={50}>
          로그인 하러 가기
        </MainButton>
      </Link>
    </SubContainer>
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
    <div style={{ padding: "20px" }}>
      <Link to="/login">
        <div style={{ padding: "10px 0" }}>
          <MdClose size={30} />
        </div>
      </Link>
      <div style={{ padding: "5px" }}>
        <ScrollProgress targetWidth={step * 20} />
        <div style={{ padding: "10px" }} />
        {step === 1 && <PhoneVerification onNext={handleNextStep} />}
        {step === 2 && <TermsAgreement onNext={handleNextStep} />}
        {step === 3 && <PersonalInfo onNext={handleNextStep} />}
        {step === 4 && <SubPersonalInfo onNext={handleNextStep} />}
        {step === 5 && <SignupComplete />}
      </div>
    </div>
  );
};

export default SignupPage;
