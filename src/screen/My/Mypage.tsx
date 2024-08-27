import React, { useState } from "react";
import GlobalStyles from "../../component/Styled/GlobalStyled";
import logo512 from "../../../public/logo512.png";
import Header1 from "../../component/Header/Header1/Header1";
import styled from "styled-components";

const MyPage: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <div className="MyPage">
        <Header1 text="마이페이지" />
        <Profile>
          <div>이미지</div>
          <div>
            <div className="h3">이름</div>
            <div className="p">julia3277@naver.com</div>
          </div>
          <SystemButton>프로필 설정</SystemButton>
        </Profile>
      </div>
    </>
  );
};

export default MyPage;

const Profile = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  height: 120px;
  padding-top: 20px;
  justify-content: space-between;
`;

const SystemButton = styled.button`
  margin: auto;
  width: 70px;
  font-family: Pretendard-Light;
  font-size: 12px;
  background-color: var(--color-dark1);
  border: 0px;
  border-radius: 10px;
  padding: 2px;
  color: var(--color-light1);
  box-shadow: 0 0.5px 1px rgba(0, 0, 0, 0.3);
`;
