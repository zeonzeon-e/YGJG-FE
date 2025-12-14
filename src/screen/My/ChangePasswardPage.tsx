import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiLockClosed,
} from "react-icons/hi2";
import apiClient from "../../api/apiClient";
import Header2 from "../../components/Header/Header2/Header2";
import { getAccessToken } from "../../utils/authUtils";

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Validation States
  const [isValidLength, setIsValidLength] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecial, setHasSpecial] = useState(false);
  const [isMatch, setIsMatch] = useState(false);

  // Real-time validation
  useEffect(() => {
    setIsValidLength(newPassword.length >= 8 && newPassword.length <= 15);
    setHasNumber(/\d/.test(newPassword));
    setHasSpecial(/[!@#$%^&*()_+]/.test(newPassword));
  }, [newPassword]);

  useEffect(() => {
    setIsMatch(newPassword !== "" && newPassword === confirmPassword);
  }, [newPassword, confirmPassword]);

  const isFormValid =
    currentPassword.length > 0 &&
    isValidLength &&
    hasNumber &&
    hasSpecial &&
    isMatch;

  const handleSubmit = async () => {
    if (!isFormValid || isLoading) return;

    if (!window.confirm("비밀번호를 변경하시겠습니까?")) return;

    setIsLoading(true);
    try {
      // Mock for Dev Mode
      const token = getAccessToken();
      if (token?.startsWith("dev-")) {
        await new Promise((r) => setTimeout(r, 1000));
        alert("비밀번호가 성공적으로 변경되었습니다. (Dev Mode)");
        navigate("/my");
        return;
      }

      await apiClient.put("/api/my/password", {
        currentPassword,
        newPassword,
      });

      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/my");
    } catch (error: any) {
      console.error("Password change failed", error);
      const msg =
        error.response?.data?.message ||
        "비밀번호 변경에 실패했습니다. 기존 비밀번호를 확인해주세요.";
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Header2 text="비밀번호 변경" />

      <Container>
        <Description>
          안전을 위해 주기적으로 비밀번호를 변경해주세요.
          <br />
          영문, 숫자, 특수문자를 포함해 8~15자로 설정해야 합니다.
        </Description>

        <FormSection>
          <InputGroup>
            <Label>현재 비밀번호</Label>
            <InputWrapper>
              <InputIcon>
                <HiLockClosed />
              </InputIcon>
              <Input
                type="password"
                placeholder="현재 사용하는 비밀번호"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </InputWrapper>
          </InputGroup>

          <Divider />

          <InputGroup>
            <Label>새 비밀번호</Label>
            <InputWrapper>
              <InputIcon>
                <HiLockClosed />
              </InputIcon>
              <Input
                type="password"
                placeholder="새로운 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </InputWrapper>

            {/* Validation Criteria */}
            <ValidationRules>
              <RuleItem valid={isValidLength}>
                {isValidLength ? <HiCheckCircle /> : <HiExclamationCircle />}{" "}
                8~15자
              </RuleItem>
              <RuleItem valid={hasNumber}>
                {hasNumber ? <HiCheckCircle /> : <HiExclamationCircle />} 숫자
                포함
              </RuleItem>
              <RuleItem valid={hasSpecial}>
                {hasSpecial ? <HiCheckCircle /> : <HiExclamationCircle />}{" "}
                특수문자 포함 (@$!%*?& 등)
              </RuleItem>
            </ValidationRules>
          </InputGroup>

          <InputGroup>
            <Label>새 비밀번호 확인</Label>
            <InputWrapper className={isMatch && newPassword ? "valid" : ""}>
              <InputIcon>
                <HiLockClosed />
              </InputIcon>
              <Input
                type="password"
                placeholder="새로운 비밀번호를 한 번 더 입력"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {isMatch && newPassword && (
                <ValidIcon>
                  <HiCheckCircle />
                </ValidIcon>
              )}
            </InputWrapper>
            {!isMatch && confirmPassword && (
              <ErrorText>비밀번호가 일치하지 않습니다.</ErrorText>
            )}
          </InputGroup>
        </FormSection>

        <BottomButtonArea>
          <SubmitButton
            disabled={!isFormValid || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? "변경 중..." : "변경 완료"}
          </SubmitButton>
        </BottomButtonArea>
      </Container>
    </PageWrapper>
  );
};

export default ChangePasswordPage;

/* --- Styled Components --- */

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
`;

const Container = styled.div`
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Description = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 30px;
  background: #f8f9fa;
  padding: 16px;
  border-radius: 12px;
`;

const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  flex: 1;
`;

const Divider = styled.div`
  height: 1px;
  background: #f1f3f5;
  margin: 8px 0;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-left: 4px;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  padding: 0 12px;
  height: 50px;
  transition: all 0.2s;

  &:focus-within {
    border-color: #00b894;
    box-shadow: 0 0 0 3px rgba(0, 184, 148, 0.1);
  }

  &.valid {
    border-color: #00b894;
    background-color: #f0fdf4;
  }
`;

const InputIcon = styled.div`
  color: #adb5bd;
  font-size: 20px;
  margin-right: 10px;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  background: none;
  font-size: 15px;
  height: 100%;
  outline: none;

  &::placeholder {
    color: #ced4da;
  }
`;

const ValidIcon = styled.div`
  color: #00b894;
  font-size: 20px;
  display: flex;
  align-items: center;
`;

const ValidationRules = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 4px;
  padding-left: 4px;
`;

const RuleItem = styled.div<{ valid: boolean }>`
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${(props) => (props.valid ? "#00b894" : "#adb5bd")};
  font-weight: ${(props) => (props.valid ? "600" : "400")};
  transition: color 0.2s;
`;

const ErrorText = styled.span`
  font-size: 12px;
  color: #fa5252;
  margin-left: 4px;
`;

const BottomButtonArea = styled.div`
  margin-top: 40px;
  padding-bottom: 80px;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 52px;
  border-radius: 14px;
  background-color: #212529;
  color: white;
  font-size: 16px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s;

  &:disabled {
    background-color: #e9ecef;
    color: #adb5bd;
    cursor: not-allowed;
  }

  &:not(:disabled):hover {
    background-color: #343a40;
    transform: translateY(-2px);
  }

  &:not(:disabled):active {
    transform: translateY(0);
  }
`;
