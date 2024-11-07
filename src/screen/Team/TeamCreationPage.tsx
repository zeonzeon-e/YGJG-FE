// src/screen/Team/TeamCreationPage.tsx
import React, { useState, useRef } from "react";
import styled from "styled-components";
import Input from "../../components/Input/Input";
import MainButton from "../../components/Button/MainButton";
import RadioButton from "../../components/Button/RadioButton";
import { Link } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { FaCrown } from "react-icons/fa";
import KakaoMapModal from "../../components/Modal/KakaoAddress";
import { IoCopyOutline } from "react-icons/io5";
import CheckButton from "../../components/Button/CheckButton";
import ScrollProgress from "../../components/ScrollProgress/ScrollProgress";

// Styled Components
const Container = styled.div`
  margin: auto;
`;

const Title = styled.h2`
  padding: 10px 0;
  font-size: 20px;
  font-weight: bold;
`;

const SubTitle = styled.p`
  color: black;
  margin: 8px 0;
  font-size: 17px;
  font-weight: bold;
`;

const IconWrapper = styled.div`
  margin: 50px 0;
`;

const SelectedAddress = styled.div`
  margin: 10px 0;
  font-size: 14px;
  color: #333;
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  // gap: 1px;
  margin: auto;
`;

const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
`;

const ProfileImage = styled.img`
  width: 116px;
  height: 116px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: cover;
  border: 1px solid #ddd;
  margin-left: 10px;
`;

// Step 1: 팀 프로필 생성 페이지
const TeamProfileCreation: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [teamName, setTeamName] = useState("");
  const [isNameValid, setIsNameValid] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const DefaultProfileIcon = "https://example.com/profile-image.jpg";

  const handleNameCheck = () => {
    // 팀 이름 중복 확인 로직 (예: 서버 요청 등)
    setIsNameValid(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetToDefaultImage = () => {
    setProfileImage(null);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <Container>
      <Title>팀 프로필 생성</Title>
      <div style={{ padding: "10px" }}></div>
      <SubTitle>팀의 이름을 정해주세요</SubTitle>
      <Input
        type="text"
        placeholder="팀 이름을 입력해주세요 (10자 이내)"
        value={teamName}
        padding={20}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <MainButton height={40} onClick={handleNameCheck}>
        중복 확인하기
      </MainButton>
      {isNameValid && <SubTitle>사용할 수 있는 팀 이름입니다.</SubTitle>}
      <div style={{ padding: "30px" }}></div>
      <SubTitle>팀의 프로필 사진을 정해주세요</SubTitle>
      <ImageWrapper>
        <ProfileImage src={profileImage || DefaultProfileIcon} alt="Profile" />
        <ButtonWrapper>
          <MainButton
            height={38}
            width={137}
            fontSize={15}
            onClick={resetToDefaultImage}
          >
            기본 이미지로 변경
          </MainButton>
          <div>
            <MainButton
              height={38}
              fontSize={15}
              width={137}
              onClick={() => fileInputRef.current?.click()}
            >
              사진 가져오기
            </MainButton>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </ButtonWrapper>
      </ImageWrapper>
      <div style={{ padding: "30px" }}></div>
      <MainButton height={50} onClick={onNext}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 2: 팀 상세정보 (1) 페이지
const TeamDetailOne: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [region, setRegion] = useState("서울");
  const [activityDays, setActivityDays] = useState<boolean[]>(
    Array(7).fill(false)
  );
  const [activityTime, setActivityTime] = useState<boolean[]>(
    Array(6).fill(false)
  );
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showMapModal, setShowMapModal] = useState(false);

  const handleButtonClick = (index: number, type: "days" | "time") => {
    if (type === "days") {
      const updated = [...activityDays];
      updated[index] = !updated[index];
      setActivityDays(updated);
    } else if (type === "time") {
      const updated = [...activityTime];
      updated[index] = !updated[index];
      setActivityTime(updated);
    }
  };

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
    setShowMapModal(false);
  };

  return (
    <Container>
      <Title>팀 상세정보 (1)</Title>
      <SubTitle>팀에 대한 상세정보를 입력해주세요</SubTitle>
      <Input
        type="text"
        placeholder="주요 활동 지역"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      />
      <SubTitle>활동하는 경기장</SubTitle>
      <MainButton height={40} onClick={() => setShowMapModal(true)}>
        주소 찾기
      </MainButton>
      {showMapModal && (
        <KakaoMapModal
          onClose={() => setShowMapModal(false)}
          onAddressSelect={handleAddressSelect}
        />
      )}
      <SelectedAddress>{selectedAddress}</SelectedAddress>
      <SubTitle>주요 활동 요일</SubTitle>
      <CheckButton
        title="주요 활동 요일"
        items={["월", "화", "수", "목", "금", "토", "일"]}
        selectedBgColor="var(--color-main)"
        textColor="var(--color-dark1)"
        selectedStates={activityDays}
        onItemClick={(index: number) => handleButtonClick(index, "days")}
      />
      <SubTitle>주요 활동 시간</SubTitle>
      <CheckButton
        title="주요 활동 시간"
        items={[
          "아침 6시~9시",
          "오전 9시~12시",
          "점심 12시~15시",
          "오후 15시~18시",
          "저녁 18시~21시",
          "밤 21시~24시",
        ]}
        selectedBgColor="var(--color-main)"
        textColor="var(--color-dark1)"
        selectedStates={activityTime}
        onItemClick={(index: number) => handleButtonClick(index, "time")}
      />
      <MainButton height={50} onClick={onNext}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 3: 팀 상세정보 (2) 페이지
const TeamDetailTwo: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [fee, setFee] = useState("");
  const [teamLevel, setTeamLevel] = useState("");

  return (
    <Container>
      <Title>팀 상세정보 (2)</Title>
      <SubTitle>팀에 대한 상세정보를 입력해주세요</SubTitle>
      <SubTitle>성별</SubTitle>
      <RadioButton
        items={["남성만", "여성만", "남녀 모두"]}
        onChange={(value) => setGender(value)}
      />
      <SubTitle>나이대</SubTitle>
      <RadioButton
        items={["20대", "30대", "40대", "50대", "60대", "70대 이상"]}
        onChange={(value) => setAgeGroup(value)}
      />
      <Input
        type="text"
        placeholder="월 회비"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
      />
      <SubTitle>팀 수준</SubTitle>
      <RadioButton
        items={["상", "중", "하"]}
        onChange={(value) => setTeamLevel(value)}
      />
      <MainButton height={50} onClick={onNext}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 4: 선수 모집 공고 작성 페이지
const PlayerRecruitment: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [positions, setPositions] = useState<boolean[]>(Array(4).fill(false));
  const [description, setDescription] = useState("");

  const handleButtonClick = (index: number) => {
    const updated = [...positions];
    updated[index] = !updated[index];
    setPositions(updated);
  };

  return (
    <Container>
      <Title>선수 모집 공고 작성</Title>
      <SubTitle>팀에 필요한 포지션을 모두 선택해주세요</SubTitle>
      <CheckButton
        title="팀에 필요한 포지션을 모두 선택해주세요"
        items={["공격수", "수비수", "미드필더", "골키퍼"]}
        selectedBgColor="var(--color-main)"
        textColor="var(--color-dark1)"
        selectedStates={positions}
        onItemClick={(index: number) => handleButtonClick(index)}
      />
      <SubTitle>하고 싶은 말을 적어주세요</SubTitle>
      <Input
        type="text"
        placeholder="글을 입력해주세요"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <MainButton height={50} onClick={onNext}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 5: 팀 생성 완료 페이지
const TeamCreationComplete: React.FC = () => {
  return (
    <Container>
      <Title>팀 생성이 완료되었어요!</Title>
      <IconWrapper>
        <FaCrown size={70} color="#f1c40f" />
      </IconWrapper>
      <SubTitle>초대코드를 복사해 선수들을 초대해주세요</SubTitle>
      <Input type="text" value="DPJDSKFJAI" />
      <MainButton
        height={50}
        onClick={() => navigator.clipboard.writeText("DPJDSKFJAI")}
      >
        <IoCopyOutline size={20} /> 초대코드 복사하기
      </MainButton>
    </Container>
  );
};

// 전체 팀 생성 페이지 컴포넌트
const TeamCreationPage: React.FC = () => {
  const [step, setStep] = useState(1);

  const handleNextStep = () => {
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
        <ScrollProgress targetWidth={step * (100 / 5)} />
        <div style={{ padding: "10px" }} />
        {step === 1 && <TeamProfileCreation onNext={handleNextStep} />}
        {step === 2 && <TeamDetailOne onNext={handleNextStep} />}
        {step === 3 && <TeamDetailTwo onNext={handleNextStep} />}
        {step === 4 && <PlayerRecruitment onNext={handleNextStep} />}
        {step === 5 && <TeamCreationComplete />}
      </div>
    </div>
  );
};

export default TeamCreationPage;
