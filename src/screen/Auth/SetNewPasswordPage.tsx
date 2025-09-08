// src/screen/Auth/SetNewPasswordPage.tsx
import React, { useState, useEffect, useCallback } from "react"; // useRef 제거
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import Header2 from "../../components/Header/Header2/Header2";
import MainButton from "../../components/Button/MainButton";
import Input from "../../components/Input/Input";
import Modal1 from "../../components/Modal/Modal1";
// import apiClient from "../../api/apiClient";

const Wrapper = styled.div`
  margin: 0px 10px;
  padding: 0px 10px;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 5px;
  margin: auto;
`;

const PageTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin: 60px 0 40px 0;
  color: var(--color-dark2);
  text-align: center;
  width: 100%;
  white-space: pre-line;
`;

const Form = styled.form`
  width: 100%;
`;

const InputWrapper = styled.div`
  position: relative; /* 혹시 모를 다른 용도를 위해 유지 */
  width: 100%;
  margin-bottom: 10px;
`;

const StyledPageInput = styled(Input)`
  /* 추가 스타일 필요 시 여기에 작성 */
`;

// 아이콘 관련 스타일 컴포넌트 제거
// const BaseIconStyle = ...
// const ShowPasswordIconStyled = ...
// const ClearIconStyled = ...

const MessageBase = styled.p`
  font-size: 12px;
  margin-top: 6px;
  padding-left: 2px;
  min-height: 1.2em;
  text-align: left;
  width: 100%;
`;

const HelperText = styled(MessageBase)`
  color: #555;
`;

const ErrorMessage = styled(MessageBase)`
  color: var(--color-error);
`;

const SuccessMessage = styled(MessageBase)`
  color: var(--color-success);
`;

const ButtonGroup = styled.div`
  width: 100%;
  margin-top: 30px;
`;

const ModalTitleStyled = styled.h2`
  font-size: 20px;
  font-weight: bold;
  color: #333;
  text-align: center;
  white-space: pre-line;
  line-height: 1.4;
  margin-bottom: 20px;
`;

interface LocationState {
  method?: "phone" | "email";
  identifier?: string;
}

const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/;

const SetNewPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  // 아이콘 관련 ref 제거
  // const passwordInputRef = useRef<HTMLInputElement>(null);
  // const confirmPasswordInputRef = useRef<HTMLInputElement>(null);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 아이콘 관련 상태 변수 제거
  // const [showPassword, setShowPassword] = useState(false);
  // const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordFieldError, setPasswordFieldError] = useState<string | null>(
    null
  );
  const [confirmPasswordFieldError, setConfirmPasswordFieldError] = useState<
    string | null
  >(null);
  const [showPasswordErrorBorder, setShowPasswordErrorBorder] = useState(false);
  const [showPasswordSuccessBorder, setShowPasswordSuccessBorder] =
    useState(false);
  const [showConfirmPasswordErrorBorder, setShowConfirmPasswordErrorBorder] =
    useState(false);
  const [
    showConfirmPasswordSuccessBorder,
    setShowConfirmPasswordSuccessBorder,
  ] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  useEffect(() => {
    if (!state || !state.identifier || !state.method) {
      alert("잘못된 접근입니다. 비밀번호 찾기를 처음부터 다시 진행해주세요.");
      navigate("/login/find-pw");
    }
  }, [state, navigate]);

  const validatePasswordFormat = useCallback((pw: string): boolean => {
    return PASSWORD_REGEX.test(pw);
  }, []);

  // 내용 지우기 아이콘 및 관련 로직 제거 (clearInput 함수 제거)
  // const clearInput = (...) => { ... };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (passwordFieldError) {
      setPasswordFieldError(null);
      setShowPasswordErrorBorder(false);
      setShowPasswordSuccessBorder(false);
    }
    if (confirmPassword) {
      handleConfirmPasswordValidation(newPassword, confirmPassword);
    }
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordFieldError("새 비밀번호를 입력해주세요.");
      setShowPasswordErrorBorder(true);
      setShowPasswordSuccessBorder(false);
      return;
    }
    if (!validatePasswordFormat(password)) {
      setPasswordFieldError(
        "영문, 숫자, 특수문자를 포함한 8~16자로 입력해주세요."
      );
      setShowPasswordErrorBorder(true);
      setShowPasswordSuccessBorder(false);
    } else {
      setPasswordFieldError(null);
      setShowPasswordErrorBorder(false);
      setShowPasswordSuccessBorder(true);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (confirmPasswordFieldError) {
      setConfirmPasswordFieldError(null);
      setShowConfirmPasswordErrorBorder(false);
      setShowConfirmPasswordSuccessBorder(false);
    }
  };

  const handleConfirmPasswordValidation = (
    currentPassword: string,
    currentConfirmPassword: string
  ) => {
    if (
      !currentConfirmPassword &&
      currentPassword &&
      showPasswordSuccessBorder
    ) {
      setConfirmPasswordFieldError("새 비밀번호를 다시 한번 입력해주세요.");
      setShowConfirmPasswordErrorBorder(true);
      setShowConfirmPasswordSuccessBorder(false);
      return false;
    }
    if (currentConfirmPassword && currentPassword !== currentConfirmPassword) {
      setConfirmPasswordFieldError("비밀번호가 일치하지 않습니다.");
      setShowConfirmPasswordErrorBorder(true);
      setShowConfirmPasswordSuccessBorder(false);
      return false;
    }
    if (
      currentConfirmPassword &&
      currentPassword === currentConfirmPassword &&
      validatePasswordFormat(currentPassword)
    ) {
      setConfirmPasswordFieldError(null);
      setShowConfirmPasswordErrorBorder(false);
      setShowConfirmPasswordSuccessBorder(true);
      return true;
    }
    setShowConfirmPasswordErrorBorder(false);
    setShowConfirmPasswordSuccessBorder(false);
    return false;
  };

  const handleConfirmPasswordBlur = () => {
    handleConfirmPasswordValidation(password, confirmPassword);
  };

  // 아이콘 클릭 핸들러 (togglePasswordVisibility) 제거
  // const togglePasswordVisibility = (...) => { ... };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handlePasswordBlur();
    const isConfirmPwValid = handleConfirmPasswordValidation(
      password,
      confirmPassword
    );
    const isPasswordFormatValid = validatePasswordFormat(password);

    if (
      !isPasswordFormatValid ||
      !isConfirmPwValid ||
      !password ||
      !confirmPassword ||
      passwordFieldError ||
      confirmPasswordFieldError
    ) {
      if (!password) {
        setPasswordFieldError("새 비밀번호를 입력해주세요.");
        setShowPasswordErrorBorder(true);
      }
      if (!confirmPassword && password && isPasswordFormatValid) {
        setConfirmPasswordFieldError("새 비밀번호를 다시 한번 입력해주세요.");
        setShowConfirmPasswordErrorBorder(true);
      }
      return;
    }

    setIsLoading(true);
    console.log("비밀번호 변경 시도:", {
      identifier: state?.identifier,
      method: state?.method,
      newPassword: password,
    });
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccessModalOpen(true);
    }, 1500);
  };

  const handleModalConfirm = () => {
    setIsSuccessModalOpen(false);
    navigate("/login");
  };

  const loginPageInputStyleProps = {
    bgColor: "#f9f9f9",
    height: 50,
    padding: 15,
    fontSize: 16,
  };

  return (
    <Wrapper>
      <Header2 text="비밀번호 찾기" />
      <Container>
        <PageTitle>
          {"인증이 완료되었습니다.\n새로운 비밀번호를 입력해주세요."}
        </PageTitle>
        <Form onSubmit={handleSubmit}>
          <InputWrapper>
            <StyledPageInput
              // ref 제거
              type="password" // 항상 password 타입
              placeholder="새 비밀번호"
              value={password}
              onChange={handlePasswordChange}
              onBlur={handlePasswordBlur}
              disabled={isLoading}
              hasError={showPasswordErrorBorder}
              hasSuccess={showPasswordSuccessBorder && !showPasswordErrorBorder}
              maxLength={16}
              {...loginPageInputStyleProps}
            />
            {/* 아이콘 JSX 제거 */}
          </InputWrapper>
          {passwordFieldError ? (
            <ErrorMessage>{passwordFieldError}</ErrorMessage>
          ) : (
            <HelperText>
              영문, 숫자, 특수문자를 포함하여 8~16자로 입력해주세요.
            </HelperText>
          )}

          <InputWrapper style={{ marginTop: "15px" }}>
            <StyledPageInput
              // ref 제거
              type="password" // 항상 password 타입
              placeholder="새 비밀번호 확인"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              onBlur={handleConfirmPasswordBlur}
              disabled={isLoading}
              hasError={showConfirmPasswordErrorBorder}
              hasSuccess={
                showConfirmPasswordSuccessBorder &&
                !showConfirmPasswordErrorBorder &&
                validatePasswordFormat(password)
              }
              maxLength={16}
              {...loginPageInputStyleProps}
            />
            {/* 아이콘 JSX 제거 */}
          </InputWrapper>
          {confirmPasswordFieldError ? (
            <ErrorMessage>{confirmPasswordFieldError}</ErrorMessage>
          ) : showConfirmPasswordSuccessBorder &&
            !showConfirmPasswordErrorBorder &&
            validatePasswordFormat(password) ? (
            <SuccessMessage>비밀번호가 일치합니다.</SuccessMessage>
          ) : (
            <MessageBase> </MessageBase>
          )}

          <ButtonGroup>
            <MainButton
              height={50}
              fontSize={16}
              disabled={
                isLoading ||
                showPasswordErrorBorder ||
                showConfirmPasswordErrorBorder ||
                !showPasswordSuccessBorder ||
                !showConfirmPasswordSuccessBorder ||
                !password ||
                !confirmPassword
              }
            >
              {isLoading ? "변경 중..." : "비밀번호 변경하기"}
            </MainButton>
          </ButtonGroup>
        </Form>
      </Container>

      <Modal1
        isOpen={isSuccessModalOpen}
        onClose={handleModalConfirm}
        confirmText="로그인 하러 가기"
        onConfirm={handleModalConfirm}
      >
        <ModalTitleStyled>
          {"비밀번호 변경이\n완료되었습니다."}
        </ModalTitleStyled>
      </Modal1>
    </Wrapper>
  );
};

export default SetNewPasswordPage;
