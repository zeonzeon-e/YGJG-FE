// src/screen/Team/TeamCreationPage.tsx
import React, { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import Input from "../../components/Input/Input";
import RadioButton from "../../components/Button/RadioButton";
import { Link, useNavigate } from "react-router-dom";
import {
  HiArrowLeft,
  HiCamera,
  HiCheckCircle,
  HiClipboard,
} from "react-icons/hi2";
import CheckButton from "../../components/Button/CheckButton";
import ScrollProgress from "../../components/ScrollProgress/ScrollProgress";
import apiClient from "../../api/apiClient";
import KakaoMapModal from "../../components/Modal/KakaoAddress";

/* ========== Animations ========== */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

/* ========== Page Layout ========== */
const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8faf9 0%, #e8f5e9 100%);
  padding: 20px;
  padding-top: 40px;
`;

const BackgroundDecoration = styled.div`
  position: fixed;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--color-subtle), var(--color-sub));
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(60px);
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  max-width: 520px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
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

const ProgressContainer = styled.div`
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease 0.1s backwards;
`;

const Card = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px 24px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.5s ease 0.2s backwards;
`;

const Title = styled.h2`
  font-size: 24px;
  font-family: "Pretendard-Bold";
  margin-bottom: 8px;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: var(--color-dark1);
  margin-bottom: 24px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 13px;
  font-family: "Pretendard-SemiBold";
  margin-bottom: 8px;
  margin-top: 20px;
`;

const ErrorMessage = styled.div`
  background: #fff5f5;
  color: var(--color-error);
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 10px;
  margin-top: 8px;
`;

const PrimaryButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${(p) =>
    p.disabled
      ? "#e5e5e5"
      : "linear-gradient(135deg, var(--color-main), var(--color-main-darker))"};
  color: ${(p) => (p.disabled ? "#999" : "white")};
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-family: "Pretendard-Bold";
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  margin-top: 24px;
  min-height: 52px;
  transition: all 0.2s;
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 98, 68, 0.3);
  }
`;

const SecondaryButton = styled.button`
  padding: 12px 20px;
  background: white;
  color: var(--color-main);
  border: 2px solid var(--color-main);
  border-radius: 12px;
  font-size: 14px;
  font-family: "Pretendard-SemiBold";
  cursor: pointer;
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: ${spin} 0.8s linear infinite;
  margin: 0 auto;
`;

/* ========== Profile Image ========== */
const ImageSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 24px 0;
`;

const ProfileImageWrapper = styled.div`
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-main);
  background: #f0f0f0;
`;

const ProfilePlaceholder = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid var(--color-main);
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-main);
  font-size: 40px;
`;

const CameraButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-main);
  color: white;
  border: 3px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const ImageButtons = styled.div`
  display: flex;
  gap: 10px;
`;

/* ========== Schedule Table ========== */
const ScheduleTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const ScheduleHeaderCell = styled.th`
  background: var(--color-main);
  color: white;
  padding: 10px 4px;
  text-align: center;
  font-size: 12px;
`;

const ScheduleCell = styled.td<{ selected?: boolean }>`
  border: 1px solid #eee;
  text-align: center;
  padding: 10px 4px;
  cursor: pointer;
  font-size: 12px;
  background: ${(p) => (p.selected ? "var(--color-main)" : "white")};
  color: ${(p) => (p.selected ? "white" : "inherit")};
  transition: all 0.15s;
  &:hover {
    opacity: 0.8;
  }
`;

/* ========== Textarea ========== */
const StyledTextArea = styled.textarea<{ hasError?: boolean }>`
  width: 100%;
  height: 150px;
  padding: 16px;
  box-sizing: border-box;
  font-size: 14px;
  font-family: "Pretendard-Regular";
  border-radius: 12px;
  resize: none;
  border: 2px solid ${(p) => (p.hasError ? "var(--color-error)" : "#e8e8e8")};
  transition: border-color 0.2s;
  &:focus {
    outline: none;
    border-color: var(--color-main);
  }
`;

/* ========== Complete Page ========== */
const CompleteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 20px 0;
`;

const SuccessIcon = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    var(--color-main),
    var(--color-main-darker)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 24px;
  animation: ${float} 3s ease-in-out infinite;
  box-shadow: 0 10px 30px rgba(14, 98, 68, 0.3);
`;

const InviteCodeBox = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f8f9fa;
  padding: 14px 16px;
  border-radius: 12px;
  margin: 20px 0;
`;

const InviteCode = styled.span`
  flex: 1;
  font-size: 18px;
  font-family: "Pretendard-Bold";
  color: var(--color-main);
`;

const CopyButton = styled.button`
  background: var(--color-main);
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const SelectedAddress = styled.div`
  margin: 12px 0;
  padding: 12px 16px;
  background: #f8f9fa;
  border-radius: 10px;
  font-size: 14px;
`;

const Spacer = styled.div<{ size?: number }>`
  height: ${(p) => p.size || 16}px;
`;

// --- Step 1: 팀 프로필 생성 ---
const TeamProfileCreation: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [teamName, setTeamName] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (!teamName) {
      setError("팀 이름을 입력해주세요.");
      return;
    }
    if (teamName.length > 10) {
      setError("10자 이내로 입력해주세요.");
      return;
    }
    // 초성/모음만 있는 경우 체크 (완성형 한글이 아닌 자음/모음이 포함된 경우)
    if (/[ㄱ-ㅎㅏ-ㅣ]/.test(teamName)) {
      setError("올바른 한글을 입력해주세요 (자음/모음만 입력 불가).");
      return;
    }
    onNext({ teamName, profileImage, profileImageFile });
  };

  return (
    <>
      <Title>팀 프로필 생성</Title>
      <SubTitle>팀의 이름과 프로필 사진을 설정해주세요</SubTitle>

      <ImageSection>
        <ProfileImageWrapper>
          {profileImage ? (
            <ProfileImage src={profileImage} alt="Profile" />
          ) : (
            <ProfilePlaceholder>⚽</ProfilePlaceholder>
          )}
          <CameraButton onClick={() => fileInputRef.current?.click()}>
            <HiCamera size={18} />
          </CameraButton>
        </ProfileImageWrapper>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleImageUpload}
        />
        <ImageButtons>
          <SecondaryButton
            onClick={() => {
              setProfileImage(null);
              setProfileImageFile(null);
            }}
          >
            기본 이미지
          </SecondaryButton>
          <SecondaryButton onClick={() => fileInputRef.current?.click()}>
            사진 선택
          </SecondaryButton>
        </ImageButtons>
      </ImageSection>

      <InputLabel>팀 이름</InputLabel>
      <Input
        type="text"
        height={50}
        placeholder="팀 이름 (10자 이내)"
        value={teamName}
        onChange={(e) => {
          setTeamName(e.target.value);
          setError(null);
        }}
        hasError={!!error}
      />
      {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}

      <PrimaryButton onClick={handleNext}>다음</PrimaryButton>
    </>
  );
};

// --- Step 2: 팀 상세정보 (1) ---
const TeamDetailOne: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [schedule, setSchedule] = useState(
    Array.from({ length: 7 }, () => Array(6).fill(false))
  );
  const [region, setRegion] = useState("");
  const [address, setAddress] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const times = ["아침", "오전", "점심", "오후", "저녁", "밤"];

  const toggle = (d: number, t: number) => {
    setSchedule((prev) => {
      const u = prev.map((r) => [...r]);
      u[d][t] = !u[d][t];
      return u;
    });
  };

  const handleNext = () => {
    if (!region || !address || !schedule.flat().includes(true)) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    if (/[ㄱ-ㅎㅏ-ㅣ]/.test(region)) {
      setError("지역명에 올바른 한글을 입력해주세요 (자음/모음만 입력 불가).");
      return;
    }
    onNext({ region, selectedAddress: address, activitySchedule: schedule });
  };

  return (
    <>
      <Title>팀 상세정보</Title>
      <SubTitle>활동 지역, 경기장, 스케줄을 설정해주세요</SubTitle>
      {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}

      <InputLabel>주요 활동 지역</InputLabel>
      <Input
        type="text"
        height={50}
        placeholder="예: 서울 강남구"
        value={region}
        onChange={(e) => setRegion(e.target.value)}
      />

      <InputLabel>활동 경기장</InputLabel>
      <SecondaryButton onClick={() => setShowMap(true)}>
        🔍 주소 찾기
      </SecondaryButton>
      {showMap && (
        <KakaoMapModal
          onClose={() => setShowMap(false)}
          onAddressSelect={(a) => {
            setAddress(a);
            setShowMap(false);
          }}
        />
      )}
      {address && <SelectedAddress>{address}</SelectedAddress>}

      <InputLabel>주요 활동 시간</InputLabel>
      <ScheduleTable>
        <thead>
          <tr>
            <ScheduleHeaderCell />
            {times.map((t, i) => (
              <ScheduleHeaderCell key={i}>{t}</ScheduleHeaderCell>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((d, di) => (
            <tr key={di}>
              <ScheduleCell
                style={{ fontWeight: "bold", background: "#f7f7f7" }}
              >
                {d}
              </ScheduleCell>
              {times.map((_, ti) => (
                <ScheduleCell
                  key={ti}
                  selected={schedule[di][ti]}
                  onClick={() => toggle(di, ti)}
                >
                  {schedule[di][ti] ? "✓" : ""}
                </ScheduleCell>
              ))}
            </tr>
          ))}
        </tbody>
      </ScheduleTable>

      <PrimaryButton onClick={handleNext}>다음</PrimaryButton>
    </>
  );
};

// --- Step 3: 팀 상세정보 (2) ---
const TeamDetailTwo: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [gender, setGender] = useState("");
  const [ages, setAges] = useState<boolean[]>(Array(6).fill(false));
  const [fee, setFee] = useState("");
  const [level, setLevel] = useState("");
  const [error, setError] = useState<string | null>(null);

  const ageLabels = ["20대", "30대", "40대", "50대", "60대", "70대+"];

  const handleNext = () => {
    if (!gender || !ages.includes(true) || !fee || !level) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    const selected = ages
      .map((s, i) => (s ? ageLabels[i] : null))
      .filter(Boolean) as string[];
    onNext({ gender, ageGroups: selected, fee, teamLevel: level });
  };

  return (
    <>
      <Title>팀 상세정보</Title>
      <SubTitle>팀에 대한 추가 정보를 입력해주세요</SubTitle>
      {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}

      <InputLabel>성별</InputLabel>
      <RadioButton
        fontSize={14}
        items={["남성만", "여성만", "남녀 모두"]}
        selectedItem={gender}
        onChange={setGender}
      />

      <InputLabel>나이대 (복수 선택)</InputLabel>
      <CheckButton
        items={ageLabels}
        selectedBgColor="var(--color-main)"
        textColor="var(--color-dark1)"
        selectedStates={ages}
        onItemClick={(i) => {
          const u = [...ages];
          u[i] = !u[i];
          setAges(u);
        }}
      />

      <InputLabel>월 회비</InputLabel>
      <Input
        type="text"
        height={50}
        placeholder="예: 30,000원"
        value={fee}
        onChange={(e) => setFee(e.target.value.replace(/[^0-9]/g, ""))}
      />

      <InputLabel>팀 수준</InputLabel>
      <RadioButton
        fontSize={14}
        items={["상", "중", "하"]}
        selectedItem={level}
        onChange={setLevel}
      />

      <PrimaryButton onClick={handleNext}>다음</PrimaryButton>
    </>
  );
};

// --- Step 4: 선수 모집 공고 ---
const PlayerRecruitment: React.FC<{ onNext: (data: any) => void }> = ({
  onNext,
}) => {
  const [positions, setPositions] = useState<boolean[]>(Array(4).fill(false));
  const [desc, setDesc] = useState("");
  const [posError, setPosError] = useState<string | null>(null);
  const [descError, setDescError] = useState<string | null>(null);

  const posLabels = ["공격수", "수비수", "미드필더", "골키퍼"];
  const posMap: Record<string, string> = {
    공격수: "FW",
    수비수: "DF",
    미드필더: "MF",
    골키퍼: "GK",
  };

  const handleNext = () => {
    const noPos = !positions.includes(true);
    const noDesc = !desc.trim();
    setPosError(noPos ? "포지션을 선택해주세요." : null);
    setDescError(noDesc ? "하고 싶은 말을 입력해주세요." : null);
    if (noPos || noDesc) return;
    const selected = positions
      .map((s, i) => (s ? posMap[posLabels[i]] : null))
      .filter(Boolean) as string[];
    onNext({ positions: selected, description: desc });
  };

  return (
    <>
      <Title>선수 모집 공고</Title>
      <SubTitle>필요한 포지션과 팀 소개를 작성해주세요</SubTitle>

      <InputLabel>필요한 포지션</InputLabel>
      <CheckButton
        items={posLabels}
        selectedBgColor="var(--color-main)"
        textColor="var(--color-dark1)"
        selectedStates={positions}
        onItemClick={(i) => {
          const u = [...positions];
          u[i] = !u[i];
          setPositions(u);
          setPosError(null);
        }}
      />
      {posError && <ErrorMessage>⚠️ {posError}</ErrorMessage>}

      <InputLabel>하고 싶은 말</InputLabel>
      <StyledTextArea
        placeholder="팀을 소개하고 원하는 선수에 대해 적어주세요"
        value={desc}
        onChange={(e) => {
          setDesc(e.target.value);
          setDescError(null);
        }}
        hasError={!!descError}
      />
      {descError && <ErrorMessage>⚠️ {descError}</ErrorMessage>}

      <PrimaryButton onClick={handleNext}>팀 생성 완료</PrimaryButton>
    </>
  );
};

// --- Step 5: 완료 ---
const TeamCreationComplete: React.FC<{ inviteCode: string }> = ({
  inviteCode,
}) => {
  const navigate = useNavigate();

  const copy = () => {
    navigator.clipboard
      ?.writeText(inviteCode)
      .then(() => alert("초대코드가 복사되었습니다!"));
  };

  return (
    <CompleteContainer>
      <SuccessIcon>
        <HiCheckCircle size={40} />
      </SuccessIcon>
      <Title>팀 생성 완료! 🎉</Title>
      <SubTitle>초대코드를 복사해 선수들을 초대하세요</SubTitle>

      <InviteCodeBox>
        <InviteCode>{inviteCode}</InviteCode>
        <CopyButton onClick={copy}>
          <HiClipboard size={18} /> 복사
        </CopyButton>
      </InviteCodeBox>

      <PrimaryButton onClick={() => navigate("/myteam")}>
        메인으로 이동
      </PrimaryButton>
    </CompleteContainer>
  );
};

// --- 전체 페이지 ---
const TeamCreationPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [final, setFinal] = useState({ teamId: 0, inviteCode: "" });
  const navigate = useNavigate();

  const handleNext = async (d: any = {}) => {
    const updated = { ...data, ...d };
    setData(updated);

    if (step === 4) {
      setLoading(true);
      const times = ["아침", "오전", "점심", "오후", "저녁", "밤"];
      const schedArr: string[][] = Array.from({ length: 7 }, () => []);
      (updated.activitySchedule || []).forEach((day: boolean[], di: number) => {
        day.forEach((sel, ti) => {
          if (sel) schedArr[di].push(times[ti]);
        });
      });

      const ages = (updated.ageGroups as string[])
        .map((a) => parseInt(a.replace(/[^0-9]/g, "")))
        .sort((a, b) => a - b);
      const ageRange =
        ages.length > 1 ? `${ages[0]}-${ages[ages.length - 1]}` : `${ages[0]}`;
      const town = (updated.selectedAddress?.split(" ") || [])[1] || "";

      const req = {
        teamName: updated.teamName,
        team_introduce: updated.description,
        region: updated.region,
        town,
        matchLocation: updated.selectedAddress,
        activitySchedule: schedArr,
        teamGender: updated.gender.replace("만", "").replace(" 모두", ""),
        ageRange,
        dues: updated.fee,
        teamLevel: updated.teamLevel,
        positionRequired: updated.positions,
      };

      try {
        const res = await apiClient.post("/api/team/create", req, {
          headers: { "Content-Type": "application/json" },
        });
        if (res.status === 200 || res.status === 201) {
          const { teamId, inviteCode } = res.data;
          setFinal({ teamId, inviteCode });
          if (updated.profileImageFile) {
            const fd = new FormData();
            fd.append("image", updated.profileImageFile);
            fd.append("teamId", String(teamId));
            await apiClient.post("/api/team/upload/image", fd, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          }
          setStep(5);
        } else {
          alert("팀 생성에 실패했습니다.");
        }
      } catch (e) {
        console.error(e);
        alert("서버 오류가 발생했습니다.");
        navigate("/team/list");
      } finally {
        setLoading(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  return (
    <PageWrapper>
      <BackgroundDecoration />
      <ContentWrapper>
        <Header>
          <BackButton to="/team/list">
            <HiArrowLeft size={22} />
          </BackButton>
          <HeaderInfo>
            <StepIndicator>{step <= 4 ? `${step} / 4` : "완료"}</StepIndicator>
          </HeaderInfo>
        </Header>

        {step <= 4 && (
          <ProgressContainer>
            <ScrollProgress targetWidth={(step / 4) * 100} />
          </ProgressContainer>
        )}

        <Card>
          {step === 1 && <TeamProfileCreation onNext={handleNext} />}
          {step === 2 && <TeamDetailOne onNext={handleNext} />}
          {step === 3 && <TeamDetailTwo onNext={handleNext} />}
          {step === 4 && <PlayerRecruitment onNext={handleNext} />}
          {step === 5 && <TeamCreationComplete inviteCode={final.inviteCode} />}
          {loading && <Spacer size={20} />}
          {loading && <LoadingSpinner />}
        </Card>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default TeamCreationPage;
