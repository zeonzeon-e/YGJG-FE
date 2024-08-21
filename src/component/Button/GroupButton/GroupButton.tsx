import React, { useState } from "react";
import "./GroupButton.css";

// props 타입 정의
interface GroupButtonProps {
  items: string[];
  textColor?: string;
  fontSize?: number;
  type: string;
}

/**
 * props가 적용된 button 컴포넌트 생성
 * @param {GroupButtonProps} props - 컴포넌트 props
 * @param {string} [props.items] - 그룹 버튼으로 묶일 요소들
 * @param {string} [props.textColor] - 글씨 색상 (선택적)
 * @param {number} [porps.fontSize] - 텍스트 사이즈
 * @param {number} [porps.type] - multi:다중선택, single:단일선택
 *
 * @returns {JSX.Element} button 컴포넌트
 */

const GroupButton: React.FC<GroupButtonProps> = ({
  textColor,
  items,
  fontSize,
  type,
}) => {
  const [isIndexSelect, setIsIndexSelect] = useState(
    Array(items.length).fill(false)
  );
  console.log(isIndexSelect);
  //클릭했을 때 이벤트
  const MutihandleClick = (idx: number) => {
    // const newArr: boolean[] = Array(items.length).fill(false);
    const newArr: boolean[] = [...isIndexSelect];
    newArr[idx] = !isIndexSelect[idx];
    setIsIndexSelect(newArr);
  };

  const SinglehandleClick = (idx: number) => {
    const newArr: boolean[] = Array(items.length).fill(false);
    newArr[idx] = true;
    setIsIndexSelect(newArr);
  };

  const ChoosehandleClick = (index: number) => {
    if (type === "multi") MutihandleClick(index);
    if (type === "single") SinglehandleClick(index);
  };

  return (
    <div className="flex flex-jc-sb">
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => ChoosehandleClick(index)}
          className={
            isIndexSelect[index] ? "GroupButton_el click" : "GroupButton_el"
          }
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default GroupButton;
