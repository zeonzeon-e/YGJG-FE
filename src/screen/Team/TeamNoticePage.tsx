import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header2 from "../../components/Header/Header2/Header2";
import apiClient from "../../api/apiClient";
import { useLocation, useNavigate } from "react-router-dom";
import Searchbar from "../../components/Searchbar/Searchbar";
import MiniButton from "../../components/Button/MiniButton";

const TeamNoticePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { teamId } = location.state || {
    teamId: 1,
  };

  const [noticeList, setNoticeList] = useState([
    { id: 1, title: "필독 공지사항", createAt: new Date() },
    { id: 2, title: "포지션 안내", createAt: new Date() },
    { id: 3, title: "2024년 하반기 회비 안내", createAt: new Date() },
  ]);
  const [filteredNotices, setFilteredNotices] = useState(noticeList);

  useEffect(() => {
    const fetchNoticeList = async () => {
      try {
        const response = await apiClient.get(`/api/announcement/member/get-all`, {
          params: { teamId },
        });
        setNoticeList(response.data);
        setFilteredNotices(response.data);
      } catch (err) {
        console.error("데이터를 가져오는 중 에러가 발생했습니다.", err);
      }
    };

    fetchNoticeList();
  }, [teamId]);

  const handleSearch = (query: string) => {
    const filtered = noticeList.filter((notice) =>
      notice.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredNotices(filtered);
  };

  return (
    <>
      <Header2 text="공지사항" />
      <Container>
        <Searchbar onSearch={handleSearch} />
        <Wrapper>
          <MiniButton onClick={() => navigate("create")}>공지 작성하기</MiniButton>
        </Wrapper>
        {filteredNotices.length > 0 ? (
          <NoticeList>
            {filteredNotices.map((notice) => (
              <NoticeItem
                className="shadow-df border-df"
                key={notice.id}
                onClick={() => navigate(`${notice.id}`,{state: {
                  id: notice.id
                }})}
              >
                <NoticeTitle>{notice.title}</NoticeTitle>
                <NoticeDate>
                  {new Date(notice.createAt).toLocaleDateString("ko-KR")}
                </NoticeDate>
              </NoticeItem>
            ))}
          </NoticeList>
        ) : (
          <NoticeItem className="shadow-df border-df">
            <NoticeTitle>결과가 없습니다.</NoticeTitle>
          </NoticeItem>
        )}
      </Container>
    </>
  );
};

export default TeamNoticePage;

// Styled Components
const Container = styled.div`
  padding: 20px;
`;

const NoticeList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NoticeItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
`;

const NoticeTitle = styled.div`
  font-size: 16px;
  font-weight: bold;
`;

const NoticeDate = styled.div`
  font-size: 14px;
  color: #888;
`;

const Wrapper = styled.div`
  margin-bottom: 20px;
  text-align: right;
`;
