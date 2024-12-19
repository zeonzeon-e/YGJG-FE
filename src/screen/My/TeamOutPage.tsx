import React, { useState } from "react";
import styled from "styled-components";
import Header2 from "../../components/Header/Header2/Header2";
import MainButton from "../../components/Button/MainButton";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";

const TeamOutPage: React.FC = () => {
  const [reason, setReason] = useState<string>("");
  const navigate = useNavigate();

  const handleReasonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReason(e.target.value);
  };

  const handleSubmit = async () => {
    if (!reason) {
      alert("탈퇴 사유를 작성해주세요.");
      return;
    }

    if (reason.length > 500) {
      alert("탈퇴 사유는 최대 500자까지 입력 가능합니다.");
      return;
    }

    try {
      // 서버로 탈퇴 요청 전송
      const response = await apiClient.post("/api/team/leave", { reason });

      if (response.status === 200) {
        alert("팀 탈퇴가 성공적으로 처리되었습니다.");
        navigate("/my-page"); // 탈퇴 후 이동할 페이지
      }
    } catch (error) {
      console.error("팀 탈퇴 중 오류 발생:", error);
      alert("팀 탈퇴 요청이 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <>
      <Header2 text="팀 탈퇴하기" line={true} />
      <Container>
        <Label>팀을 탈퇴하는 이유를 작성해주세요 (최대 500자)</Label>
        <Textarea
          value={reason}
          onChange={handleReasonChange}
          maxLength={500}
          placeholder="탈퇴 사유를 입력해주세요."
        />
        <MainButton onClick={handleSubmit}>제출하기</MainButton>
      </Container>
    </>
  );
};

export default TeamOutPage;

// Styled Components
const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
  text-align: center;
`;

const Textarea = styled.textarea`
  width: 100%;
  max-width: 400px;
  height: 150px;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: none;

  ::placeholder {
    color: #aaa;
  }
`;

