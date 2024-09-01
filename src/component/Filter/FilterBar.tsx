import React, { useState, useEffect } from "react";
import styled from "styled-components";

/**
 * FilterOption 인터페이스 - 필터 옵션의 구조를 정의
 * @interface FilterOption
 * @property {string} label - 필터 옵션의 표시 이름
 * @property {string} value - 필터 옵션의 값
 */
interface FilterOption {
  label: string;
  value: string;
}

/**
 * FilterBarProps 인터페이스 - FilterBar 컴포넌트에 전달되는 props 정의
 * @interface FilterBarProps
 * @property {FilterOption[]} [options] - 필터 옵션 배열 (선택적)
 * @property {FilterOption[]} [additionalOptions] - 추가 필터 옵션 배열 (선택적)
 * @property {(value: string) => void} onFilterChange - 필터 선택 변경 시 호출되는 함수
 * @property {string} [defaultValue] - 기본 선택된 필터 값 (선택적)
 */
interface FilterBarProps {
  options?: FilterOption[];
  additionalOptions?: FilterOption[];
  onFilterChange: (value: string) => void;
  defaultValue?: string;
}

// 기본 필터 옵션을 정의
const defaultOptions: FilterOption[] = [
  { label: "전체", value: "전체" },
  { label: "공격수", value: "공격수" },
  { label: "수비수", value: "수비수" },
  { label: "미드필더", value: "미드필더" },
  { label: "골키퍼", value: "골키퍼" },
];

/**
 * FilterBar 컴포넌트 - 다양한 필터 옵션을 제공하여 선택할 수 있게 하는 필터 바
 * @param {FilterBarProps} props - FilterBar 컴포넌트에 전달되는 props
 * @param {FilterOption[]} [props.options] - 필터 옵션 배열 (기본값: defaultOptions)
 * @param {FilterOption[]} [props.additionalOptions] - 추가 필터 옵션 배열 (선택적)
 * @param {function} props.onFilterChange - 필터 선택이 변경될 때 호출되는 콜백 함수
 * @param {string} [props.defaultValue="전체"] - 기본 선택된 필터 값 (선택적, 기본값: "전체")
 * @returns {JSX.Element} FilterBar 컴포넌트
 */
const FilterBar: React.FC<FilterBarProps> = ({
  options = defaultOptions,
  additionalOptions = [],
  onFilterChange,
  defaultValue = "전체",
}) => {
  // 선택된 필터 상태 관리
  const [selectedFilter, setSelectedFilter] = useState<string>(defaultValue);

  // 하이라이트 스타일 상태 관리
  const [highlightStyle, setHighlightStyle] = useState<{
    left: string;
    width: string;
  }>({ left: "0", width: "0" });

  // 필터 선택이 변경될 때마다 하이라이트 위치와 크기를 업데이트
  useEffect(() => {
    const selectedElement = document.querySelector(
      `.btn-${selectedFilter}`
    ) as HTMLElement;

    if (selectedElement) {
      setHighlightStyle({
        left: `${selectedElement.offsetLeft}px`,
        width: `${selectedElement.offsetWidth}px`,
      });
    }

    // 필터가 변경될 때 onFilterChange 콜백을 호출
    onFilterChange(selectedFilter);
  }, [selectedFilter, onFilterChange]);

  // 기본 옵션과 추가 옵션을 병합
  const allOptions = [...options, ...additionalOptions];

  // 필터 버튼 클릭 시 선택된 필터를 업데이트
  const handleFilterClick = (value: string) => {
    setSelectedFilter(value);
  };

  return (
    <FilterBarContainer>
      <RoleButtons>
        {/* 선택된 필터 하이라이트 */}
        <Highlight style={highlightStyle} />
        {allOptions.map((option) => (
          <Button
            key={option.value}
            className={`btn btn-${option.value} ${
              selectedFilter === option.value ? "selected" : ""
            }`}
            onClick={() => handleFilterClick(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </RoleButtons>
    </FilterBarContainer>
  );
};

export default FilterBar;

// 스타일 컴포넌트 정의

/**
 * FilterBarContainer 스타일 컴포넌트 - 필터 바 전체를 감싸는 컨테이너
 */
const FilterBarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 5px 0;
`;

/**
 * RoleButtons 스타일 컴포넌트 - 필터 버튼들을 감싸는 컨테이너
 */
const RoleButtons = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  border-radius: 25px;
  overflow: hidden;
  background-color: #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

/**
 * Button 스타일 컴포넌트 - 각 필터 버튼의 스타일링
 */
const Button = styled.button`
  flex: 1;
  padding: 8px 0;
  border: none;
  background: none;
  cursor: pointer;
  outline: none;
  font-size: 14px;
  color: #555;
  transition: color 0.2s;
  z-index: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &:hover {
    color: #000;
  }

  &.selected {
    color: #fff;
  }
`;

/**
 * Highlight 스타일 컴포넌트 - 선택된 필터의 하이라이트 스타일링
 */
const Highlight = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: #0e6244;
  transition: left 0.2s, width 0.2s;
  border-radius: 25px;
  z-index: 0;
`;
