import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  HiExclamationTriangle,
  HiTrash,
  HiCalendarDays,
  HiUserGroup,
  HiDocumentText,
  HiChevronRight,
} from "react-icons/hi2";
import Header2 from "../../components/Header/Header2/Header2";
import apiClient from "../../api/apiClient";
import { getAccessToken } from "../../utils/authUtils";

const UNSUBSCRIBE_REASONS = [
  "다른 서비스를 사용하게 되었어요",
  "사용 빈도가 낮아졌어요",
  "기능이 부족해요",
  "팀 활동을 더 이상 안 해요",
  "개인 정보가 걱정돼요",
  "기타 (직접 입력)",
];

const UnsubscribePage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Info, 2: Reason, 3: Confirm
  const [selectedReason, setSelectedReason] = useState("");
  const [customReason, setCustomReason] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const finalReason =
    selectedReason === "기타 (직접 입력)" ? customReason : selectedReason;

  const handleUnsubscribe = async () => {
    if (!finalReason) {
      alert("탈퇴 사유를 선택해주세요.");
      return;
    }

    if (!password) {
      alert("비밀번호를 입력해주세요.");
      return;
    }

    if (
      !window.confirm(
        "정말 탈퇴하시겠습니까? 모든 데이터가 영구 삭제되며 복구할 수 없습니다.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    const token = getAccessToken();

    try {
      if (token?.startsWith("dev-")) {
        await new Promise((r) => setTimeout(r, 1000));
        alert("서비스 탈퇴가 완료되었습니다. (Dev Mode)");
        navigate("/login");
        return;
      }

      // 실제 API 호출 (API 명세에 따라 수정 필요)
      await apiClient.post(
        "/api/sign/delete-user",
        {
          password: password,
          passwordCheck: password,
        },
        {
          headers: { "X-AUTH-TOKEN": token },
        },
      );

      alert("서비스 탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.");
      navigate("/login");
    } catch (error: any) {
      console.error("Unsubscribe failed", error);
      alert(
        error.response?.data?.message || "탈퇴 처리 중 오류가 발생했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Header2 text="서비스 탈퇴" />

      <Container>
        {/* Step 1: Information */}
        {step === 1 && (
          <StepContent>
            <WarningCard>
              <WarningIcon>
                <HiExclamationTriangle />
              </WarningIcon>
              <WarningTitle>정말 떠나시나요? 😢</WarningTitle>
              <WarningDesc>
                탈퇴하시면 아래 정보가 모두 삭제되며
                <br />
                <strong>복구가 불가능</strong>합니다.
              </WarningDesc>
            </WarningCard>

            <LossList>
              <LossItem>
                <LossIcon>
                  <HiUserGroup />
                </LossIcon>
                <LossText>
                  <LossTitle>팀 정보</LossTitle>
                  <LossDesc>가입한 모든 팀에서 자동 탈퇴됩니다.</LossDesc>
                </LossText>
              </LossItem>
              <LossItem>
                <LossIcon>
                  <HiCalendarDays />
                </LossIcon>
                <LossText>
                  <LossTitle>일정 기록</LossTitle>
                  <LossDesc>
                    경기, 훈련 등 모든 일정 기록이 삭제됩니다.
                  </LossDesc>
                </LossText>
              </LossItem>
              <LossItem>
                <LossIcon>
                  <HiDocumentText />
                </LossIcon>
                <LossText>
                  <LossTitle>게시물 & 댓글</LossTitle>
                  <LossDesc>작성한 공지사항, 댓글이 모두 삭제됩니다.</LossDesc>
                </LossText>
              </LossItem>
            </LossList>

            <ActionButton onClick={() => setStep(2)}>
              그래도 탈퇴할래요 <HiChevronRight />
            </ActionButton>
            <CancelButton onClick={() => navigate(-1)}>
              아직 더 사용해볼게요
            </CancelButton>
          </StepContent>
        )}

        {/* Step 2: Reason Selection */}
        {step === 2 && (
          <StepContent>
            <StepTitle>탈퇴 이유를 알려주세요</StepTitle>
            <StepDesc>더 나은 서비스를 위해 소중한 의견을 남겨주세요.</StepDesc>

            <ReasonList>
              {UNSUBSCRIBE_REASONS.map((reason) => (
                <ReasonOption
                  key={reason}
                  selected={selectedReason === reason}
                  onClick={() => setSelectedReason(reason)}
                >
                  <RadioCircle selected={selectedReason === reason} />
                  {reason}
                </ReasonOption>
              ))}
            </ReasonList>

            {selectedReason === "기타 (직접 입력)" && (
              <CustomInput
                placeholder="탈퇴 사유를 직접 입력해주세요 (최대 200자)"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                maxLength={200}
              />
            )}

            <ButtonRow>
              <BackButton onClick={() => setStep(1)}>이전</BackButton>
              <ActionButton onClick={() => setStep(3)} disabled={!finalReason}>
                다음
              </ActionButton>
            </ButtonRow>
          </StepContent>
        )}

        {/* Step 3: Final Confirmation */}
        {step === 3 && (
          <StepContent>
            <FinalWarningCard>
              <HiTrash size={40} color="#fa5252" />
              <FinalTitle>마지막 확인입니다</FinalTitle>
              <FinalDesc>
                아래 버튼을 누르면 계정이 즉시 삭제됩니다.
                <br />
                모든 데이터는 영구적으로 복구할 수 없습니다.
              </FinalDesc>
              <ReasonPreview>
                <div className="label">탈퇴 사유</div>
                <div className="content">{finalReason}</div>
              </ReasonPreview>
              <PasswordInputWrapper>
                <PasswordInput
                  type="password"
                  placeholder="비밀번호를 입력해주세요"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </PasswordInputWrapper>
            </FinalWarningCard>

            <ButtonRow>
              <BackButton onClick={() => setStep(2)}>이전</BackButton>
              <DangerButton onClick={handleUnsubscribe} disabled={isLoading}>
                {isLoading ? "처리 중..." : "탈퇴하기"}
              </DangerButton>
            </ButtonRow>
          </StepContent>
        )}
      </Container>
    </PageWrapper>
  );
};

export default UnsubscribePage;

/* --- Styled Components --- */

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #f8fafb;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
`;

const Container = styled.div`
  padding: 24px;
  flex: 1;
  padding-bottom: 100px;
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const WarningCard = styled.div`
  background: linear-gradient(135deg, #fff5f5 0%, #fff 100%);
  border: 1px solid #ffc9c9;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
`;

const WarningIcon = styled.div`
  font-size: 48px;
  color: #fa5252;
  margin-bottom: 12px;
`;

const WarningTitle = styled.h2`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  color: #333;
  margin-bottom: 8px;
`;

const WarningDesc = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;

const LossList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
`;

const LossItem = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 0;
  border-bottom: 1px solid #f1f3f5;

  &:last-child {
    border-bottom: none;
  }
`;

const LossIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #fff5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fa5252;
`;

const LossText = styled.div`
  flex: 1;
`;

const LossTitle = styled.div`
  font-size: 15px;
  font-family: "Pretendard-Bold";
  color: #333;
`;

const LossDesc = styled.div`
  font-size: 13px;
  color: #888;
`;

const ActionButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  height: 52px;
  border-radius: 14px;
  background: ${(props) => (props.disabled ? "#e9ecef" : "#212529")};
  color: ${(props) => (props.disabled ? "#adb5bd" : "white")};
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;
  flex: 2;

  &:not(:disabled):hover {
    background: #343a40;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  height: 48px;
  border-radius: 14px;
  background: white;
  color: #00b894;
  font-size: 15px;
  font-weight: 600;
  border: 2px solid #00b894;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f0fff4;
  }
`;

const StepTitle = styled.h2`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  color: #333;
`;

const StepDesc = styled.p`
  font-size: 14px;
  color: #888;
  margin-top: -12px;
`;

const ReasonList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ReasonOption = styled.div<{ selected: boolean }>`
  background: ${(props) => (props.selected ? "#f0f9ff" : "white")};
  border: 1px solid ${(props) => (props.selected ? "#339af0" : "#e9ecef")};
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  font-size: 15px;
  color: #333;
  transition: all 0.2s;
`;

const RadioCircle = styled.div<{ selected: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid ${(props) => (props.selected ? "#339af0" : "#dee2e6")};
  background: ${(props) => (props.selected ? "#339af0" : "white")};
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
    display: ${(props) => (props.selected ? "block" : "none")};
  }
`;

const CustomInput = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 16px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  font-size: 14px;
  resize: none;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #339af0;
  }

  &::placeholder {
    color: #adb5bd;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const BackButton = styled.button`
  flex: 1;
  height: 52px;
  border-radius: 14px;
  background: #f1f3f5;
  color: #495057;
  font-size: 16px;
  font-weight: 600;
  border: none;
  cursor: pointer;
`;

const FinalWarningCard = styled.div`
  background: #fff5f5;
  border: 2px solid #ffa8a8;
  border-radius: 16px;
  padding: 40px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
`;

const FinalTitle = styled.h2`
  font-size: 22px;
  font-family: "Pretendard-Bold";
  color: #c92a2a;
`;

const FinalDesc = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
`;

const ReasonPreview = styled.div`
  background: white;
  padding: 14px 16px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  font-size: 14px;
  color: #333;
  width: 100%;
  text-align: left;
  margin-top: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 4px;

  .label {
    font-size: 12px;
    color: #888;
    font-weight: 600;
  }

  .content {
    line-height: 1.4;
    color: #444;
  }
`;

const DangerButton = styled.button`
  flex: 2;
  height: 52px;
  border-radius: 14px;
  background: #fa5252;
  color: white;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    background: #ffa8a8;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background: #e03131;
  }
`;

const PasswordInputWrapper = styled.div`
  width: 100%;
  margin-top: 8px;
`;

const PasswordInput = styled.input`
  width: 100%;
  height: 48px;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #fa5252;
  }
`;
