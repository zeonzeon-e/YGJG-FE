import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import {
  HiChevronLeft,
  HiCheckCircle,
  HiUserCircle,
  HiListBullet,
  HiChevronDown,
} from "react-icons/hi2";
import apiClient from "../../api/apiClient";
import MainButton from "../../components/Button/MainButton";
import Modal2 from "../../components/Modal/Modal2";
import AlertModal from "../../components/Modal/AlertModal";

// --- Types ---
type Profile = {
  address: string;
  gender: string;
  hasExperience: boolean;
  joinReason: string;
  level: string;
  name: string;
  position: string;
};

// --- Mock Data ---
const MOCK_PROFILE: Profile = {
  address: "서울시 송파구",
  gender: "남성",
  hasExperience: true,
  joinReason: "",
  level: "아마추어 중급",
  name: "김철수",
  position: "",
};

const POSITIONS = [
  { value: "FW", label: "공격수 (FW)" },
  { value: "MF", label: "미드필더 (MF)" },
  { value: "DF", label: "수비수 (DF)" },
  { value: "GK", label: "골키퍼 (GK)" },
];

const TeamJoinPage: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [content, setContent] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [completeOpen, setCompleteOpen] = useState(false);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  // Custom Dropdown State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Alert Modal State
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get("api/member/getUser");
        setProfile({
          address: response.data.address,
          gender: response.data.gender,
          hasExperience: response.data.hasExperience,
          joinReason: response.data.joinReason,
          level: response.data.level,
          name: response.data.name,
          position: response.data.position,
        });
        setPosition(response.data.position || "");
      } catch (err) {
        console.warn("Failed to fetch user, utilizing mock data for dev.");
        setProfile(MOCK_PROFILE);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handlePositionSelect = (value: string) => {
    setPosition(value);
    setIsDropdownOpen(false);
  };

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleSubmit = () => {
    if (!content.trim() || !position) {
      showAlert("입력 확인", "포지션을 선택하고\n가입 인사를 입력해주세요.");
      return;
    }
    setCompleteOpen(true);
  };

  const doApprove = async () => {
    setCompleteOpen(false);

    if (!profile || !teamId) return;

    const requestDto = {
      address: profile.address,
      gender: profile.gender,
      hasExperience: profile.hasExperience,
      joinReason: content,
      level: profile.level,
      name: profile.name,
      position: position,
    };

    try {
      const response = await apiClient.post(
        `api/joinTeam/${teamId}`,
        requestDto,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 200) {
        setComplete(true);
      }
    } catch (error) {
      console.error("Failed to join team:", error);
      showAlert(
        "오류",
        "가입 신청 중 오류가 발생했습니다.\n다시 시도해주세요."
      );
    }
  };

  if (loading) {
    return (
      <LoadingWrapper>
        <Spinner />
      </LoadingWrapper>
    );
  }

  // --- Complete State UI ---
  if (complete) {
    return (
      <CompletionPage>
        <SuccessContent>
          <SuccessIcon>
            <HiCheckCircle size={64} />
          </SuccessIcon>
          <SuccessTitle>가입 신청 완료!</SuccessTitle>
          <SuccessText>
            팀 운영진에게 가입 신청서를 보냈습니다.
            <br />
            결과는 <strong>마이페이지 &gt; 가입 현황</strong>에서
            <br />
            확인하실 수 있습니다.
          </SuccessText>
        </SuccessContent>
        <ActionButtons>
          <PrimaryButton onClick={() => navigate("/my/joinstatus")}>
            신청 현황 확인하기
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate("/team/list")}>
            다른 팀 더 둘러보기
          </SecondaryButton>
        </ActionButtons>
      </CompletionPage>
    );
  }

  return (
    <PageWrapper>
      <NavHeader>
        <NavButton onClick={() => navigate(-1)}>
          <HiChevronLeft size={24} />
        </NavButton>
        <NavTitle>가입 신청하기</NavTitle>
        <div style={{ width: 40 }} /> {/* Spacer */}
      </NavHeader>

      <ContentScroll>
        <HeaderSection>
          <HeaderTitle>
            팀원들에게 보여질
            <br />
            <Highlight>나의 정보</Highlight>를 확인해주세요
          </HeaderTitle>
          <HeaderDesc>
            프로필 정보는 마이페이지에서 언제든지 수정할 수 있습니다.
          </HeaderDesc>
        </HeaderSection>

        <FormSection>
          {/**************** User Info Card ****************/}
          <Card>
            <CardHeader>
              <CardIcon>
                <HiUserCircle />
              </CardIcon>
              <CardTitle>기본 프로필</CardTitle>
            </CardHeader>
            <InfoGrid>
              <InfoRow>
                <Label>이름</Label>
                <Value>{profile?.name}</Value>
              </InfoRow>
              <InfoRow>
                <Label>성별</Label>
                <Value>{profile?.gender}</Value>
              </InfoRow>
              <InfoRow>
                <Label>거주지</Label>
                <Value>{profile?.address}</Value>
              </InfoRow>
            </InfoGrid>
          </Card>

          {/**************** Ability Info Card ****************/}
          {profile?.hasExperience !== undefined && (
            <Card>
              <CardHeader>
                <CardIcon color="var(--color-success)">
                  <HiListBullet />
                </CardIcon>
                <CardTitle>실력 및 경험</CardTitle>
              </CardHeader>
              <InfoGrid>
                <InfoRow>
                  <Label>선수 경험</Label>
                  <Value>{profile?.hasExperience ? "있음" : "없음"}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>실력 수준</Label>
                  <Value>{profile?.level}</Value>
                </InfoRow>
              </InfoGrid>
            </Card>
          )}

          {/**************** Position & Message Form ****************/}
          <SectionDivider />

          <FormGroup style={{ position: "relative", zIndex: 10 }}>
            <FormLabel>
              희망 포지션 <Required>*</Required>
            </FormLabel>

            {/* Custom Dropdown */}
            <DropdownContainer ref={dropdownRef}>
              <DropdownTrigger
                isOpen={isDropdownOpen}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                isSelected={!!position}
              >
                <span>
                  {position
                    ? POSITIONS.find((p) => p.value === position)?.label
                    : "포지션을 선택해주세요"}
                </span>
                <HiChevronDown
                  size={20}
                  style={{
                    transform: isDropdownOpen
                      ? "rotate(180deg)"
                      : "rotate(0deg)",
                    transition: "transform 0.2s",
                  }}
                />
              </DropdownTrigger>

              {isDropdownOpen && (
                <DropdownMenu>
                  {POSITIONS.map((opt) => (
                    <DropdownItem
                      key={opt.value}
                      isActive={position === opt.value}
                      onClick={() => handlePositionSelect(opt.value)}
                    >
                      {opt.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              )}
            </DropdownContainer>
          </FormGroup>

          <FormGroup>
            <FormLabel>
              가입 인사 <Required>*</Required>
            </FormLabel>
            <StyledTextarea
              value={content}
              onChange={handleContentChange}
              placeholder="간단한 자기소개와 가입 동기를 입력해주세요. (예: 매주 꾸준히 참석 가능한 풋살 러버입니다!)"
            />
          </FormGroup>
        </FormSection>
      </ContentScroll>

      <BottomAction>
        <MainButton onClick={handleSubmit}>가입 신청서 보내기</MainButton>
      </BottomAction>

      {/* Confirmation Modal */}
      <Modal2
        isOpen={completeOpen}
        onClose={() => setCompleteOpen(false)}
        title="가입 신청을 완료할까요?"
        children="신청서는 팀 운영진에게 전달되며, 승인 완료 시 활동을 시작할 수 있습니다."
        confirmText="신청하기"
        cancelText="취소"
        onConfirm={doApprove}
      />

      {/* Alert Modal */}
      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertTitle}
        message={alertMessage}
        type="alert"
        variant="danger"
      />
    </PageWrapper>
  );
};

export default TeamJoinPage;

// --- Styled Components ---

const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f8fafb;
`;

const NavHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: white;
  border-bottom: 1px solid #f1f3f5;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NavTitle = styled.h1`
  font-size: 16px;
  font-weight: 700;
  color: #333;
`;

const ContentScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-bottom: 120px;
`;

const HeaderSection = styled.div`
  padding: 24px 20px;
  background: white;
  margin-bottom: 12px;
`;

const HeaderTitle = styled.h2`
  font-size: 22px;
  color: #212529;
  line-height: 1.4;
  margin-bottom: 8px;
  font-weight: 700;
`;

const Highlight = styled.span`
  color: var(--color-main);
`;

const HeaderDesc = styled.p`
  font-size: 14px;
  color: #868e96;
  line-height: 1.5;
`;

const FormSection = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #f1f3f5;
`;

const CardIcon = styled.div<{ color?: string }>`
  font-size: 20px;
  color: ${(props) => props.color || "var(--color-main)"};
  display: flex;
  align-items: center;
`;

const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #333;
`;

const InfoGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.span`
  font-size: 14px;
  color: #868e96;
`;

const Value = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const SectionDivider = styled.div`
  height: 1px;
  background: #e9ecef;
  margin: 8px 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

const Required = styled.span`
  color: var(--color-error);
  margin-left: 2px;
`;

// Dropdown Styles
const DropdownContainer = styled.div`
  position: relative;
  width: 100%;
`;

const DropdownTrigger = styled.div<{ isOpen: boolean; isSelected: boolean }>`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid
    ${(props) => (props.isOpen ? "var(--color-main)" : "#dee2e6")};
  background-color: white;
  font-size: 15px;
  color: ${(props) =>
    props.isSelected ? "#333" : "#adb5bd"}; /* Changed color for placeholder */
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  box-shadow: ${(props) =>
    props.isOpen ? "0 0 0 2px rgba(45, 138, 94, 0.1)" : "none"};
  transition: all 0.2s;

  &:hover {
    border-color: ${(props) =>
      props.isOpen ? "var(--color-main)" : "#adb5bd"};
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: white;
  border-radius: 12px;
  border: 1px solid #f1f3f5;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 100;
  padding: 6px;
  animation: ${fadeIn} 0.2s ease-out;
`;

const DropdownItem = styled.div<{ isActive: boolean }>`
  padding: 12px 14px;
  font-size: 15px;
  color: ${(props) => (props.isActive ? "var(--color-main)" : "#333")};
  background: ${(props) => (props.isActive ? "#f8f9fa" : "white")};
  font-weight: ${(props) => (props.isActive ? "600" : "400")};
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background: #f1f3f5;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  height: 150px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #dee2e6;
  background-color: white;
  font-size: 15px;
  line-height: 1.5;
  resize: none;
  color: #333;
  box-sizing: border-box;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--color-main);
    box-shadow: 0 0 0 2px rgba(45, 138, 94, 0.1);
  }

  &::placeholder {
    color: #adb5bd;
    font-family: inherit;
  }
`;

const BottomAction = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px 20px 30px;
  border-top: 1px solid #f1f3f5;
  z-index: 1001;
  max-width: 600px;
  margin: 0 auto;
`;

const LoadingWrapper = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--color-main);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Completion Page Styles
const CompletionPage = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: white;
  padding: 20px;
`;

const SuccessContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 60px;
`;

const SuccessIcon = styled.div`
  color: var(--color-main);
  margin-bottom: 24px;
`;

const SuccessTitle = styled.h2`
  font-size: 24px;
  font-weight: 800;
  color: #212529;
  margin-bottom: 12px;
`;

const SuccessText = styled.p`
  font-size: 16px;
  color: #868e96;
  line-height: 1.6;

  strong {
    color: #333;
    font-weight: 600;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 40px;
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 16px;
  background: var(--color-main);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #f1f3f5;
  color: #495057;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`;
