import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
} from "react-icons/hi2";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: "alert" | "confirm";
  variant?: "success" | "danger" | "info";
  confirmText?: string;
  cancelText?: string;
}

const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = "alert",
  variant = "info",
  confirmText = "확인",
  cancelText = "취소",
}) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isOpen) {
      setVisible(true);
    } else {
      timeout = setTimeout(() => setVisible(false), 300); // Animation duration
    }
    return () => clearTimeout(timeout);
  }, [isOpen]);

  if (!visible) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const getIcon = () => {
    switch (variant) {
      case "success":
        return <HiCheckCircle size={40} color="#00b894" />;
      case "danger":
        return <HiExclamationCircle size={40} color="#ff6b6b" />;
      case "info":
      default:
        return <HiInformationCircle size={40} color="#var(--color-main)" />;
    }
  };

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        <IconWrapper>{getIcon()}</IconWrapper>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonGroup>
          {type === "confirm" && (
            <Button variant="secondary" onClick={onClose}>
              {cancelText}
            </Button>
          )}
          <Button
            variant={variant === "danger" ? "danger" : "primary"}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
};

export default AlertModal;

/* Animations */
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const scaleIn = keyframes`
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
`;

const scaleOut = keyframes`
  from { transform: scale(1); opacity: 1; }
  to { transform: scale(0.9); opacity: 0; }
`;

/* Styled Components */

const Overlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: ${(p) => (p.isOpen ? fadeIn : fadeOut)} 0.3s forwards;
`;

const ModalContainer = styled.div<{ isOpen: boolean }>`
  background: white;
  width: 100%;
  max-width: 320px;
  border-radius: 24px;
  padding: 32px 24px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  animation: ${(p) => (p.isOpen ? scaleIn : scaleOut)} 0.3s forwards;
`;

const IconWrapper = styled.div`
  margin-bottom: 20px;
  background: #f8f9fa;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h3`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  color: #333;
  margin-bottom: 8px;
`;

const Message = styled.p`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 24px;
  white-space: pre-wrap;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const Button = styled.button<{ variant: "primary" | "secondary" | "danger" }>`
  flex: 1;
  padding: 14px;
  border-radius: 14px;
  border: none;
  font-size: 14px;
  font-family: "Pretendard-SemiBold";
  cursor: pointer;
  transition: all 0.2s;

  ${(p) =>
    p.variant === "primary" &&
    css`
      background: var(--color-main);
      color: white;
      &:hover {
        background: var(--color-main-darker);
      }
    `}

  ${(p) =>
    p.variant === "danger" &&
    css`
      background: #ff6b6b;
      color: white;
      &:hover {
        background: #fa5252;
      }
    `}

  ${(p) =>
    p.variant === "secondary" &&
    css`
      background: #f1f3f5;
      color: #495057;
      &:hover {
        background: #e9ecef;
      }
    `}
`;
