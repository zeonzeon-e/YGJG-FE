import { FaMagnifyingGlass } from "react-icons/fa6";
import { RiSendPlane2Fill } from "react-icons/ri";
import React, { useState } from "react";
import "./Searchbar.css";

interface SearchbarProps {
  SearchText?: string; //검색어
}

/**
 * ScrollProgress 컴포넌트 - 진행과정 렌더링
 * @param {SearchbarProps} props - 컴포넌트에 전달되는 props
 * @param {React.ReactNode} [props.SearchText] - 사용자가 입력한 검색어
 * @returns {JSX.Element} ScrollProgress 컴포넌트
 */
const Searchbar: React.FC<SearchbarProps> = ({ SearchText = "" }) => {
  const [search, setSearch] = useState<string>(SearchText);
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(e.target.value);
  };
  const searchClick = (e: React.MouseEvent<HTMLInputElement>): void => {
    console.log(search);
  };
  return (
    <div className="Searchbar flex-jc-sb">
      <FaMagnifyingGlass size={"1.5em"} className="pd" />
      <input
        type="text"
        className="Searchbar_text"
        value={search}
        onChange={handleSearchChange}
      />
      <div onClick={searchClick} className="pd">
        <RiSendPlane2Fill size={"1.5em"} />
      </div>
    </div>
  );
};

export default Searchbar;
