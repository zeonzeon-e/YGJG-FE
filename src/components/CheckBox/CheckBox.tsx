import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa6";
import styled from "styled-components";

/**
 * CheckBoxProps - CheckBox 컴포넌트에 전달되는 props 타입 정의
 * @interface CheckBoxProps
 * @property {string[][]} content - 이중 배열: [제목, 내용]
 * @property {boolean} isToggle - 드롭다운 사용 여부
 * @property {boolean} [isChecked] - 강제 체크 설정 여부 (선택 사항)
 */
interface CheckBoxProps {
  content: string[][]; // 이중 배열: [제목, 내용]
  isToggle: boolean; // 드롭다운 사용 여부
  isChecked?: boolean; // 강제 체크 설정 여부
}

/**
 * CheckBox 컴포넌트 - 제목과 세부 내용을 가진 체크박스 리스트를 렌더링
 * @param {CheckBoxProps} props - 컴포넌트에 전달되는 props
 * @param {string[][]} props.content - 제목과 세부 내용을 포함한 이중 배열
 * @param {boolean} props.isToggle - 드롭다운 상세보기 여부
 * @param {boolean} [props.isChecked] - 강제 체크 설정 여부 (선택 사항)
 * @returns {JSX.Element} CheckBox 컴포넌트
 */
const CheckBox: React.FC<CheckBoxProps> = ({
  content = [],
  isToggle = false,
  isChecked,
}) => {
  const [allChecked, setAllChecked] = useState<boolean>(false);
  const [checks, setChecks] = useState<boolean[]>(() =>
    Array(content.length).fill(false)
  );
  const [toggles, setToggles] = useState<boolean[]>(() =>
    Array(content.length).fill(false)
  );

  // content가 변경될 때 체크 상태 초기화
  useEffect(() => {
    setAllChecked(false);
    setChecks(Array(content.length).fill(false));
  }, [content]);

  // 전체 선택 클릭 핸들러
  const handleAllClick = () => {
    const newCheckedState = !allChecked;
    setAllChecked(newCheckedState);
    setChecks(Array(content.length).fill(newCheckedState));
  };

  // 개별 체크박스 클릭 핸들러
  const handleCheckboxClick = (index: number) => {
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);
    setAllChecked(newChecks.every((checked) => checked));
  };

  // 토글 버튼 클릭 핸들러
  const handleToggleClick = (index: number) => {
    const newToggles = [...toggles];
    newToggles[index] = !newToggles[index];
    setToggles(newToggles);
  };

  return (
    <div>
      {/* 전체 선택 체크박스 */}
      <SelectAllWrapper onClick={handleAllClick}>
        <IconWrapper className={allChecked ? "icon" : ""}>
          <FaCheck className="CheckBox-icon" />
        </IconWrapper>
        전체선택
      </SelectAllWrapper>

      {/* 개별 체크박스 목록 */}
      {content.map(([title, detail], index) => (
        <CheckBoxItem key={index}>
          <CheckBoxContent>
            <CheckBoxLabel onClick={() => handleCheckboxClick(index)}>
              <IconWrapper className={checks[index] ? "icon" : ""}>
                <FaCheck className="CheckBox-icon" />
              </IconWrapper>
              {title}
            </CheckBoxLabel>
            {isToggle && (
              <ToggleButton onClick={() => handleToggleClick(index)}>
                {toggles[index] ? (
                  <FaAngleDown size={20} />
                ) : (
                  <FaAngleUp size={20} />
                )}
              </ToggleButton>
            )}
          </CheckBoxContent>
          {isToggle && toggles[index] && (
            <CheckBoxDetail>{detail}</CheckBoxDetail>
          )}
        </CheckBoxItem>
      ))}
    </div>
  );
};

export default CheckBox;

/* Styled-components */

/* 아이콘 스타일 */
const IconWrapper = styled.div`
  background-color: var(--color-light2);
  color: var(--color-light2);
  margin-right: 5px;
  border-radius: 3px;
  padding: 0.5px;
  border: 1px solid var(--color-dark1);

  &.icon {
    border: 1px solid var(--color-dark1);
    background-color: var(--color-subtle);
    color: var(--color-dark2);
  }
`;

/* 전체 선택 스타일 */
const SelectAllWrapper = styled.div`
  display: flex;
  padding: 5px;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
`;

/* 체크박스 항목 스타일 */
const CheckBoxItem = styled.div`
  width: 100%;
  padding: 5px;
  display: flex;
  flex-direction: column;
`;

/* 체크박스 콘텐츠 스타일 */
const CheckBoxContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

/* 체크박스 라벨 스타일 */
const CheckBoxLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

/* 체크박스 세부 내용 스타일 */
const CheckBoxDetail = styled.div`
  background-color: var(--color-light2);
  padding: 10px;
  border-radius: 5px;
  margin-top: 5px;
`;

/* 토글 버튼 스타일 */
const ToggleButton = styled.div`
  cursor: pointer;
`;
