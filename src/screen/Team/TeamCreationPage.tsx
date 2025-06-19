// src/screen/Team/TeamCreationPage.tsx
import React, { useState, useRef } from "react";
import styled from "styled-components";
import Input from "../../components/Input/Input";
import MainButton from "../../components/Button/MainButton";
import RadioButton from "../../components/Button/RadioButton";
import { Link, useNavigate } from "react-router-dom";
import { MdClose } from "react-icons/md";
import { IoCopyOutline } from "react-icons/io5";
import CheckButton from "../../components/Button/CheckButton";
import ScrollProgress from "../../components/ScrollProgress/ScrollProgress";
import apiClient from "../../api/apiClient";
import KakaoMapModal from "../../components/Modal/KakaoAddress";

// --- Styled Components ---

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

const MessageBase = styled.p`
  font-size: 12px;
  margin-top: 6px;
  text-align: left;
  width: 100%;
  padding-left: 2px;
  min-height: 1.2em;
`;

const ErrorMessage = styled(MessageBase)`
  color: var(--color-error);
`;

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

// --- Step 1: 팀 프로필 생성 ---
const TeamProfileCreation: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [teamName, setTeamName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const DefaultProfileIcon = "https://example.com/profile-image.jpg";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetToDefaultImage = () => {
    setProfileImage(DefaultProfileIcon);
    setProfileImageFile(null);
  };

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleNext = () => {
    if (!teamName) {
      setNameError("팀 이름을 입력해주세요.");
      return;
    } else if (teamName.length > 10) {
      setNameError("10자 이내로 입력해주세요.");
      return;
    }
    setNameError(null);
    onNext({ teamName, profileImage, profileImageFile });
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
        onChange={(e) => {
          setTeamName(e.target.value);
          if (nameError) setNameError(null);
        }}
        hasError={!!nameError}
      />
      {nameError && <ErrorMessage>{nameError}</ErrorMessage>}
      {!nameError && <MessageBase> </MessageBase>}

      <div style={{ padding: "20px" }} />
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
      <div style={{ padding: "20px" }} />
      <MainButton height={50} onClick={handleNext}>
        다음
      </MainButton>
    </Container>
  );
};

// --- Step 2: 팀 상세정보 (1) ---
const TeamDetailOne: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [activitySchedule, setActivitySchedule] = useState(
    Array.from({ length: 7 }, () => Array(6).fill(false))
  );
  const [region, setRegion] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [showMapModal, setShowMapModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const times = ["아침", "오전", "점심", "오후", "저녁", "밤"];

  const handleToggle = (dayIndex: number, timeIndex: number) => {
    setActivitySchedule((prev) => {
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
    const isScheduleEmpty = !activitySchedule.flat().includes(true);
    if (isScheduleEmpty || !region || !selectedAddress) {
      setErrorMessage("모든 필수 항목을 입력해주세요. (지역, 경기장, 스케줄)");
      return;
    }
    setErrorMessage(null);
    onNext({ region, selectedAddress, activitySchedule });
  };

  return (
    <Container>
      <Title>팀 상세정보 (1)</Title>
      <SubTitle>주요 활동지역과 경기장 주소, 스케줄을 설정해주세요</SubTitle>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {!errorMessage && <MessageBase> </MessageBase>}

      <Input
        type="text"
        placeholder="주요 활동 지역 (예: 서울)"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
        hasError={!!(errorMessage && !region)}
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

// --- Step 3: 팀 상세정보 (2) ---
const TeamDetailTwo: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [gender, setGender] = useState("");
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
    setErrorMessage(null);

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
      .filter((age) => age !== null) as string[];

    onNext({ gender, ageGroups: selectedAgeGroups, fee, teamLevel });
  };

  return (
    <Container>
      <Title>팀 상세정보 (2)</Title>
      <SubTitle>팀에 대한 상세정보를 입력해주세요</SubTitle>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {!errorMessage && <MessageBase> </MessageBase>}

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
        hasError={!!(errorMessage && !fee)}
      />

      <SubTitle>팀 수준</SubTitle>
      <RadioButton
        fontSize={14}
        items={["상", "중", "하"]}
        selectedItem={teamLevel}
        onChange={(value) => setTeamLevel(value)}
      />

      <div style={{ marginTop: "10px" }} />
      <MainButton height={50} onClick={handleNext}>
        다음
      </MainButton>
    </Container>
  );
};

// --- Step 4: 선수 모집 공고 작성 (Textarea 및 유효성 검사 강화) ---

const StyledTextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  height: 150px;
  padding: 15px;
  box-sizing: border-box;
  font-size: 14px;
  font-family: "Pretendard-Regular";
  border-radius: 8px;
  margin-top: 5px;
  resize: none;
  border: 1px solid
    ${(props) =>
      props.hasError ? "var(--color-error)" : "var(--color-border)"};
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;

  &:focus {
    outline: 0;
    border-color: ${(props) =>
      props.hasError ? "var(--color-error)" : "var(--color-main)"};
    box-shadow: 0 0 0 2px
      ${(props) =>
        props.hasError ? "rgba(255, 56, 59, 0.2)" : "rgba(14, 98, 68, 0.2)"};
  }
`;

const PlayerRecruitment: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [positions, setPositions] = useState<boolean[]>(Array(4).fill(false));
  const [description, setDescription] = useState("");
  const [positionError, setPositionError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const handleButtonClick = (index: number) => {
    const updated = [...positions];
    updated[index] = !updated[index];
    setPositions(updated);
    if (positionError) setPositionError(null);
  };

  const handleNext = () => {
    const isPositionEmpty = !positions.includes(true);
    const isDescriptionEmpty = !description.trim();

    // 유효성 검사
    setPositionError(
      isPositionEmpty ? "팀에 필요한 포지션을 선택해주세요." : null
    );
    setDescriptionError(
      isDescriptionEmpty ? "하고 싶은 말을 입력해주세요." : null
    );

    if (isPositionEmpty || isDescriptionEmpty) {
      return;
    }

    const positionMap: { [key: string]: string } = {
      공격수: "FW",
      수비수: "DF",
      미드필더: "MF",
      골키퍼: "GK",
    };
    const positionNames = ["공격수", "수비수", "미드필더", "골키퍼"];
    const selectedPositions = positions
      .map((selected, i) => (selected ? positionMap[positionNames[i]] : null))
      .filter((item) => item !== null) as string[];

    onNext({ positions: selectedPositions, description });
  };

  return (
    <Container>
      <Title>선수 모집 공고 작성</Title>
      <SubTitle>팀에 필요한 포지션을 모두 선택해주세요</SubTitle>
      <CheckButton
        items={["공격수", "수비수", "미드필더", "골키퍼"]}
        selectedBgColor="var(--color-main)"
        textColor="var(--color-dark1)"
        selectedStates={positions}
        onItemClick={(index: number) => handleButtonClick(index)}
      />
      {positionError && <ErrorMessage>{positionError}</ErrorMessage>}
      {!positionError && <MessageBase> </MessageBase>}

      <div style={{ marginTop: "10px" }} />
      <SubTitle>하고 싶은 말을 적어주세요</SubTitle>
      <StyledTextArea
        placeholder="글을 입력해주세요"
        value={description}
        onChange={(e) => {
          setDescription(e.target.value);
          if (descriptionError) setDescriptionError(null);
        }}
        hasError={!!descriptionError}
      />
      {descriptionError && <ErrorMessage>{descriptionError}</ErrorMessage>}
      {!descriptionError && <MessageBase> </MessageBase>}

      <div style={{ marginTop: "10px" }} />
      <MainButton height={50} onClick={handleNext}>
        다음
      </MainButton>
    </Container>
  );
};

// --- Step 5: 팀 생성 완료 페이지 ---
const CompleteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 10px;
`;

const CrownImage = styled.img`
  width: 100px;
  height: auto;
  margin-bottom: 24px;
`;

const CompleteTitle = styled.h1`
  font-size: 22px;
  font-family: "Pretendard-Bold";
  margin-bottom: 12px;
`;

const CompleteSubTitle = styled.p`
  font-size: 16px;
  color: var(--color-dark2);
  line-height: 1.5;
  margin-bottom: 32px;
`;

const InviteCodeWrapper = styled.div`
  position: relative;
  width: 100%;
  margin-bottom: 8px;
`;

const InviteCodeInput = styled.input`
  width: 100%;
  height: 52px;
  padding: 0 50px 0 20px;
  box-sizing: border-box;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: var(--color-light1);
  font-size: 16px;
  font-family: "Pretendard-Regular";
  text-align: left;
  color: var(--color-dark2);
  user-select: all;

  &:focus {
    outline: none;
    border-color: var(--color-main);
  }
`;

const CopyIcon = styled(IoCopyOutline)`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 22px;
  color: var(--color-dark1);
  cursor: pointer;
  transition: color 0.2s ease-in-out;

  &:hover {
    color: var(--color-main);
  }
`;

const TeamCreationComplete: React.FC<{
  teamId: number;
  inviteCode: string;
}> = ({ inviteCode }) => {
  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(inviteCode)
        .then(() => alert("초대코드가 복사되었습니다!"))
        .catch(() => alert("복사에 실패했습니다."));
    }
  };

  return (
    <CompleteContainer>
      <CrownImage src="/crown.svg" alt="팀 생성 완료" />
      <CompleteTitle>팀 생성이 완료되었어요!</CompleteTitle>
      <CompleteSubTitle>
        초대코드를 복사해
        <br />
        선수들을 초대해주세요
      </CompleteSubTitle>
      <InviteCodeWrapper>
        <InviteCodeInput type="text" value={inviteCode} readOnly />
        <CopyIcon onClick={handleCopy} />
      </InviteCodeWrapper>
      <MainButton height={52} onClick={handleCopy}>
        초대코드 복사하기
      </MainButton>
    </CompleteContainer>
  );
};

// --- 전체 팀 생성 페이지 컴포넌트 ---
const TeamCreationPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [teamData, setTeamData] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [finalTeamData, setFinalTeamData] = useState<{
    teamId: number;
    inviteCode: string;
  }>({ teamId: 0, inviteCode: "" });
  const navigate = useNavigate();

  const handleNextStep = async (data: any = {}) => {
    const updatedData = { ...teamData, ...data };
    setTeamData(updatedData);

    if (step === 4) {
      setIsLoading(true);

      const times = ["아침", "오전", "점심", "오후", "저녁", "밤"];
      const scheduleBooleans: boolean[][] = updatedData.activitySchedule || [];
      const activityScheduleTransformed: string[][] = Array.from(
        { length: 7 },
        () => []
      );

      scheduleBooleans.forEach((daySchedule, dayIndex) => {
        daySchedule.forEach((isSelected, timeIndex) => {
          if (isSelected) {
            activityScheduleTransformed[dayIndex].push(times[timeIndex]);
          }
        });
      });

      const ageDecades = (updatedData.ageGroups as string[])
        .map((age) => parseInt(age.replace("대", "").replace(" 이상", "")))
        .sort((a, b) => a - b);
      let ageRangeString = "";
      if (ageDecades.length > 1) {
        ageRangeString = `${ageDecades[0]}-${
          ageDecades[ageDecades.length - 1]
        }`;
      } else if (ageDecades.length === 1) {
        ageRangeString = `${ageDecades[0]}`;
      }

      const addressParts = updatedData.selectedAddress?.split(" ") || [];
      const town =
        addressParts.length > 1
          ? addressParts[1]
          : addressParts.length === 1
          ? addressParts[0]
          : "";

      const requestDto = {
        teamName: updatedData.teamName,
        team_introduce: updatedData.description,
        region: updatedData.region,
        town: town,
        matchLocation: updatedData.selectedAddress,
        activitySchedule: activityScheduleTransformed,
        teamGender: updatedData.gender.replace("만", "").replace(" 모두", ""),
        ageRange: ageRangeString,
        dues: updatedData.fee,
        teamLevel: updatedData.teamLevel,
        positionRequired: updatedData.positions,
      };

      try {
        const response = await apiClient.post("/api/team/create", requestDto, {
          headers: { "Content-Type": "application/json" },
        });

        if (response.status === 200 || response.status === 201) {
          const { teamId, inviteCode } = response.data;
          setFinalTeamData({ teamId, inviteCode });

          if (updatedData.profileImageFile) {
            const formData = new FormData();
            formData.append("image", updatedData.profileImageFile);
            formData.append("teamId", String(teamId));

            await apiClient.post("/api/team/upload/image", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          }
          setStep(step + 1);
        } else {
          alert("팀 생성에 실패했습니다. 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("팀 생성 오류:", error);
        alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        navigate("/team/list");
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
        {step === 5 && (
          <TeamCreationComplete
            teamId={finalTeamData.teamId}
            inviteCode={finalTeamData.inviteCode}
          />
        )}
        {isLoading && <p>팀 생성 중입니다. 잠시만 기다려주세요...</p>}
      </div>
    </div>
  );
};

export default TeamCreationPage;