import React, { useCallback, useEffect } from "react";
import styled from "styled-components";

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
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>X</CloseButton>
        <div id="address-search" style={{ width: "100%", height: "100%" }} />
      </ModalContent>
    </ModalOverlay>
  );
};

export default DaumAddressModal;

// 스타일 컴포넌트 정의
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6); // 반투명 배경
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
