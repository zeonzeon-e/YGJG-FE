import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import Header2 from "../../components/Header/Header2/Header2";
import { useNavigate, useParams } from "react-router-dom";
import apiClient from "../../api/apiClient";
import { useToastStore } from "../../stores/toastStore";
import { useUserStore } from "../../stores/userStore";
import { HiExclamationTriangle, HiArrowLeft } from "react-icons/hi2";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const TeamOutPage: React.FC = () => {
  const [reason, setReason] = useState<string>("");
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addToast } = useToastStore();
  const fetchUserData = useUserStore((state) => state.fetchUserData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  };

  const handleSubmit = async () => {
    if (!reason.trim()) {
      addToast("탈퇴 사유를 작성해주세요.", "warning");
      return;
    }

    if (reason.length > 500) {
      addToast("탈퇴 사유는 최대 500자까지 입력 가능합니다.", "warning");
      return;
    }

    if (!id) {
      addToast("잘못된 접근입니다.", "error");
      navigate("/my");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await apiClient.delete(`/api/myPage/leave/${id}`, {
        data: { reason },
      });

      if (response.status === 200) {
        await fetchUserData();
        addToast("팀을 성공적으로 탈퇴했습니다.", "success");
        navigate("/my");
      }
    } catch (error) {
      console.error("팀 탈퇴 중 오류 발생:", error);
      addToast("탈퇴 요청 중 오류가 발생했습니다.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <Header2 text="팀 탈퇴" line={true} />

      <ContentWrapper>
        <Card>
          <WarningSection>
            <IconWrapper>
              <HiExclamationTriangle />
            </IconWrapper>
            <WarningTitle>정말로 팀을 떠나시겠습니까?</WarningTitle>
            <WarningDescription>
              팀을 탈퇴하면 더 이상 팀 일정, 전술 및 멤버 정보에 접근할 수
              없습니다. 작성하신 활동 내역은 삭제되지 않을 수 있습니다.
            </WarningDescription>
          </WarningSection>

          <InputSection>
            <LabelWrapper>
              <Label>탈퇴 사유</Label>
              <CharCount isExceeded={reason.length > 500}>
                {reason.length}/500
              </CharCount>
            </LabelWrapper>
            <StyledTextarea
              value={reason}
              onChange={handleReasonChange}
              maxLength={500}
              placeholder="더 나은 서비스를 위해 탈퇴 사유를 알려주세요. (최대 500자)"
            />
          </InputSection>

          <ButtonSection>
            <CancelButton onClick={() => navigate(-1)}>
              <HiArrowLeft size={16} />
              취소 후 돌아가기
            </CancelButton>
            <SubmitButton
              onClick={handleSubmit}
              disabled={isSubmitting || !reason.trim()}
            >
              {isSubmitting ? "처리 중..." : "팀 탈퇴 확정"}
            </SubmitButton>
          </ButtonSection>
        </Card>
      </ContentWrapper>
    </PageContainer>
  );
};

export default TeamOutPage;

/* ========== Styled Components ========== */

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
`;

const ContentWrapper = styled.div`
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 16px;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Card = styled.div`
  background: white;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
  box-sizing: border-box;
`;

const WarningSection = styled.div`
  text-align: center;
  margin-bottom: 32px;
`;

const IconWrapper = styled.div`
  width: 64px;
  height: 64px;
  background-color: #fff1f2;
  color: #e11d48;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto 20px;
`;

const WarningTitle = styled.h2`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  color: #0f172a;
  margin-bottom: 12px;
`;

const WarningDescription = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #64748b;
  word-break: keep-all;
`;

const InputSection = styled.div`
  margin-bottom: 32px;
`;

const LabelWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-family: "Pretendard-SemiBold";
  color: #334155;
`;

const CharCount = styled.span<{ isExceeded: boolean }>`
  font-size: 12px;
  color: ${(props) => (props.isExceeded ? "#e11d48" : "#94a3b8")};
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  box-sizing: border-box;
  height: 160px;
  padding: 16px;
  background-color: #f1f5f9;
  border: 1.5px solid transparent;
  border-radius: 12px;
  font-size: 14px;
  font-family: "Pretendard-Regular";
  color: #1e293b;
  resize: none;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    background-color: white;
    border-color: #0e6244;
    box-shadow: 0 0 0 4px rgba(14, 98, 68, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
`;

const ButtonSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SubmitButton = styled.button`
  width: 100%;
  box-sizing: border-box;
  padding: 16px;
  background-color: #e11d48;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-family: "Pretendard-Bold";
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background-color: #be123c;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(225, 29, 72, 0.2);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  box-sizing: border-box;
  padding: 14px;
  background-color: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  font-family: "Pretendard-SemiBold";
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8fafc;
    color: #0f172a;
    border-color: #cbd5e1;
  }
`;
