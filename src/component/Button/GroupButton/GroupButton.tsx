// import React, { useState } from "react";
// import "./GroupButton.css";

// // props 타입 정의
// interface GroupButtonProps {
//   items: string[];
//   textColor?: string;
//   fontSize?: number;
//   type: string;
// }

// /**
//  * props가 적용된 button 컴포넌트 생성
//  * @param {GroupButtonProps} props - 컴포넌트 props
//  * @param {string} [props.items] - 그룹 버튼으로 묶일 요소들
//  * @param {string} [props.textColor] - 글씨 색상 (선택적)
//  * @param {number} [porps.fontSize] - 텍스트 사이즈
//  * @param {number} [porps.type] - multi:다중선택, single:단일선택
//  *
//  * @returns {JSX.Element} button 컴포넌트
//  */

// const GroupButton: React.FC<GroupButtonProps> = ({
//   textColor,
//   items,
//   fontSize,
//   type,
// }) => {
//   const [isIndexSelect, setIsIndexSelect] = useState(
//     Array(items.length).fill(false)
//   );
//   console.log(isIndexSelect);
//   //클릭했을 때 이벤트
//   const MutihandleClick = (idx: number) => {
//     // const newArr: boolean[] = Array(items.length).fill(false);
//     const newArr: boolean[] = [...isIndexSelect];
//     newArr[idx] = !isIndexSelect[idx];
//     setIsIndexSelect(newArr);
//   };

//   const SinglehandleClick = (idx: number) => {
//     const newArr: boolean[] = Array(items.length).fill(false);
//     newArr[idx] = true;
//     setIsIndexSelect(newArr);
//   };

//   const ChoosehandleClick = (index: number) => {
//     if (type === "multi") MutihandleClick(index);
//     if (type === "single") SinglehandleClick(index);
//   };

//   return (
//     <div className="flex flex-jc-sb">
//       {items.map((item, index) => (
//         <button
//           key={index}
//           onClick={() => ChoosehandleClick(index)}
//           className={
//             isIndexSelect[index] ? "GroupButton_el click" : "GroupButton_el"
//           }
//         >
//           {item}
//         </button>
//       ))}
//     </div>
//   );
// };

// export default GroupButton;
import React, { useState } from "react";
import styled from "styled-components";

// props 타입 정의
/**
 * GroupButtonProps - GroupButton 컴포넌트에 전달되는 props 타입 정의
 * @interface GroupButtonProps
 * @property {string[]} items - 그룹 버튼으로 묶일 요소들
 * @property {string} [textColor] - 글씨 색상 (선택적)
 * @property {number} [fontSize] - 텍스트 사이즈 (선택적)
 * @property {string} type - 버튼 선택 타입 (multi: 다중 선택, single: 단일 선택)
 */
interface GroupButtonProps {
  items: string[];
  textColor?: string;
  fontSize?: number;
  type: string;
}

/**
 * GroupButton 컴포넌트 - 그룹 버튼을 생성하고, 다중 선택 또는 단일 선택 옵션을 제공합니다.
 * @param {GroupButtonProps} props - 컴포넌트에 전달되는 props
 * @param {string[]} props.items - 그룹 버튼으로 묶일 요소들
 * @param {string} [props.textColor] - 글씨 색상 (선택적)
 * @param {number} [props.fontSize] - 텍스트 사이즈 (선택적)
 * @param {string} props.type - multi: 다중 선택, single: 단일 선택
 * @returns {JSX.Element} GroupButton 컴포넌트
 */
const GroupButton: React.FC<GroupButtonProps> = ({
  textColor,
  items,
  fontSize,
  type,
}) => {
  const [isIndexSelect, setIsIndexSelect] = useState<boolean[]>(
    Array(items.length).fill(false)
  );

  // 다중 선택 핸들러
  const MutihandleClick = (idx: number) => {
    const newArr: boolean[] = [...isIndexSelect];
    newArr[idx] = !isIndexSelect[idx];
    setIsIndexSelect(newArr);
  };

  // 단일 선택 핸들러
  const SinglehandleClick = (idx: number) => {
    const newArr: boolean[] = Array(items.length).fill(false);
    newArr[idx] = true;
    setIsIndexSelect(newArr);
  };

  // 선택 핸들러 (다중/단일 선택에 따라 처리)
  const ChoosehandleClick = (index: number) => {
    if (type === "multi") MutihandleClick(index);
    if (type === "single") SinglehandleClick(index);
  };

  return (
    <ButtonContainer>
      {items.map((item, index) => (
        <StyledButton
          key={index}
          onClick={() => ChoosehandleClick(index)}
          isSelected={isIndexSelect[index]}
          textColor={textColor}
          fontSize={fontSize}
        >
          {item}
        </StyledButton>
      ))}
    </ButtonContainer>
  );
};

export default GroupButton;

/* Styled-components */

/* 버튼 컨테이너 스타일 */
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

/* 스타일이 적용된 버튼 컴포넌트 */
interface StyledButtonProps {
  isSelected: boolean;
  textColor?: string;
  fontSize?: number;
}

const StyledButton = styled.button<StyledButtonProps>`
  border: 1px solid var(--color-dark1);
  box-sizing: border-box;
  padding: 10px;
  width: 90%;
  margin: 2px;
  border-radius: 8px;
  color: ${({ isSelected, textColor }) =>
    isSelected ? "var(--color-light1)" : textColor || "var(--color-dark1)"};
  background-color: ${({ isSelected }) =>
    isSelected ? "var(--color-main)" : "transparent"};
  font-size: ${({ fontSize }) => (fontSize ? `${fontSize}px` : "inherit")};
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;
