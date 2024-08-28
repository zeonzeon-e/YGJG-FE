import React, { useState, useEffect } from "react";
import styled from "styled-components";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  options?: FilterOption[];
  additionalOptions?: FilterOption[];
  onFilterChange: (value: string) => void;
  defaultValue?: string;
}

const defaultOptions: FilterOption[] = [
  { label: "전체", value: "전체" },
  { label: "공격수", value: "공격수" },
  { label: "수비수", value: "수비수" },
  { label: "미드필더", value: "미드필더" },
  { label: "골키퍼", value: "골키퍼" },
];

const FilterBar: React.FC<FilterBarProps> = ({
  options = defaultOptions,
  additionalOptions = [],
  onFilterChange,
  defaultValue = "전체",
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>(defaultValue);
  const [highlightStyle, setHighlightStyle] = useState<{
    left: string;
    width: string;
  }>({ left: "0", width: "0" });

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

    onFilterChange(selectedFilter);
  }, [selectedFilter, onFilterChange]);

  const allOptions = [...options, ...additionalOptions];

  const handleFilterClick = (value: string) => {
    setSelectedFilter(value);
  };

  return (
    <FilterBarContainer>
      <RoleButtons>
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

const FilterBarContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 5px 0;
`;

const RoleButtons = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  //   max-width: 600px;
  border-radius: 25px;
  overflow: hidden;
  background-color: #e0e0e0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Button = styled.button`
  flex: 1;
  padding: 8px 0;
  border: none;
  background: none;
  cursor: pointer;
  outline: none;
  font-size: 16px;
  color: #555;
  transition: color 0.3s;
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

const Highlight = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: #0e6244;
  transition: left 0.3s, width 0.3s;
  border-radius: 25px;
  z-index: 0;
`;
