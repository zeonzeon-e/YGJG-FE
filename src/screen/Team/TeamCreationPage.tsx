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
import axios from "axios";

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

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: 2px;
`;

// Step 1: 팀 프로필 생성 페이지
const TeamProfileCreation: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [teamName, setTeamName] = useState("");
  const [isNameValid, setIsNameValid] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  // const [nameError, setNameError] = useState<string | null>(null);
  const DefaultProfileIcon = "https://example.com/profile-image.jpg";

  // const handleNameCheck = async () => {
  //   // 팀 이름 중복 확인 로직 (예: 서버 요청 등)
  //   if (teamName.length === 0) {
  //     setNameError("팀 이름을 입력해주세요.");
  //     return;
  //   }
  //   // 중복 확인 예시 (실제로는 서버에 요청해야 함)
  //   try {
  //     const response = await axios.post("/team/check-name", { teamName });
  //     if (response.data.available) {
  //       setIsNameValid(true);
  //       setNameError(null);
  //     } else {
  //       setIsNameValid(false);
  //       setNameError("이미 사용 중인 팀 이름입니다.");
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     setNameError("팀 이름 확인 중 오류가 발생했습니다.");
  //   }
  // };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 이미지 업로드 로직 추가 (필요 시)
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

  const handleNext = () => {
    // if (!isNameValid) {
    //   setNameError("팀 이름 중복 확인을 해주세요.");
    //   return;
    // }
    onNext({ teamName, profileImage });
  };

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
      {/* {nameError && <ErrorMessage>{nameError}</ErrorMessage>}
      <MainButton height={40} onClick={handleNameCheck}>
        중복 확인하기
      </MainButton>
      {isNameValid && <SubTitle>사용할 수 있는 팀 이름입니다.</SubTitle>} */}
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
      <MainButton height={50} onClick={handleNext}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 2: 팀 상세정보 (1) 페이지
const TeamDetailOne: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [region, setRegion] = useState("");
  const [activityDays, setActivityDays] = useState<boolean[]>(
    Array(7).fill(false)
  );
  const [activityTime, setActivityTime] = useState<boolean[]>(
    Array(6).fill(false)
  );
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showMapModal, setShowMapModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

  const handleNext = () => {
    if (!region || !selectedAddress) {
      setErrorMessage("모든 필수 항목을 입력해주세요.");
      return;
    }
    onNext({
      region,
      selectedAddress,
      activityDays,
      activityTime,
    });
  };

  return (
    <Container>
      <Title>팀 상세정보 (1)</Title>
      <SubTitle>팀에 대한 상세정보를 입력해주세요</SubTitle>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
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
      <MainButton height={50} onClick={handleNext}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 3: 팀 상세정보 (2) 페이지
const TeamDetailTwo: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [gender, setGender] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [fee, setFee] = useState("");
  const [teamLevel, setTeamLevel] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNext = () => {
    if (!gender || !ageGroup || !fee || !teamLevel) {
      setErrorMessage("모든 필수 항목을 입력해주세요.");
      return;
    }
    onNext({ gender, ageGroup, fee, teamLevel });
  };

  return (
    <Container>
      <Title>팀 상세정보 (2)</Title>
      <SubTitle>팀에 대한 상세정보를 입력해주세요</SubTitle>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
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
      <SubTitle>월 회비</SubTitle>
      <Input
        type="text"
        placeholder="월 회비를 입력해주세요"
        value={fee}
        onChange={(e) => setFee(e.target.value)}
      />
      <SubTitle>팀 수준</SubTitle>
      <RadioButton
        items={["상", "중", "하"]}
        onChange={(value) => setTeamLevel(value)}
      />
      <MainButton height={50} onClick={handleNext}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 4: 선수 모집 공고 작성 페이지
const PlayerRecruitment: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [positions, setPositions] = useState<boolean[]>(Array(4).fill(false));
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleButtonClick = (index: number) => {
    const updated = [...positions];
    updated[index] = !updated[index];
    setPositions(updated);
  };

  const handleNext = () => {
    if (!positions.includes(true) || !description) {
      setErrorMessage("모든 필수 항목을 입력해주세요.");
      return;
    }
    const positionNames = ["공격수", "수비수", "미드필더", "골키퍼"];
    const selectedPositions = positions
      .map((selected, index) => (selected ? positionNames[index] : null))
      .filter((item) => item !== null);

    onNext({ positions: selectedPositions, description });
  };

  return (
    <Container>
      <Title>선수 모집 공고 작성</Title>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
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
      <MainButton height={50} onClick={handleNext}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 5: 팀 생성 완료 페이지
const TeamCreationComplete: React.FC<{ inviteCode: string }> = ({
  inviteCode,
}) => {
  return (
    <Container>
      <Title>팀 생성이 완료되었어요!</Title>
      <IconWrapper>
        <FaCrown size={70} color="#f1c40f" />
      </IconWrapper>
      <SubTitle>초대코드를 복사해 선수들을 초대해주세요</SubTitle>
      <Input type="text" value={inviteCode} readOnly />
      <MainButton
        height={50}
        onClick={() => navigator.clipboard.writeText(inviteCode)}
      >
        <IoCopyOutline size={20} /> 초대코드 복사하기
      </MainButton>
    </Container>
  );
};

// 전체 팀 생성 페이지 컴포넌트
const TeamCreationPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [teamData, setTeamData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState<string>("");

  const handleNextStep = async (data: any = {}) => {
    const updatedData = { ...teamData, ...data };
    setTeamData(updatedData);

    if (step === 4) {
      // 마지막 단계에서 서버로 데이터를 전송
      setIsLoading(true);
      try {
        const response = await axios.post("/api/team/create", updatedData);
        if (response.status === 200) {
          setInviteCode(response.data.inviteCode); // 서버에서 초대코드 받기
          setStep(step + 1); // 성공 시 완료 페이지로 이동
        } else {
          alert("팀 생성에 실패했습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("팀 생성 오류:", error);
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setStep(step + 1);
    }
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
        {step === 5 && <TeamCreationComplete inviteCode={inviteCode} />}
        {isLoading && <p>팀 생성 중입니다. 잠시만 기다려주세요...</p>}
      </div>
    </div>
  );
};

export default TeamCreationPage;
