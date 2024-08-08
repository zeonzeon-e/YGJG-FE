import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa6";

import React, { useState } from "react";
import "./CheckBox.css";

interface CheckBoxProps {
  content?: string; //체크박스 제목
  detail?: string; //체크박스 토글 안에 설명문
  isToggle: boolean; //드롭다운 사용 여부
  isChecked?: boolean; //강제 체크 설정
}

/**
 * ScrollProgress 컴포넌트 - 진행과정 렌더링
 * @param {CheckBoxProps} props - 컴포넌트에 전달되는 props
 * @param {React.ReactNode} [props.content] - 체크박스 옆에 올 제목
 * @param {React.ReactNode} [props.detail] - 체크박스 드롭다운 안에 들어갈 내용
 * @param {React.ReactNode} [props.isToggle] - 체크박스 드롭다운 여부
 * @param {React.ReactNode} [props.isChecked] - 강제 체크 설정
 * @returns {JSX.Element} ScrollProgress 컴포넌트
 */
const CheckBox: React.FC<CheckBoxProps> = ({
  content = "",
  detail,
  isToggle = false,
  isChecked,
}) => {
  const [toggle, setToggle] = useState<boolean>(false);
  //   const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //     setTitle(e.target.value);
  //   };
  const toggleClick = (e: React.MouseEvent<HTMLInputElement>): void => {
    setToggle(!toggle);
  };
  return (
    <div className="CheckBox flex flex-fd-c">
      <div className="CheckBox_main-div flex flex-jc-sb flex-ai-c">
        <div className=" flex flex-ai-c">
          <div>
            <input type="checkbox" className="CheckBox_input" />
            <FaCheck size={30} />
          </div>
          <h3 className="CheckBox_content">{content}</h3>
        </div>
        <div onClick={toggleClick}>
          {toggle ? <FaAngleUp size={30} /> : <FaAngleDown size={30} />}
        </div>
      </div>
      <div>{toggle ? <p className="CheckBox_detail">{detail}</p> : ""}</div>
    </div>
  );
};

export default CheckBox;
