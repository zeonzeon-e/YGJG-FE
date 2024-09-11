import React, { useEffect } from "react";
import styled from "styled-components";

interface DaumAddressModalProps {
  onClose: () => void;
  onAddressSelect: (address: string) => void;
}

declare global {
  interface Window {
    daum: any;
  }
}

const DaumAddressModal: React.FC<DaumAddressModalProps> = ({
  onClose,
  onAddressSelect,
}) => {
  useEffect(() => {
    // Daum Postcode API 스크립트가 없는 경우 동적으로 추가
    const script = document.createElement("script");
    script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;

    script.onload = () => {
      const postcode = new window.daum.Postcode({
        oncomplete: (data: any) => {
          let fullAddress = data.address;
          let extraAddress = '';

          if (data.addressType === 'R') {
            if (data.bname !== '') {
              extraAddress += data.bname;
            }
            if (data.buildingName !== '') {
              extraAddress += (extraAddress !== '' ? ', ' + data.buildingName : data.buildingName);
            }
            fullAddress += (extraAddress !== '' ? ' (' + extraAddress + ')' : '');
          }
          onAddressSelect(fullAddress); // 선택된 주소 전달
          onClose(); // 모달 닫기
        },
        // 주소 검색을 모달 내부에 직접 그리기 위해 div 컨테이너에 그려줍니다.
        width: "100%",
        height: "100%",
      }).embed(document.getElementById("address-search") as HTMLElement);

      //postcode.embed(document.getElementById("address-search") as HTMLElement);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [onClose, onAddressSelect]);

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>X</CloseButton>
        <div id="address-search" style={{ width: "100%", height: "100%" }} />
      </ModalContent>
    </ModalOverlay>
  );
};

export default DaumAddressModal;

// Styled Components
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  height: 600px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;
