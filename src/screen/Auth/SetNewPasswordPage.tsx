// src/screen/Auth/SetNewPasswordPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { HiArrowLeft, HiCheckCircle } from "react-icons/hi2";
import Input from "../../components/Input/Input";
import Modal1 from "../../components/Modal/Modal1";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
`;

const PageWrapper = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f8faf9 0%, #e8f5e9 100%);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 20px;
  padding-top: 40px;
`;

const BackgroundDecoration = styled.div`
  position: fixed;
  top: -100px;
  right: -100px;
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--color-subtle), var(--color-sub));
  border-radius: 50%;
  opacity: 0.3;
  filter: blur(60px);
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: 480px;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  animation: ${fadeIn} 0.5s ease;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: white;
  color: var(--color-dark2);
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
`;

const HeaderTitle = styled.h1`
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-family: "Pretendard-Bold";
  margin-right: 44px;
`;

const Card = styled.div`
  background: white;
  border-radius: 24px;
  padding: 32px 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.5s ease 0.1s backwards;
`;

const SuccessIcon = styled.div`
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  animation: ${float} 3s ease-in-out infinite;
`;

const Title = styled.h2`
  font-size: 24px;
  font-family: "Pretendard-Bold";
  text-align: center;
  margin-bottom: 8px;
  white-space: pre-line;
`;

const SubTitle = styled.p`
  font-size: 14px;
  color: var(--color-dark1);
  text-align: center;
  margin-bottom: 28px;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 13px;
  font-family: "Pretendard-SemiBold";
  margin-bottom: 8px;
  margin-top: 20px;
`;

const HelperText = styled.p`
  font-size: 12px;
  color: #666;
  margin-top: 6px;
`;

const ErrorMessage = styled.div`
  background: #fff5f5;
  color: var(--color-error);
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 10px;
  margin-top: 8px;
`;

const SuccessMessage = styled.div`
  background: #f0fdf4;
  color: #16a34a;
  font-size: 13px;
  padding: 10px 14px;
  border-radius: 10px;
  margin-top: 8px;
`;

const PrimaryButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  padding: 16px;
  background: ${(p) =>
    p.disabled
      ? "#e5e5e5"
      : "linear-gradient(135deg, var(--color-main), var(--color-main-darker))"};
  color: ${(p) => (p.disabled ? "#999" : "white")};
  border: none;
  border-radius: 14px;
  font-size: 16px;
  font-family: "Pretendard-Bold";
  cursor: ${(p) => (p.disabled ? "not-allowed" : "pointer")};
  margin-top: 32px;
  min-height: 52px;
`;

const ModalContent = styled.div`
  text-align: center;
  padding: 20px 0;
`;

const ModalIcon = styled.div`
  margin-bottom: 20px;
`;

const ModalTitle = styled.h2`
  font-size: 20px;
  font-family: "Pretendard-Bold";
  white-space: pre-line;
  line-height: 1.4;
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

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwError, setPwError] = useState<string | null>(null);
  const [confirmPwError, setConfirmPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [confirmPwSuccess, setConfirmPwSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!state?.identifier || !state?.method) {
      alert("잘못된 접근입니다.");
      navigate("/login/find-pw");
    }
  }, [state, navigate]);

  const validatePassword = useCallback(
    (pw: string) => PASSWORD_REGEX.test(pw),
    []
  );

  const handlePwBlur = () => {
    if (!password) {
      setPwError("새 비밀번호를 입력해주세요.");
      setPwSuccess(false);
    } else if (!validatePassword(password)) {
      setPwError("영문, 숫자, 특수문자를 포함한 8~16자로 입력해주세요.");
      setPwSuccess(false);
    } else {
      setPwError(null);
      setPwSuccess(true);
    }
  };

  const handleConfirmPwBlur = () => {
    if (!confirmPassword) {
      setConfirmPwError("비밀번호 확인을 입력해주세요.");
      setConfirmPwSuccess(false);
    } else if (password !== confirmPassword) {
      setConfirmPwError("비밀번호가 일치하지 않습니다.");
      setConfirmPwSuccess(false);
    } else {
      setConfirmPwError(null);
      setConfirmPwSuccess(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePwBlur();
    handleConfirmPwBlur();

    if (!validatePassword(password) || password !== confirmPassword) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowModal(true);
    }, 1500);
  };

  return (
    <PageWrapper>
      <BackgroundDecoration />
      <ContentWrapper>
        <Header>
          <BackButton to="/login/find-pw">
            <HiArrowLeft size={22} />
          </BackButton>
          <HeaderTitle>비밀번호 찾기</HeaderTitle>
        </Header>
        <Card>
          <SuccessIcon>
            <HiCheckCircle size={32} />
          </SuccessIcon>
          <Title>{"인증이 완료되었습니다"}</Title>
          <SubTitle>새로운 비밀번호를 입력해주세요</SubTitle>

          <form onSubmit={handleSubmit}>
            <InputLabel>새 비밀번호</InputLabel>
            <Input
              type="password"
              height={50}
              placeholder="새 비밀번호"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPwError(null);
              }}
              onBlur={handlePwBlur}
              hasError={!!pwError}
              hasSuccess={pwSuccess}
              maxLength={16}
            />
            {pwError ? (
              <ErrorMessage>⚠️ {pwError}</ErrorMessage>
            ) : (
              <HelperText>영문, 숫자, 특수문자를 포함하여 8~16자</HelperText>
            )}

            <InputLabel>새 비밀번호 확인</InputLabel>
            <Input
              type="password"
              height={50}
              placeholder="새 비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setConfirmPwError(null);
              }}
              onBlur={handleConfirmPwBlur}
              hasError={!!confirmPwError}
              hasSuccess={confirmPwSuccess}
              maxLength={16}
            />
            {confirmPwError && <ErrorMessage>⚠️ {confirmPwError}</ErrorMessage>}
            {confirmPwSuccess && (
              <SuccessMessage>✓ 비밀번호가 일치합니다</SuccessMessage>
            )}

            <PrimaryButton
              type="submit"
              disabled={isLoading || !pwSuccess || !confirmPwSuccess}
            >
              {isLoading ? "변경 중..." : "비밀번호 변경하기"}
            </PrimaryButton>
          </form>
        </Card>
      </ContentWrapper>

      <Modal1
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          navigate("/login");
        }}
        confirmText="로그인 하러 가기"
        onConfirm={() => {
          setShowModal(false);
          navigate("/login");
        }}
      >
        <ModalContent>
          <ModalIcon>
            <HiCheckCircle size={48} color="var(--color-main)" />
          </ModalIcon>
          <ModalTitle>{"비밀번호 변경이\n완료되었습니다"}</ModalTitle>
        </ModalContent>
      </Modal1>
    </PageWrapper>
  );
};

export default SetNewPasswordPage;
