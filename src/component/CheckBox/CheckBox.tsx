import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa6";

import React, { useState } from "react";
import "./CheckBox.css";
import styled from "styled-components";

interface CheckBoxProps {
  title?: string; //체크박스 제목
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
  title = "",
  detail,
  isToggle = false,
  isChecked,
}) => {
  const [toggle, setToggle] = useState<boolean>(false);
  // const [check, setCheck] = useState<boolean>(false);
  const [allCheck, setAllCheck] = useState<boolean>(false);
  const [checks, setChecks] = useState<boolean[]>([false, false, false]);
  const [toggles, setToggles] = useState<boolean[]>([false, false, false]);

  //체크 여부에 따라 useState 상태 변경
  const allClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    setAllCheck(!allCheck);
    const newAllCheck = !allCheck;
    console.log("all");
    setChecks(checks.map(() => newAllCheck));
    console.log("all selelcted", newAllCheck);
  };

  //제목 눌렀을 때도 체크 되는 click 이벤트
  // const titleClick = (e: React.MouseEvent<HTMLLabelElement>): void => {
  //   setCheck(!check);
  //   console.log(check);
  // };

  const checkboxClick = (index: number) => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);
    setAllCheck(newChecks.every((check) => check));
    console.log("individual checkbox states: ", newChecks);
  };

  //설명 상세보기
  const toggleClick = (index: number) => {
    const newToggles = [...toggles];
    newToggles[index] = !newToggles[index];
    setToggles(newToggles);
  };

  return (
    <div>
      <CheckBox_all onClick={allClick}>
        <FaCheck
          className={allCheck ? "CheckBox-icon" : "CheckBox-icon icon"}
        />
        전체선택
      </CheckBox_all>
      {checks.map((check, index) => (
        <CheckBox_wrapper key={index}>
          <CheckBox_content>
            <CheckBox_title onClick={() => checkboxClick(index)}>
              <FaCheck
                className={check ? "CheckBox-icon" : "CheckBox-icon icon"}
              />
              약관 동의를 {index + 1}을 선택하세요
            </CheckBox_title>
            <div onClick={() => toggleClick(index)}>
              {toggles[index] ? (
                <FaAngleDown size={20} />
              ) : (
                <FaAngleUp size={20} />
              )}
            </div>
          </CheckBox_content>
          {toggles[index] && (
            <CheckBox_detail>안녕하세요 {index + 1} 설명입니다</CheckBox_detail>
          )}
        </CheckBox_wrapper>
      ))}
    </div>
  );
};

export default CheckBox;

const CheckBox_wrapper = styled.div`
  width: 100%;
  align-items: center;
  padding: 5px;
`;
const CheckBox_content = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const CheckBox_title = styled.label`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const CheckBox_detail = styled.div`
  background-color: var(--color-light2);
  padding: 10px;
  border-radius: 5px;
  margin-top: 5px;
`;
const CheckBox_all = styled.div`
  display: flex;
  padding: 5px;
  align-items: center;
  border-radius: 5px;
  width: 100%;
`;
