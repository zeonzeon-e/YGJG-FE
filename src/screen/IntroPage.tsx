import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { CSSTransition } from "react-transition-group";
import logo from "/_축구공 로고.png";

const IntroPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 3000); // 3초 후에 메인 페이지로 이동

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
  }, [navigate]);

  return (
    <CSSTransition in={true} appear={true} timeout={1500} classNames="fade">
      <IntroContainer>
        <Image
          src={process.env.PUBLIC_URL + "/_축구공 로고.png"}
          alt="Intro Logo"
        />
        <Title>요기조기</Title>
      </IntroContainer>
    </CSSTransition>
  );
};

export default IntroPage;

const fadeIn = keyframes`
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
`;

const IntroContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100vh;
  font-size: 2rem;
  animation: ${fadeIn} 1.5s ease-in-out;
`;

const Image = styled.img`
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
  animation: ${fadeIn} 1.5s ease-in-out;
`;

const Title = styled.h1`
  animation: ${fadeIn} 1.5s ease-in-out;
`;
