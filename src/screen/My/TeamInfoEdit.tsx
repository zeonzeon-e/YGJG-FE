import React, { useState } from "react";
import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CompactPicker } from "react-color";
import {
  HiCheck,
  HiExclamationTriangle,
  HiArrowRightOnRectangle,
} from "react-icons/hi2";

import GlobalStyles from "../../components/Styled/GlobalStyled";
import Header2 from "../../components/Header/Header2/Header2";
import apiClient from "../../api/apiClient";
import { getAccessToken } from "../../utils/authUtils";

const TeamInfoEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>(); // route param is :id
  const location = useLocation();

  // State from location or defaults
  const { teamId, teamColor, position } = location.state || {
    teamId: Number(id) || 1,
    teamColor: "#00FF00",
    position: "ST",
  };

  const [selectedColor, setSelectedColor] = useState<string>(
    teamColor || "#00FF00"
  );
  const [newPosition, setNewPosition] = useState<string>(position || "ST");
  const [loading, setLoading] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  // --- Handlers ---
  const handleColorChange = (color: any) => {
    setSelectedColor(color.hex);
    setShowColorPicker(false); // Close after selection
  };

  const handleSubmit = async () => {
    setLoading(true);
    const token = getAccessToken();

    // Dev Mock
    if (token?.startsWith("dev-")) {
      await new Promise((r) => setTimeout(r, 800));
      alert("[개발 모드] 설정이 변경되었습니다.");
      navigate("/my");
      return;
    }

    try {
      await apiClient.put(`api/myPage/teamMember/${teamId}`, {
        position: newPosition,
        teamColor: selectedColor,
      });
      alert("팀 설정이 변경되었습니다.");
      navigate("/my");
    } catch (err) {
      console.error("Error updating team info:", err);
      alert("설정 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleOutClick = () => {
    if (
      window.confirm(
        "정말 팀을 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      navigate(`/out/${teamId}`);
    }
  };

  return (
    <PageWrapper>
      <GlobalStyles />
      <Header2 text="팀 활동 설정" />

      <ContentContainer>
        <SectionTitle>내 포지션</SectionTitle>
        <Card>
          <CardDescription>
            팀 내에서 주로 활동하는 포지션을 선택해주세요.
          </CardDescription>
          <PositionGrid>
            {["ST", "MF", "DF", "GK"].map((pos) => (
              <PositionButton
                key={pos}
                isActive={newPosition === pos}
                onClick={() => setNewPosition(pos)}
              >
                {pos}
                {newPosition === pos && (
                  <CheckIcon>
                    <HiCheck />
                  </CheckIcon>
                )}
              </PositionButton>
            ))}
          </PositionGrid>
        </Card>

        <SectionTitle>내 팀 컬러</SectionTitle>
        <Card>
          <CardDescription>
            나만의 고유 색상을 설정하여 팀 내에서 구별되게 하세요.
          </CardDescription>
          <ColorPreviewRow>
            <ColorCircle
              color={selectedColor}
              onClick={() => setShowColorPicker(!showColorPicker)}
            />
            <ColorInfo>
              <ColorName>{selectedColor}</ColorName>
              <ColorAction onClick={() => setShowColorPicker(!showColorPicker)}>
                {showColorPicker ? "닫기" : "색상 변경"}
              </ColorAction>
            </ColorInfo>
          </ColorPreviewRow>

          {showColorPicker && (
            <PickerWrapper>
              <CompactPicker
                color={selectedColor}
                onChange={handleColorChange}
              />
            </PickerWrapper>
          )}
        </Card>

        <DangerZone>
          <DangerTitle>
            <HiExclamationTriangle /> Danger Zone
          </DangerTitle>
          <DangerCard>
            <div>
              <DangerText>팀 탈퇴하기</DangerText>
              <DangerDesc>
                팀을 탈퇴하면 모든 활동 기록이 영구적으로 삭제될 수 있습니다.
              </DangerDesc>
            </div>
            <LeaveButton onClick={handleOutClick}>
              <HiArrowRightOnRectangle /> 탈퇴
            </LeaveButton>
          </DangerCard>
        </DangerZone>
      </ContentContainer>

      <BottomBar>
        <SubmitButton onClick={handleSubmit} disabled={loading}>
          {loading ? "저장 중..." : "설정 저장하기"}
        </SubmitButton>
      </BottomBar>
    </PageWrapper>
  );
};

export default TeamInfoEdit;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafb;
  display: flex;
  flex-direction: column;
  padding-bottom: 80px;
  max-width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
`;

const ContentContainer = styled.div`
  padding: 24px 20px;
  flex: 1;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-family: "Pretendard-Bold";
  color: #333;
  margin-bottom: 12px;
  margin-top: 24px;
  &:first-child {
    margin-top: 0;
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  border: 1px solid #eee;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: #888;
  margin-bottom: 16px;
  line-height: 1.4;
`;

const PositionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const PositionButton = styled.button<{ isActive: boolean }>`
  height: 50px;
  border-radius: 12px;
  border: 1px solid
    ${(props) => (props.isActive ? "var(--color-main)" : "#eee")};
  background: ${(props) => (props.isActive ? "#f0fdf4" : "#fff")};
  color: ${(props) => (props.isActive ? "var(--color-main)" : "#555")};
  font-family: "Pretendard-Bold";
  font-size: 15px;
  cursor: pointer;
  position: relative;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.isActive ? "#f0fdf4" : "#f9f9f9")};
  }
`;

const CheckIcon = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  font-size: 12px;
`;

const ColorPreviewRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const ColorCircle = styled.div<{ color: string }>`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: 2px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

const ColorInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ColorName = styled.span`
  font-family: "Pretendard-Bold";
  font-size: 16px;
  color: #333;
`;

const ColorAction = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: var(--color-main);
  font-size: 13px;
  cursor: pointer;
  text-align: left;
  &:hover {
    text-decoration: underline;
  }
`;

const PickerWrapper = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;

const DangerZone = styled.div`
  margin-top: 40px;
`;

const DangerTitle = styled.h3`
  font-size: 15px;
  font-family: "Pretendard-Bold";
  color: var(--color-error); /* Assuming global error color or red */
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DangerCard = styled.div`
  background: #fff5f5;
  border: 1px solid #fed7d7;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DangerText = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #c53030;
  margin-bottom: 4px;
`;

const DangerDesc = styled.div`
  font-size: 12px;
  color: #c53030;
  opacity: 0.8;
  max-width: 200px;
`;

const LeaveButton = styled.button`
  background: white;
  border: 1px solid #c53030;
  color: #c53030;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;

  &:hover {
    background: #c53030;
    color: white;
  }
`;

const BottomBar = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 12px 20px;
  padding-bottom: 24px; // Safe area
  border-top: 1px solid #f5f5f5;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
  z-index: 100;
`;

const SubmitButton = styled.button`
  width: 100%;
  background: var(--color-main);
  color: white;
  padding: 14px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;
