import React, { useState, useEffect } from "react";
import GlobalStyles from "../../components/Styled/GlobalStyled";
import Header1 from "../../components/Header/Header1/Header1";
import styled from "styled-components";
import apiClient from "../../api/apiClient";
import MainButton from "../../components/Button/MainButton";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setProfileData((prev) => ({ ...prev, [id]: value }));
  };

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
      <Header1 text="프로필 설정하기" />
      <Container>
        <Profile>
          <ProfileImage
            src={profile?.imageUrl || "https://example.com/profile-image.jpg"}
            alt="프로필 이미지"
            className="shadow-df"
          />
          <ProfileName>{profile?.name || "이름 없음"}</ProfileName>
          <ProfileEmail>{profile?.email || "이메일 없음"}</ProfileEmail>
          <input
            id="birthDate"
            placeholder="생년월일"
            value={profileData.birthDate}
            onChange={handleInputChange}
          />
          <input
            id="email"
            placeholder="이메일"
            value={profileData.email}
            onChange={handleInputChange}
          />
          <input
            id="gender"
            placeholder="성별"
            value={profileData.gender}
            onChange={handleInputChange}
          />
          <input
            id="password"
            type="password"
            placeholder="비밀번호"
            value={profileData.password}
            onChange={handleInputChange}
          />
          <input
            id="passwordCheck"
            type="password"
            placeholder="비밀번호 확인"
            value={profileData.passwordCheck}
            onChange={handleInputChange}
          />
          <input
            id="phoneNum"
            placeholder="전화번호"
            value={profileData.phoneNum}
            onChange={handleInputChange}
          />
        </Profile>
        <Divider />
      </Container>
      <MainButton onClick={handleSubmit}>수정하기</MainButton>
    </>
  );
};

export default ProfileEditPage;

const Container = styled.div`
  padding: 20px;
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

const ProfileImage = styled.img`
  width: 20vw;
  height: 20vw;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const ProfileName = styled.div`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  margin-bottom: 5px;
`;

const ProfileEmail = styled.div`
  font-size: 14px;
  font-family: "Pretendard-Regular";
  color: #777;
  margin-bottom: 10px;
`;

const Divider = styled.div`
  border-bottom: 1px solid var(--color-light2);
  margin: 20px 0;
`;
