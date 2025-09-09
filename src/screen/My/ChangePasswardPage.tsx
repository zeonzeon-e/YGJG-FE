import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";
import apiClient from "../../api/apiClient";
import Header2 from "../../components/Header/Header2/Header2";
import Modal1 from "../../components/Modal/Modal1";

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  const [isSubmittable, setIsSubmittable] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 새 비밀번호 유효성 검사 함수
  const validatePassword = (password: string): boolean => {
    const regex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[a-zA-Z\d!@#$%^&*()_+]{8,15}$/;
    if (password && !regex.test(password)) {
      setPasswordError("영문, 숫자, 특수문자 8-15자 조합으로 입력해주세요");
      return false;
    }
    setPasswordError("");
    return true;
  };

  // 유효성 검사 로직
  useEffect(() => {
    const isPasswordValid = validatePassword(newPassword);
    const doPasswordsMatch =
      newPassword !== "" && newPassword === confirmPassword;

    if (confirmPassword && !doPasswordsMatch) {
      setConfirmError("비밀번호가 일치하지 않아요");
    } else {
      setConfirmError("");
    }

    if (currentPassword && isPasswordValid && doPasswordsMatch) {
      setIsSubmittable(true);
    } else {
      setIsSubmittable(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  // 비밀번호 변경 제출 핸들러
  const handleSubmit = async () => {
    if (!isSubmittable || isLoading) return;

    setIsLoading(true);
    try {
      await apiClient.put("/api/my/password", {
        // 실제 API 엔드포인트로 수정 필요
        currentPassword: currentPassword,
        newPassword: newPassword,
      });
      setIsModalOpen(true);
    } catch (error: any) {
      // API 에러 처리 (예: 현재 비밀번호 불일치)
      alert(error.response?.data?.message || "비밀번호 변경에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate("/my"); // 변경 완료 후 마이페이지로 이동
  };

  return (
    <>
      <div style={{ margin: "10px" }}>
        <Header2 text="비밀번호 변경" />
        <Container>
          <Subtitle>새로운 비밀번호를 입력해주세요.</Subtitle>

          <InputGroup>
            <Label>기존 비밀번호</Label>
            <Input
              type="password"
              placeholder="비밀번호"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </InputGroup>

          <InputGroup>
            <Label>새로운 비밀번호</Label>
            <Input
              type="password"
              placeholder="비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              hasError={!!passwordError}
            />
            {passwordError ? (
              <ErrorMessage>{passwordError}</ErrorMessage>
            ) : (
              <HintMessage>
                영문, 숫자, 특수문자 8-15자 조합으로 입력해주세요
              </HintMessage>
            )}
          </InputGroup>

          <InputGroup>
            <Label>새로운 비밀번호 확인</Label>
            <Input
              type="password"
              placeholder="새로운 비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              hasError={!!confirmError}
            />
            {confirmError && (
              <ErrorMessage>
                <FaTimesCircle /> {confirmError}
              </ErrorMessage>
            )}
          </InputGroup>

          <SubmitButton
            onClick={handleSubmit}
            disabled={!isSubmittable || isLoading}
          >
            {isLoading ? "변경 중..." : "비밀번호 변경하기"}
          </SubmitButton>
        </Container>

        <Modal1
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onConfirm={handleModalClose}
        >
          <ModalText>비밀번호 변경이 완료되었습니다.</ModalText>
        </Modal1>
      </div>
    </>
  );
};

export default ChangePasswordPage;

// --- Styled Components (시안에 맞게 재구성) ---
const Container = styled.div`
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 55px); /* 헤더 높이를 제외한 전체 높이 */
`;

const Subtitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 32px;
  color: #333;
`;

const InputGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${({ hasError }) => (hasError ? "#e74c3c" : "#ddd")};
  border-radius: 8px;
  font-size: 16px;
  box-sizing: border-box;

  &:focus {
    border-color: ${({ hasError }) =>
      hasError ? "#e74c3c" : "var(--color-main)"};
    outline: none;
  }
`;

const HintMessage = styled.p`
  font-size: 13px;
  color: #888;
  margin-top: 8px;
`;

const ErrorMessage = styled.p`
  font-size: 13px;
  color: #e74c3c;
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  // margin-top: 100px;
  background-color: var(--color-main);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:disabled {
    background-color: #e0e0e0;
    cursor: not-allowed;
  }
`;

const ModalText = styled.p`
  font-size: 18px;
  font-weight: bold;
`;
