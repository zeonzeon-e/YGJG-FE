import React, { ReactNode } from "react";
import styled from "styled-components";
import MainButton from "../Button/MainButton";

/**
 * ModalProps 인터페이스 - Modal 컴포넌트에 전달되는 props 정의
 * @interface ModalProps
 * @property {boolean} isOpen - 모달이 열려있는지 여부를 결정
 * @property {() => void} onClose - 모달을 닫기 위한 함수
 * @property {string} [title] - 모달의 제목 텍스트 (선택적)
 * @property {string} [confirmText] - 확인 버튼에 표시될 텍스트 (선택적, 기본값: "확인")
 * @property {string} [cancelText] - 취소 버튼에 표시될 텍스트 (선택적, 기본값: "취소")
 * @property {() => void} [onConfirm] - 확인 버튼 클릭 시 호출되는 함수 (선택적)
 * @property {ReactNode} [children] - 모달 내용에 포함될 추가적인 JSX 요소들 (선택적)
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  children?: ReactNode; // children을 받을 수 있도록 추가
}

/**
 * Modal2 컴포넌트 - Children과 두 개의 버튼을 가지는 모달 컴포넌트
 * ( 내부 코드 하단의 사용 예시 참고 )
 * @param {ModalProps} props - Modal 컴포넌트에 전달되는 props
 * @param {boolean} props.isOpen - 모달이 현재 열려 있는지를 결정하는 플래그
 * @param {() => void} props.onClose - 모달을 닫기 위한 콜백 함수
 * @param {string} [props.title] - 모달의 제목으로 표시될 문자열 (선택적)
 * @param {string} [props.confirmText="확인"] - 확인 버튼에 표시될 텍스트 (선택적)
 * @param {string} [props.cancelText="취소"] - 취소 버튼에 표시될 텍스트 (선택적)
 * @param {() => void} [props.onConfirm] - 확인 버튼 클릭 시 호출될 함수 (선택적)
 * @param {ReactNode} [props.children] - 모달의 본문 내용을 구성할 추가적인 JSX 요소들 (선택적)
 * @returns {JSX.Element | null} - 모달이 열려 있으면 JSX를 반환하고, 그렇지 않으면 null을 반환하여 아무 것도 렌더링하지 않음
 */
const Modal2: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        {title && <ModalTitle>{title}</ModalTitle>}
        {children && <Content>{children}</Content>}
        <ButtonContainer>
          <MainButton onClick={onConfirm}>{confirmText}</MainButton>
          <MainButton
            bgColor="#fff"
            textColor="var(--color-main)"
            onClick={onClose}
          >
            {cancelText}
          </MainButton>
        </ButtonContainer>
      </ModalContent>
    </Overlay>
  );
};

export default Modal2;

// 스타일 컴포넌트 정의

/**
 * Overlay - 모달 배경을 어둡게 하고 중앙에 모달을 표시하기 위한 오버레이
 */
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

/**
 * ModalContent - 모달의 내용을 감싸는 컨테이너
 */
const ModalContent = styled.div`
  background-color: #fff;
  display: flex;
  flex-direction: column;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

/**
 * ModalTitle - 모달의 제목을 스타일링하는 컴포넌트
 */
const ModalTitle = styled.h2`
  margin-bottom: 20px;
  margin-left: 30px;
  margin-right: 30px;
`;

/**
 * Content - 모달의 본문 내용을 감싸는 컨테이너
 */
const Content = styled.div`
  margin-bottom: 20px;
`;

/**
 * ButtonContainer - 확인 및 취소 버튼을 감싸는 컨테이너
 */
const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

/* ############################ 사용 예시 시작 ###############################
const Modal2ExamplePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirm = () => {
    // 여기에서 탈퇴 처리 등의 작업 수행
    console.log("탈퇴가 확인되었습니다.");
    setIsModalOpen(false);
  };

  return (
    <ExampleContainer>
      <OpenModalButton onClick={handleOpenModal}>팀 탈퇴</OpenModalButton>
      <Modal2
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="팀을 탈퇴하시겠습니까?"
        confirmText="네, 탈퇴하겠습니다"
        cancelText="아니요, 탈퇴하지 않겠습니다"
        onConfirm={handleConfirm}
      >
        <p>
          탈퇴 시 팀의 모든 권한이 박탈되며, 다시 가입하려면 관리자의 승인이
          필요합니다.
        </p>
      </Modal2>
    </ExampleContainer>
  );
};

// 스타일 컴포넌트 정의

const ExampleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f7f7f7;
`;

const OpenModalButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  color: #fff;
  background-color: #0e6244;
  border: none;
  border-radius: 8px;
  cursor: pointer;

  &:hover {
    background-color: #0a4c32;
  }
`;

############################ 사용 예시 끝 ###############################
*/
