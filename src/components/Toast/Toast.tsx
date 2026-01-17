import React from "react";
import styled, { keyframes } from "styled-components";
import { useToastStore, Toast as ToastType } from "../../stores/toastStore";
import {
  HiCheckCircle,
  HiExclamationCircle,
  HiInformationCircle,
  HiXMark,
} from "react-icons/hi2";

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ToastItemContainer = styled.div<{ type: ToastType["type"] }>`
  background: rgba(33, 37, 41, 0.9);
  color: white;
  padding: 14px 20px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(10px);
  min-width: 300px;
  max-width: 90%;
  animation: ${slideUp} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto;
  margin-top: 10px;

  ${(props) =>
    props.type === "error" &&
    `
    background: rgba(250, 82, 82, 0.95);
  `}

  ${(props) =>
    props.type === "success" &&
    `
    background: rgba(33, 37, 41, 0.95);
  `}
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 20px;
`;

const Message = styled.span`
  font-size: 14px;
  font-weight: 500;
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  font-size: 18px;

  &:hover {
    color: white;
  }
`;

const ToastContainerWrapper = styled.div`
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
  width: 100%;
`;

const ToastItem: React.FC<{
  toast: ToastType;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <HiCheckCircle color="#51cf66" />;
      case "error":
        return <HiExclamationCircle color="white" />;
      case "warning":
        return <HiExclamationCircle color="#ffd43b" />;
      default:
        return <HiInformationCircle color="#339af0" />;
    }
  };

  return (
    <ToastItemContainer type={toast.type}>
      <IconWrapper>{getIcon()}</IconWrapper>
      <Message>{toast.message}</Message>
      <CloseButton onClick={() => onRemove(toast.id)}>
        <HiXMark />
      </CloseButton>
    </ToastItemContainer>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <ToastContainerWrapper>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </ToastContainerWrapper>
  );
};
