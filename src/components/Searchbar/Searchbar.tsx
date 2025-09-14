import { FaMagnifyingGlass, FaXmark } from "react-icons/fa6";
import { FaTimes } from "react-icons/fa";
import { RiSendPlane2Fill } from "react-icons/ri";
import React, { useState } from "react";
import "./Searchbar.css";

interface SearchbarProps {
  SearchText?: string; // 초기 검색어
  onSearch: (searchQuery: string) => void; // 검색어를 부모로 전달하는 콜백 함수
}

/**
 * Searchbar 컴포넌트
 * @param {SearchbarProps} props - 컴포넌트에 전달되는 props
 * @param {string} [props.SearchText] - 초기 검색어
 * @param {(searchQuery: string) => void} props.onSearch - 검색어를 처리하는 콜백 함수
 * @returns {JSX.Element} Searchbar 컴포넌트
 */
const Searchbar: React.FC<SearchbarProps> = ({ SearchText = "", onSearch }) => {
  const [search, setSearch] = useState<string>(SearchText);

  // 입력 값 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };

  // 검색 버튼 클릭 핸들러
  const handleSearchClick = (): void => {
    onSearch(search); // 부모 컴포넌트로 검색어 전달
  };

  // 검색어 초기화 핸들러
  const handleClearClick = (): void => {
    setSearch(""); // 검색어 초기화
    onSearch(""); // 부모 컴포넌트에 빈 검색어 전달
  };

  return (
    <div className="Searchbar flex-jc-sb">
      <FaMagnifyingGlass size="20px" className="pd" />
      <input
        type="text"
        className="Searchbar_text"
        value={search}
        onChange={handleSearchChange}
        placeholder="검색어를 입력하세요"
      />
      {search && ( // 검색어가 있을 때만 X 버튼 표시
        <div onClick={handleClearClick} className="pd">
          <FaXmark color="var(--color-dark1)" size="20px" />
        </div>
      )}
      <div onClick={handleSearchClick} className="pd">
        <RiSendPlane2Fill size="20px" />
      </div>
    </div>
  );
};

export default Searchbar;
