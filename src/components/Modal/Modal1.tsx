import React, { ReactNode, useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";

/**
 * ModalProps 인터페이스 - Modal 컴포넌트에 전달되는 props 정의
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  confirmText?: string;
  onConfirm?: () => void;
  children?: ReactNode;
}

/**
 * Modal1 컴포넌트 - Children과 한 개의 버튼을 가지는 모달 컴포넌트
 */
const Modal1: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  confirmText = "확인",
  onConfirm,
  children,
}) => {
  const [visible, setVisible] = useState(isOpen);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isOpen) {
      setVisible(true);
    } else {
      timeout = setTimeout(() => setVisible(false), 300);
    }
    return () => clearTimeout(timeout);
  }, [isOpen]);

  if (!visible) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <Overlay isOpen={isOpen} onClick={onClose}>
      <ModalContainer isOpen={isOpen} onClick={(e) => e.stopPropagation()}>
        {title && <ModalTitle>{title}</ModalTitle>}
        {children && <Content>{children}</Content>}
        <ButtonGroup>
          <Button variant="primary" onClick={handleConfirm}>
            {confirmText}
          </Button>
        </ButtonGroup>
      </ModalContainer>
    </Overlay>
  );
};

export default Modal1;

/* --- Animations --- */
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

/* --- Styled Components --- */
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

const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 800;
  color: #1a1a1a;
  margin-bottom: 12px;
  word-break: keep-all;
`;

const Content = styled.div`
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin-bottom: 24px;
  width: 100%;
`;

const ButtonGroup = styled.div`
  display: flex;
  width: 100%;
`;

const Button = styled.button<{ variant: "primary" | "secondary" }>`
  flex: 1;
  padding: 14px;
  border-radius: 14px;
  border: none;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;

  ${(p) =>
    p.variant === "primary" &&
    css`
      background: var(--color-main);
      color: white;
      &:active {
        transform: scale(0.98);
      }
    `}

  ${(p) =>
    p.variant === "secondary" &&
    css`
      background: #f1f3f5;
      color: #495057;
      &:active {
        transform: scale(0.98);
      }
    `}
`;
