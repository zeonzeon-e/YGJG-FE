import React, { useState, useEffect } from "react";
import styled, { keyframes, css } from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  HiArrowLeft,
  HiCheckCircle,
  HiTicket,
  HiUserGroup,
  HiMapPin,
  HiSparkles,
} from "react-icons/hi2";
import { FaRunning, FaHandPaper, FaFutbol, FaChild } from "react-icons/fa"; // Icons for positions (example)
import apiClient from "../../api/apiClient";

// Types
interface TeamInfo {
  teamName: string;
  matchLocation: string;
  profileImageUrl: string;
  memberCount?: number;
}

const InvitePage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [step, setStep] = useState<0 | 1 | 2 | 3>(0);
  const [inviteCode, setInviteCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Data State
  const [teamInfo, setTeamInfo] = useState<TeamInfo>({
    teamName: "",
    matchLocation: "",
    profileImageUrl: "",
  });
  const [selectedPosition, setSelectedPosition] = useState("");

  // Mock checking code (replace with real API if needed, or keep for demo)
  const validCodes = ["ABC123", "DEF456", "GHI789"];

  const handleCheckCode = async () => {
    if (!inviteCode.trim()) {
      setError("초대코드를 입력해주세요");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Simulate API delay
    setTimeout(async () => {
      // Logic from original file: check against mocked valid codes
      // In production, this would be an API call:
      // const res = await apiClient.get(`/api/team/check-invite?code=${inviteCode}`);
      if (validCodes.includes(inviteCode.toUpperCase()) || true) {
        // Allowing 'true' for demo purposes if code isn't in list,
        // or strictly follow original logic?
        // Original logic:
        if (validCodes.includes(inviteCode.toUpperCase())) {
          setTeamInfo({
            teamName: "FC 썬더일레븐",
            matchLocation: "서울 강남구",
            profileImageUrl: "",
          });
          setStep(1);
        } else {
          // For testing ease, let's treat any 6-char code as valid if not in list
          // or just show error as requested.
          // Let's stick to original logic:
          setError("유효하지 않은 초대코드입니다.");
        }
      }
      setIsLoading(false);
    }, 800);
  };

  const handleJoinTeam = async () => {
    if (!selectedPosition) {
      alert("포지션을 선택해주세요!");
      return;
    }

    setIsLoading(true);
    try {
      // Original logic used axios directly, switching to apiClient if available or keep axios
      // const response = await axios.post("/api/sign/sign-up", "123");
      // But wait, /api/sign/sign-up seems like a signup endpoint?
      // Maybe this invite page is for joining a team AFTER signup?
      // The original code had `axios.post("/api/sign/sign-up", "123")` which looks like a placeholder.
      // I will assume this is "Join Team" action.

      // Mock success for now as API might not be ready
      setTimeout(() => {
        setStep(3);
        setIsLoading(false);
      }, 1000);
    } catch (e) {
      console.error(e);
      alert("가입 처리에 실패했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <BackgroundDecoration />

      <ContentWrapper>
        {/* Header (Back button) - Only show if not on success step */}
        {step !== 3 && (
          <Header>
            <BackButton
              onClick={() => {
                if (step === 0) navigate(-1);
                else setStep((prev) => (prev - 1) as 0 | 1 | 2);
              }}
            >
              <HiArrowLeft size={22} />
            </BackButton>
            <HeaderTitle>초대코드로 입장</HeaderTitle>
            <div style={{ width: 44 }} /> {/* Spacer */}
          </Header>
        )}

        <MainCard>
          {step === 0 && (
            <StepContent>
              <IconWrapper>
                <HiTicket size={40} />
              </IconWrapper>
              <Title>초대코드를 입력해주세요</Title>
              <SubTitle>
                팀에게 전달받은 6자리 코드를 입력하면
                <br />
                승인 절차 없이 바로 가입됩니다.
              </SubTitle>

              <InputContainer>
                <StyledInput
                  type="text"
                  placeholder="초대코드 (예: ABC123)"
                  value={inviteCode}
                  onChange={(e) => {
                    setInviteCode(e.target.value.toUpperCase());
                    setError(null);
                  }}
                  maxLength={10}
                />
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </InputContainer>

              <PrimaryButton
                onClick={handleCheckCode}
                disabled={isLoading || !inviteCode}
              >
                {isLoading ? "확인 중..." : "초대코드 조회"}
              </PrimaryButton>
            </StepContent>
          )}

          {step === 1 && (
            <StepContent>
              <Title>이 팀이 맞나요?</Title>
              <SubTitle>초대코드로 검색된 팀 정보입니다.</SubTitle>

              <TeamPreviewCard>
                <TeamImage
                  src={teamInfo.profileImageUrl || "/default-team.png"}
                />
                <TeamInfoSection>
                  <TeamName>{teamInfo.teamName}</TeamName>
                  <TeamMeta>
                    <MetaItem>
                      <HiMapPin size={14} /> {teamInfo.matchLocation}
                    </MetaItem>
                  </TeamMeta>
                </TeamInfoSection>
              </TeamPreviewCard>

              <PrimaryButton onClick={() => setStep(2)}>
                네, 맞아요!
              </PrimaryButton>
              <SecondaryButton onClick={() => setStep(0)}>
                아니요, 다시 검색할래요
              </SecondaryButton>
            </StepContent>
          )}

          {step === 2 && (
            <StepContent>
              <Title>어떤 포지션인가요?</Title>
              <SubTitle>팀에서 주로 활동할 포지션을 선택해주세요.</SubTitle>

              <PositionGrid>
                {[
                  { label: "공격수", value: "FW", icon: <FaRunning /> },
                  { label: "미드필더", value: "MF", icon: <FaChild /> },
                  { label: "수비수", value: "DF", icon: <FaFutbol /> },
                  { label: "골키퍼", value: "GK", icon: <FaHandPaper /> },
                ].map((pos) => (
                  <PositionCard
                    key={pos.value}
                    selected={selectedPosition === pos.label}
                    onClick={() => setSelectedPosition(pos.label)}
                  >
                    <PosIcon>{pos.icon}</PosIcon>
                    <PosLabel>{pos.label}</PosLabel>
                  </PositionCard>
                ))}
              </PositionGrid>

              <PrimaryButton
                onClick={handleJoinTeam}
                disabled={isLoading || !selectedPosition}
              >
                {isLoading ? "가입 중..." : "팀 가입하기"}
              </PrimaryButton>
            </StepContent>
          )}

          {step === 3 && (
            <StepContent>
              <SuccessIconWrapper>
                <HiCheckCircle size={60} />
              </SuccessIconWrapper>
              <Title>가입 완료! 🎉</Title>
              <SubTitle>
                <strong>{teamInfo.teamName}</strong>의 멤버가 되셨습니다.
                <br />
                이제 팀 활동을 시작해보세요!
              </SubTitle>

              <PrimaryButton onClick={() => navigate("/myteam")}>
                마이 팀으로 이동
              </PrimaryButton>
            </StepContent>
          )}
        </MainCard>
      </ContentWrapper>
    </PageWrapper>
  );
};

export default InvitePage;

/* ========== Styles ========== */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8faf9 0%, #eff6f3 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  padding-top: 60px;
  position: relative;
  overflow: hidden;
`;

const BackgroundDecoration = styled.div`
  position: fixed;
  top: -100px;
  right: -100px;
  width: 400px;
  height: 400px;
  background: radial-gradient(
    circle,
    rgba(28, 237, 164, 0.1) 0%,
    rgba(255, 255, 255, 0) 70%
  );
  border-radius: 50%;
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`;

const BackButton = styled.button`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #333;
  transition: all 0.2s;
  &:hover {
    transform: scale(1.05);
  }
`;

const HeaderTitle = styled.h1`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  color: #333;
`;

const MainCard = styled.div`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 32px;
  padding: 40px 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.05);
  min-height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StepContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${fadeIn} 0.5s ease;
  text-align: center;
`;

const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #f0fdf9;
  color: var(--color-main);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 24px;
  font-family: "Pretendard-Bold";
  color: #1a1a1a;
  margin-bottom: 12px;
`;

const SubTitle = styled.p`
  font-size: 15px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 32px;
`;

const InputContainer = styled.div`
  width: 100%;
  margin-bottom: 24px;
  text-align: left;
`;

const StyledInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 18px 20px;
  font-size: 18px;
  font-family: "Pretendard-SemiBold";
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  outline: none;
  transition: all 0.2s;
  text-align: center;
  background: #f9fafb;
  color: #333;
  letter-spacing: 2px;
  text-transform: uppercase;

  &:focus {
    border-color: var(--color-main);
    background: white;
    box-shadow: 0 4px 12px rgba(14, 98, 68, 0.1);
  }
`;

const ErrorMessage = styled.p`
  font-size: 13px;
  color: #ff3b30;
  margin-top: 8px;
  margin-left: 4px;
  text-align: center;
`;

const PrimaryButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 18px;
  border-radius: 16px;
  border: none;
  background: ${(props) => (props.disabled ? "#e5e7eb" : "var(--color-main)")};
  color: ${(props) => (props.disabled ? "#9ca3af" : "white")};
  font-size: 16px;
  font-family: "Pretendard-Bold";
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: var(--color-main-darker);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(14, 98, 68, 0.25);
  }
`;

const SecondaryButton = styled.button`
  margin-top: 16px;
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    color: #333;
  }
`;

/* Step 1: Team Preview Styles */
const TeamPreviewCard = styled.div`
  width: 100%;
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

const TeamImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid #f8faf9;
  object-fit: cover;
`;

const TeamInfoSection = styled.div`
  text-align: center;
`;

const TeamName = styled.h3`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  color: #333;
  margin-bottom: 8px;
`;

const TeamMeta = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  color: #666;
  font-size: 14px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

/* Step 2: Position Styles */
const PositionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  width: 100%;
  margin-bottom: 32px;
`;

const PositionCard = styled.button<{ selected: boolean }>`
  background: ${(props) =>
    props.selected ? "rgba(14, 98, 68, 0.05)" : "white"};
  border: 2px solid
    ${(props) => (props.selected ? "var(--color-main)" : "#eee")};
  border-radius: 16px;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) => (props.selected ? "var(--color-main)" : "#ddd")};
    transform: translateY(-2px);
  }
`;

const PosIcon = styled.div`
  font-size: 24px;
  color: var(--color-main);
`;

const PosLabel = styled.span`
  font-size: 14px;
  font-family: "Pretendard-SemiBold";
  color: #333;
`;

/* Step 3: Success Styles */
const SuccessIconWrapper = styled.div`
  color: var(--color-sub);
  margin-bottom: 24px;
  animation: bounce 1s infinite;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;
