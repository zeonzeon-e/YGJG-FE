import React, { useCallback, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { IoClose } from "react-icons/io5"; // 아이콘 사용을 위해 추가

// DaumAddressModalProps 인터페이스 정의
interface DaumAddressModalProps {
  onClose: () => void; // 모달을 닫는 함수
  onAddressSelect: (address: string) => void; // 주소 선택 시 실행될 함수
}

// 글로벌 윈도우 객체에 대한 타입 확장
declare global {
  interface Window {
    daum: any; // Daum 객체의 타입을 any로 지정
  }
}

const DaumAddressModal: React.FC<DaumAddressModalProps> = ({
  onClose,
  onAddressSelect,
}) => {
  // 주소 검색 기능을 초기화하는 함수
  const initializePostcode = useCallback(() => {
    new window.daum.Postcode({
      oncomplete: (data: any) => {
        // 주소 검색 완료 시 실행되는 콜백 함수
        let fullAddress = data.address; // 기본 주소
        let extraAddress = ""; // 추가 주소

        if (data.addressType === "R") {
          // 도로명 주소인 경우
          if (data.bname !== "") {
            extraAddress += data.bname;
          }
          if (data.buildingName !== "") {
            extraAddress +=
              extraAddress !== ""
                ? `, ${data.buildingName}`
                : data.buildingName;
          }
          fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
        }
        onAddressSelect(fullAddress); // 선택된 주소를 부모 컴포넌트로 전달
        onClose(); // 모달을 닫음
      },
      width: "100%", // 모달의 너비
      height: "100%", // 모달의 높이
    }).embed(document.getElementById("address-search") as HTMLElement); // 모달 내부에 주소 검색 창을 임베드
  }, [onClose, onAddressSelect]);

  useEffect(() => {
    const scriptId = "daum-postcode-script"; // 스크립트 아이디
    let script = document.getElementById(scriptId) as HTMLScriptElement; // 스크립트 엘리먼트

    script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"; // 다음 API 스크립트 URL
    script.async = true; // 비동기 로드
    document.body.appendChild(script); // 문서에 스크립트 추가

    script.onload = () => {
      // 스크립트 로드 완료 시 실행
      if (window.daum && window.daum.Postcode) {
        initializePostcode(); // 주소 검색 초기화 함수 호출
      }
    };

    // 컴포넌트 언마운트 시 스크립트 이벤트 해제
    return () => {
      script.onload = null; // onload 이벤트 해제
    };
  }, [initializePostcode]);

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>주소 검색</Title>
          <CloseButton onClick={onClose}>
            <IoClose size={24} />
          </CloseButton>
        </Header>
        <Body>
          {/* 로직에서 사용하는 ID 유지 */}
          <div id="address-search" style={{ width: "100%", height: "100%" }} />
        </Body>
      </ModalContainer>
    </Overlay>
  );
};

export default DaumAddressModal;

/* ===================== 스타일 컴포넌트 (변경됨) ===================== */

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const popIn = keyframes`
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease-out;
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 400px;
  height: 500px;
  max-height: 80vh; 
  max-height: 80dvh; /* 모바일 대응 */
  
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: ${popIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  margin: auto;
`;

const Header = styled.div`
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f0f2f5;
  background: #fff;
  flex-shrink: 0;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 4px;
  border-radius: 50%;
  transition: all 0.2s;
  display: flex;

  &:hover {
    background: #f3f4f6;
    color: #4b5563;
  }
`;

const Body = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-bottom-left-radius: 28px;
  border-bottom-right-radius: 28px;

  /* iframe 강제 스타일링 (모서리 둥글게) */
  & > div > iframe {
    border-bottom-left-radius: 28px !important;
    border-bottom-right-radius: 28px !important;
  }
`;