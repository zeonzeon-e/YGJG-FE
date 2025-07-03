import React, { useState, useEffect, useRef } from "react";
import GlobalStyles from "../../components/Styled/GlobalStyled";
import styled from "styled-components";
import apiClient from "../../api/apiClient";
import MainButton from "../../components/Button/MainButton";
import Input from "../../components/Input/Input";
import RadioButton from "../../components/Button/RadioButton";
import KakaoMapModal from "../../components/Modal/KakaoAddress";
import Header2 from "../../components/Header/Header2/Header2";
const ProfileEditPage: React.FC = () => {
  const [profileData, setProfileData] = useState({
    birthDate: "",
    email: "",
    gender: "",
    password: "",
    passwordCheck: "",
    phoneNum: "",
  });

  const [profile, setProfile] = useState<{
    name: string;
    email: string;
    imageUrl: string;
  } | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleSubmit = async () => {
    try {
      // JSON 데이터 변환
      const jsonData = JSON.stringify(profileData);

      const response = await apiClient.put("/api/member/updateUser", jsonData, {
        headers: {
          "Content-Type": "application/json", // JSON 전송을 위해 Content-Type 변경
        },
      });

      console.log("Profile updated successfully:", response.data);
      alert("프로필이 성공적으로 수정되었습니다.");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("프로필 수정 중 오류가 발생했습니다.");
    }
  };
  const [phoneNum, setPhoneNum] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const handleAddressSelect = (address: string) => {
    setSelectedAddress(address);
    setShowMapModal(false);
  };
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
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await apiClient.get("/api/member/getUser");
        setProfile({
          name: response.data.name,
          email: response.data.email,
          imageUrl: response.data.profileUrl,
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
      <GlobalStyles />
      <Header2 text="프로필 설정하기" />
      <Container>
        <Profile>
          <ProfileImage
            src={
              profile?.imageUrl ||
              profileImage ||
              "https://example.com/profile-image.jpg"
            }
            alt="프로필 이미지"
            className="shadow-df"
          />
          <ProfileButton
            className="shadow-df"
            onClick={() => fileInputRef.current?.click()}
          >
            프로필 사진 변경하기
          </ProfileButton>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*"
            onChange={handleImageUpload}
          />
          <ProfileName>{profile?.name || "이름 없음"}</ProfileName>
          <ProfileEmail>{profile?.email || "이메일 없음"}</ProfileEmail>
        </Profile>
        <SubContainer>
          <SubTitle>전화번호</SubTitle>
          <FlexBox>
            <Input
              height={55}
              type="text"
              placeholder="010-0000-0000"
              value={phoneNum}
              onChange={(e) => setPhoneNum(e.target.value)}
            />
            <MainButton width={100}>인증</MainButton>
          </FlexBox>
          <SubTitle>생년월일 8자리</SubTitle>
          <Input
            height={55}
            type="text"
            placeholder="00000000"
            // value={fee}
            // onChange={(e) => setFee(e.target.value)}
          />
          <SubTitle>성별</SubTitle>
          <RadioButton
            fontSize={14}
            items={["남성", "여성"]}
            // selectedItem={gender}
            // onChange={(value) => setGender(value)}
          />
          <SubTitle>주소</SubTitle>
          <FlexBox>
            <Input
              height={55}
              type="text"
              placeholder="주소를 찾아주세요"
              // value={region}
              // onChange={(e) => setRegion(e.target.value)}
            />
            <MainButton width={200} onClick={() => setShowMapModal(true)}>
              주소 찾기
            </MainButton>
          </FlexBox>
          {showMapModal && (
            <KakaoMapModal
              onClose={() => setShowMapModal(false)}
              onAddressSelect={handleAddressSelect}
            />
          )}
          <SelectedAddress>{selectedAddress}</SelectedAddress>
          <SubTitle>선수 경험</SubTitle>
          <RadioButton
            fontSize={14}
            items={["있다", "없다"]}
            // selectedItem={gender}
            // onChange={(value) => setGender(value)}
          />

          <SubTitle>마지막 선수 경력</SubTitle>
          <RadioButton
            fontSize={14}
            items={["중학교 선출", "고등학교 선출", "대학교 선출"]}
            // selectedItem={gender}
            // onChange={(value) => setGender(value)}
          />
          <SubTitle>실력</SubTitle>
          <RadioButton
            fontSize={14}
            items={["상", "중", "하"]}
            // selectedItem={teamLevel}
            // onChange={(value) => setTeamLevel(value)}
          />
        </SubContainer>
      </Container>
      <MainButton onClick={handleSubmit}>변경하기</MainButton>
    </>
  );
};

export default ProfileEditPage;

const Container = styled.div`
  padding: 20px;
  margin: auto;
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  height: 116px;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: cover;
  border: 1px solid #ddd;
  margin-bottom: 10px;
`;

const ProfileButton = styled.button`
  background-color: var(--color-dark1);
  border: 1px solid var(--color-dark1);
  margin-bottom: 20px;
  border-radius: 20px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  font-family: "Pretendard-Regular";
  color: var(--color-light1);
  transition: background-color 0.3s ease;

  &:hover {
    background-color: var(--color-dark1);
  }
`;

const ProfileName = styled.div`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  margin-bottom: 5px;
`;

const ProfileEmail = styled.div`
  font-size: 14px;
  font-family: "Pretendard-Regular";
  color: var(--color-dark1);
  margin-bottom: 10px;
`;

const Divider = styled.div`
  border-bottom: 1px solid var(--color-light2);
  margin: 20px 0;
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
const FlexBox = styled.div`
  display: flex;
  width: 100%;
  gap: 10px;
`;
const SubContainer = styled.div`
  width: 100%;
`;
