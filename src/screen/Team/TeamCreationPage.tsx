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
`;

const SubTitle = styled.p`
  color: black;
  margin-top: 8px;
  font-size: 14px;
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

// 스케줄 표 스타일
const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

const ScheduleHeaderCell = styled.th`
  background-color: var(--color-main);
  color: #fff;
  padding: 0.5rem;
  text-align: center;
  font-size: 14px;
  border: 1px solid #ddd;
`;

const ScheduleRow = styled.tr`
  border: 1px solid #ddd;
`;

const ScheduleCell = styled.td`
  border: 1px solid #ddd;
  text-align: center;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 14px;

  &.selected {
    background-color: var(--color-main);
    color: #fff;
  }

  &:hover {
    opacity: 0.8;
  }
`;

// Step 1: 팀 프로필 생성 페이지
const TeamProfileCreation: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [teamName, setTeamName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const DefaultProfileIcon = "https://example.com/profile-image.jpg";

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
    setProfileImage(DefaultProfileIcon);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleNext = () => {
    if (!teamName) {
      setNameError("팀 이름을 입력해주세요.");
      return;
    } else if (teamName.length > 10) {
      setNameError("10자 이내로 입력해주세요.");
      return;
    } else {
      setNameError(null);
    }

    onNext({ teamName, profileImage });
  };

  return (
    <Container>
      <Title>팀 프로필 생성</Title>
      <div style={{ padding: "10px" }} />
      <SubTitle>팀의 이름을 정해주세요</SubTitle>
      <Input
        type="text"
        placeholder="팀 이름을 입력해주세요 (10자 이내)"
        value={teamName}
        padding={20}
        onChange={(e) => setTeamName(e.target.value)}
      />
      {nameError && <ErrorMessage>{nameError}</ErrorMessage>}
      <div style={{ padding: "30px" }} />
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
      <div style={{ padding: "30px" }} />
      <MainButton height={50} onClick={handleNext}>
        다음
      </MainButton>
    </Container>
  );
};

// Step 2: 팀 상세정보 (1) 페이지 (요일+시간을 함께 선택)
const TeamDetailOne: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  // 7일 x 6타임(아침, 오전, 점심, 오후, 저녁, 밤)을 2차원 배열로 관리
  const [activitySchedule, setActivitySchedule] = useState(
    Array.from({ length: 7 }, () => Array(6).fill(false))
  );
  const [region, setRegion] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showMapModal, setShowMapModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 요일 / 시간대 배열
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const times = [
    "아침(6-9시)",
    "오전(9-12시)",
    "점심(12-15시)",
    "오후(15-18시)",
    "저녁(18-21시)",
    "밤(21-24시)",
  ];

  // 셀 클릭 시 해당 요일/시간대만 토글
  const handleToggle = (dayIndex: number, timeIndex: number) => {
    setActivitySchedule((prev) => {
      // 기존 2차원 배열 복사
      const updated = prev.map((row) => [...row]);
      updated[dayIndex][timeIndex] = !updated[dayIndex][timeIndex];
      return updated;
    });
  };

  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
    setShowMapModal(false);
  };

  const handleNext = () => {
    // 스케줄이 하나도 체크 안 되어 있으면 에러
    if (
      !activitySchedule.flat().includes(true) ||
      !region ||
      !selectedAddress
    ) {
      setErrorMessage("모든 필수 항목을 입력해주세요. (주소/지역/스케줄)");
      return;
    }

    onNext({
      region,
      selectedAddress,
      activitySchedule,
    });
  };

  return (
    <Container>
      <Title>팀 상세정보 (1)</Title>
      <SubTitle>주요 활동지역과 경기장 주소, 스케줄을 설정해주세요</SubTitle>
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

      <SubTitle>주요 활동 요일 / 시간</SubTitle>
      <ScheduleTable>
        <thead>
          <tr>
            <ScheduleHeaderCell />
            {times.map((time, idx) => (
              <ScheduleHeaderCell key={idx}>{time}</ScheduleHeaderCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day, dayIndex) => (
            <ScheduleRow key={dayIndex}>
              <ScheduleCell
                style={{ fontWeight: "bold", backgroundColor: "#f7f7f7" }}
              >
                {day}
              </ScheduleCell>
              {times.map((_, timeIndex) => {
                const selected = activitySchedule[dayIndex][timeIndex];
                return (
                  <ScheduleCell
                    key={`${dayIndex}-${timeIndex}`}
                    className={selected ? "selected" : ""}
                    onClick={() => handleToggle(dayIndex, timeIndex)}
                  >
                    {selected ? "✓" : ""}
                  </ScheduleCell>
                );
              })}
            </ScheduleRow>
          ))}
        </tbody>
      </ScheduleTable>

      <div style={{ marginTop: "20px" }} />
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
  // 나이대를 여러 개 선택할 수 있도록 CheckButton 적용
  const [ageGroupStates, setAgeGroupStates] = useState<boolean[]>(
    Array(6).fill(false)
  );
  const [fee, setFee] = useState("");
  const [teamLevel, setTeamLevel] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAgeGroupClick = (index: number) => {
    const updated = [...ageGroupStates];
    updated[index] = !updated[index];
    setAgeGroupStates(updated);
  };

  const handleNext = () => {
    if (!gender || !ageGroupStates.includes(true) || !fee || !teamLevel) {
      setErrorMessage("모든 필수 항목을 입력해주세요.");
      return;
    }

    const possibleAgeGroups = [
      "20대",
      "30대",
      "40대",
      "50대",
      "60대",
      "70대 이상",
    ];
    const selectedAgeGroups = ageGroupStates
      .map((selected, i) => (selected ? possibleAgeGroups[i] : null))
      .filter((age) => age !== null);

    onNext({
      gender,
      ageGroups: selectedAgeGroups,
      fee,
      teamLevel,
    });
  };

  return (
    <Container>
      <Title>팀 상세정보 (2)</Title>
      <SubTitle>팀에 대한 상세정보를 입력해주세요</SubTitle>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

      <SubTitle>성별</SubTitle>
      <RadioButton
        fontSize={14}
        items={["남성만", "여성만", "남녀 모두"]}
        selectedItem={gender}
        onChange={(value) => setGender(value)}
      />

      <SubTitle>나이대</SubTitle>
      <CheckButton
        fontSize={14}
        items={["20대", "30대", "40대", "50대", "60대", "70대 이상"]}
        selectedBgColor="var(--color-main)"
        textColor="var(--color-dark1)"
        selectedStates={ageGroupStates}
        onItemClick={handleAgeGroupClick}
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
        fontSize={14}
        items={["상", "중", "하"]}
        selectedItem={teamLevel}
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
      .map((selected, i) => (selected ? positionNames[i] : null))
      .filter((item) => item !== null);

    onNext({ positions: selectedPositions, description });
  };

  return (
    <Container>
      <Title>선수 모집 공고 작성</Title>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <SubTitle>팀에 필요한 포지션을 모두 선택해주세요</SubTitle>
      <CheckButton
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
    console.log(updatedData);

    // Step 4에서 onNext가 불리면 서버에 팀 생성 API 요청
    if (step === 4) {
      setIsLoading(true);
      try {
        const response = await axios.post("/api/team/create", updatedData);
        if (response.status === 200) {
          setInviteCode(response.data.inviteCode);
          setStep(step + 1);
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
      <Link to="/team/select/list">
        <div style={{ padding: "10px 0" }}>
          <MdClose size={30} color="#000" />
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
