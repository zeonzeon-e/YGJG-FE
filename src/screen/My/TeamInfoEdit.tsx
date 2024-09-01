import React, { useState } from "react";
import styled from "styled-components";
import GlobalStyles from "../../component/Styled/GlobalStyled";
import Header1 from "../../component/Header/Header1/Header1";
import MiniButton from "../../component/Button/MiniButton";
import { useLocation, useNavigate } from "react-router-dom";
import { CompactPicker } from "react-color";

const TeamInfoEdit: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { teamIndex, color, position } = location.state || {
    teamIndex: 0,
    color: "#00FF00",
    position: "ST",
  };

  const [selectedColor, setSelectedColor] = useState<string>(color);
  const [newPosition, setNewPosition] = useState<string>(position);

  const handleColorChange = (newColor: any) => {
    setSelectedColor(newColor.hex);
  };

  const handlePositionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setNewPosition(event.target.value);
  };

  const handleSubmit = () => {
    navigate("/", {
      state: {
        updatedTeam: { teamIndex, color: selectedColor, position: newPosition },
      },
    });
  };

  return (
    <>
      <GlobalStyles />
      <Container>
        <Header1 text="팀 정보 수정" />
        <Profile>
          <ProfileImage
            src="https://example.com/team-image.jpg"
            alt="팀 프로필 이미지"
          />
          <ProfileName>코리아 팀</ProfileName>
        </Profile>

        <Section>
          <SectionTitle>팀 내 희망 포지션 변경하기</SectionTitle>
          <SectionDescription>
            변경할 희망 포지션을 알려주세요. 팀에서 포지션을 잘 배정할 수
            있어요.
          </SectionDescription>
          <PositionWrapper>
            <CurrentPosition>{position}</CurrentPosition>
            <PositionSelect value={newPosition} onChange={handlePositionChange}>
              <option value="ST">ST</option>
              <option value="GK">GK</option>
              <option value="DF">DF</option>
              <option value="MF">MF</option>
            </PositionSelect>
          </PositionWrapper>
        </Section>

        <Section>
          <SectionTitle>팀 색상 변경하기</SectionTitle>
          <SectionDescription>
            변경할 팀 색상을 팔레트에 적용하세요. 변경된 팀 색상이 적용됩니다.
          </SectionDescription>
          <ColorPickerWrapper>
            <ColorCircle color={selectedColor} />
            <ColorPickerContainer>
              <CompactPicker
                color={selectedColor}
                onChange={handleColorChange}
              />
            </ColorPickerContainer>
          </ColorPickerWrapper>
        </Section>

        <SubmitButton onClick={handleSubmit}>변경하기</SubmitButton>
      </Container>
    </>
  );
};

export default TeamInfoEdit;

// 스타일 컴포넌트 정의

const Container = styled.div`
  padding: 20px;
`;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const ProfileImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const ProfileName = styled.div`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  margin-bottom: 20px;
`;

const Section = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  margin-bottom: 10px;
`;

const SectionDescription = styled.p`
  font-size: 14px;
  font-family: "Pretendard-Regular";
  margin-bottom: 20px;
`;

const PositionWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CurrentPosition = styled.div`
  width: 50%;
  padding: 10px;
  font-family: "Pretendard-Regular";
  font-size: 14px;
  border: 1px solid var(--color-dark1);
  border-radius: 8px;
  background-color: var(--color-light2);
  text-align: center;
  margin-top: 5px;
`;

const PositionSelect = styled.select`
  width: 50%;
  padding: 10px;
  font-family: "Pretendard-Regular";
  font-size: 14px;
  border: 1px solid var(--color-dark1);
  border-radius: 8px;
  margin-top: 5px;
  margin-left: 10px;
`;

const ColorPickerWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ColorCircle = styled.div<{ color: string }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ color }) => color};
  margin-right: 10px;
`;

const ColorPickerContainer = styled.div`
  margin-left: 10px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: var(--color-main);
  color: var(--color-light1);
  font-family: "Pretendard-Bold";
  font-size: 18px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: var(--color-sub);
  }
`;

const PositionDiv = styled.div`
  width: 100%;
  margin-left: 30px;
`;
