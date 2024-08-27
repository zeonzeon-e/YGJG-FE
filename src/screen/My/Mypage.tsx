import React, { useState } from "react";
import GlobalStyles from "../../component/Styled/GlobalStyled";

import Header1 from "../../component/Header/Header1/Header1";

const MyPage: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <div className="MyPage">
        <Header1 text="마이페이지" />
      </div>
    </>
  );
};

export default MyPage;
