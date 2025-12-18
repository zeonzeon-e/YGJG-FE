import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { HiCamera, HiChevronLeft } from "react-icons/hi2";
import apiClient from "../../api/apiClient";
import MainButton from "../../components/Button/MainButton";
import KakaoMapModal from "../../components/Modal/KakaoAddress";
import AlertModal from "../../components/Modal/AlertModal";

// --- Types ---
type UserProfile = {
  name: string;
  email: string;
  profileUrl: string;
  phoneNum: string;
  // Note: birthDate format in backend might differ, assuming string YYYYMMDD
  birthDate: string;
  gender: string;
  address: string;
  hasExperience: boolean;
  memberLevel: string; // "중학교 선출" etc.
  level: string; // "상", "중", "하"
};

const EXPERIENCE_OPTIONS = [
  { value: true, label: "있음" },
  { value: false, label: "없음" },
];

const MEMBER_LEVEL_OPTIONS = [
  "비선출",
  "중학교 선출",
  "고등학교 선출",
  "대학교 선출",
  "프로 선출",
];
const SKILL_LEVEL_OPTIONS = [
  { value: "상", label: "상 (Pro/Semi-Pro)" },
  { value: "중", label: "중 (Amateur)" },
  { value: "하", label: "하 (Beginner)" },
];

const ProfileEditPage: React.FC = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [showMapModal, setShowMapModal] = useState(false);

  // Alert State
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const [form, setForm] = useState<UserProfile>({
    name: "",
    email: "",
    profileUrl: "",
    phoneNum: "",
    birthDate: "",
    gender: "",
    address: "",
    hasExperience: false,
    memberLevel: "",
    level: "",
  });

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/api/member/getUser");
      const data = response.data;

      setForm({
        name: data.name || "",
        email: data.email || "",
        profileUrl: data.profileUrl || "",
        phoneNum: data.phoneNum || "",
        birthDate: data.birthDate || "",
        gender: data.gender || "",
        address: data.address || "",
        hasExperience: data.hasExperience ?? false,
        memberLevel: data.memberLevel || "",
        level: data.level || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      showAlert("오류", "프로필 정보를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressSelect = (address: string) => {
    handleChange("address", address);
    setShowMapModal(false);
  };

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setForm((prev) => ({ ...prev, profileUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const showAlert = (title: string, message: string) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertOpen(true);
  };

  const handleSubmit = async () => {
    // Basic Validation
    if (!form.phoneNum || !form.birthDate || !form.address) {
      showAlert("필수 입력", "필수 정보를 모두 입력해주세요.");
      return;
    }

    try {
      // 1. Update User Info (JSON)
      const payload = {
        ...form,
        // Ensure specific types if needed by backend
      };
      await apiClient.put("/api/member/updateUser", payload);

      // 2. Upload Profile Image (if selected)
      if (profileImageFile) {
        const fd = new FormData();
        fd.append("image", profileImageFile);
        await apiClient.post("/api/member/upload/image", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      showAlert("성공", "프로필이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("Error updating profile:", error);
      showAlert("오류", "프로필 수정 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <LoadingScreen>로딩중...</LoadingScreen>;

  return (
    <PageWrapper>
      <NavHeader>
        <NavButton onClick={() => navigate(-1)}>
          <HiChevronLeft size={24} />
        </NavButton>
        <NavTitle>프로필 수정</NavTitle>
        <div style={{ width: 40 }} />
      </NavHeader>

      <ContentScroll>
        {/* Profile Image Section */}
        <ProfileHeader>
          <ImageWrapper>
            <ProfileImg
              src={form.profileUrl || "https://via.placeholder.com/150"}
            />
            <EditIconWrapper onClick={() => fileInputRef.current?.click()}>
              <HiCamera size={16} color="white" />
            </EditIconWrapper>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleImageChange}
            />
          </ImageWrapper>
          <ProfileName>{form.name}</ProfileName>
          <ProfileEmail>{form.email}</ProfileEmail>
        </ProfileHeader>

        <Section>
          <SectionTitle>기본 정보</SectionTitle>

          <FormGroup>
            <Label>전화번호</Label>
            <InputGroup>
              <StyledInput
                type="text"
                value={form.phoneNum}
                onChange={(e) => handleChange("phoneNum", e.target.value)}
                placeholder="010-0000-0000"
              />
              <MainButton
                width={80}
                style={{
                  height: "48px",
                  borderRadius: "12px",
                  fontSize: "14px",
                }}
              >
                인증
              </MainButton>
            </InputGroup>
          </FormGroup>

          <FormGroup>
            <Label>생년월일 (6자리)</Label>
            <StyledInput
              type="text"
              value={form.birthDate}
              onChange={(e) => handleChange("birthDate", e.target.value)}
              placeholder="예: 900101"
              maxLength={6}
            />
          </FormGroup>

          <FormGroup>
            <Label>성별</Label>
            <ToggleGroup>
              {["남성", "여성"].map((g) => (
                <ToggleButton
                  key={g}
                  isActive={form.gender === g}
                  onClick={() => handleChange("gender", g)}
                >
                  {g}
                </ToggleButton>
              ))}
            </ToggleGroup>
          </FormGroup>

          <FormGroup>
            <Label>주소</Label>
            <InputGroup>
              <StyledInput
                type="text"
                value={form.address}
                readOnly
                placeholder="주소를 검색해주세요"
                onClick={() => setShowMapModal(true)}
              />
              <MainButton
                width={80}
                onClick={() => setShowMapModal(true)}
                style={{
                  height: "48px",
                  borderRadius: "12px",
                  fontSize: "14px",
                }}
              >
                검색
              </MainButton>
            </InputGroup>
          </FormGroup>
        </Section>

        <Divider />

        <Section>
          <SectionTitle>선수 정보</SectionTitle>

          <FormGroup>
            <Label>선수 출신 여부</Label>
            <ToggleGroup>
              {EXPERIENCE_OPTIONS.map((opt) => (
                <ToggleButton
                  key={opt.label}
                  isActive={form.hasExperience === opt.value}
                  onClick={() => handleChange("hasExperience", opt.value)}
                >
                  {opt.label}
                </ToggleButton>
              ))}
            </ToggleGroup>
          </FormGroup>

          {form.hasExperience && (
            <FormGroup>
              <Label>최종 경력</Label>
              <ChipsContainer>
                {MEMBER_LEVEL_OPTIONS.map((level) => (
                  <Chip
                    key={level}
                    isActive={form.memberLevel === level}
                    onClick={() => handleChange("memberLevel", level)}
                  >
                    {level}
                  </Chip>
                ))}
              </ChipsContainer>
            </FormGroup>
          )}

          <FormGroup>
            <Label>실력 수준</Label>
            <ChipsContainer>
              {SKILL_LEVEL_OPTIONS.map((opt) => (
                <Chip
                  key={opt.value}
                  isActive={form.level === opt.value}
                  onClick={() => handleChange("level", opt.value)}
                >
                  {opt.label}
                </Chip>
              ))}
            </ChipsContainer>
          </FormGroup>
          <BottomAction>
            <MainButton onClick={handleSubmit}>저장하기</MainButton>
          </BottomAction>
        </Section>
      </ContentScroll>

      {showMapModal && (
        <KakaoMapModal
          onClose={() => setShowMapModal(false)}
          onAddressSelect={handleAddressSelect}
        />
      )}

      <AlertModal
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        title={alertTitle}
        message={alertMessage}
        type="alert"
        variant={alertTitle === "성공" ? "success" : "danger"}
      />
    </PageWrapper>
  );
};

export default ProfileEditPage;

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
  padding-bottom: 40px;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  background: white;
  border-bottom: 1px solid #f1f3f5;
`;

const ImageWrapper = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const ProfileImg = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #f1f3f5;
`;

const EditIconWrapper = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--color-main);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
`;

const ProfileName = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
`;

const ProfileEmail = styled.p`
  font-size: 14px;
  color: #868e96;
`;

const Section = styled.div`
  padding: 24px 20px;
  background: white;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #212529;
  margin-bottom: 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 8px;
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #dee2e6;
  font-size: 15px;
  color: #333;
  outline: none;
  background-color: white;
  box-sizing: border-box; /* Fixed layout issue */

  &:focus {
    border-color: var(--color-main);
  }

  &::placeholder {
    color: #adb5bd;
  }

  &:read-only {
    background-color: #f8f9fa;
    cursor: default;
  }
`;

const ToggleGroup = styled.div`
  display: flex;
  background: #f1f3f5;
  padding: 4px;
  border-radius: 14px;
`;

const ToggleButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  background: ${(props) => (props.isActive ? "white" : "transparent")};
  color: ${(props) => (props.isActive ? "var(--color-main)" : "#868e96")};
  box-shadow: ${(props) =>
    props.isActive ? "0 2px 4px rgba(0,0,0,0.05)" : "none"};
  transition: all 0.2s;
`;

const ChipsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid
    ${(props) => (props.isActive ? "var(--color-main)" : "#dee2e6")};
  background: ${(props) =>
    props.isActive ? "rgba(45, 138, 94, 0.1)" : "white"};
  color: ${(props) => (props.isActive ? "var(--color-main)" : "#495057")};
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: var(--color-main);
  }
`;

const Divider = styled.div`
  height: 8px;
  background: #f8fafb;
  border-top: 1px solid #f1f3f5;
  border-bottom: 1px solid #f1f3f5;
`;

const BottomAction = styled.div`
  margin-top: 100px;
  padding-top: 8px;
`;

const LoadingScreen = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #868e96;
`;
