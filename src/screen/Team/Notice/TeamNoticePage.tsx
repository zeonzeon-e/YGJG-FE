import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header2 from "../../../components/Header/Header2/Header2";
import apiClient from "../../../api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import MainButton from "../../../components/Button/MainButton";
import { FaPen, FaSearch, FaMapPin } from "react-icons/fa";
import { MdViewList, MdGridView } from "react-icons/md";

// 공지사항 데이터 타입 정의
interface Notice {
  id: number;
  title: string;
  content: string;
  createAt: string;
  isUrgent: boolean;
}

// 임시 데이터 (Mock Data)
const MOCK_NOTICES: Notice[] = [
  {
    id: 1,
    title: "필독! 팀 회비 납부 공지",
    content:
      "안녕하세요. 팀원 여러분, 2024년 2분기 팀 회비 납부 기간입니다. 늦지 않게 납부 부탁드립니다.",
    createAt: "2024-05-20T10:00:00Z",
    isUrgent: true,
  },
  {
    id: 2,
    title: "새 유니폼 디자인 투표",
    content:
      "다가오는 새 시즌을 맞아 새로운 유니폼 디자인을 선정하고자 합니다. 투표에 참여해주세요!",
    createAt: "2024-05-18T15:30:00Z",
    isUrgent: false,
  },
  {
    id: 3,
    title: "팀 연습 경기 일정 공지",
    content:
      "이번 주 토요일 오후 3시, 00풋살장에서 연습 경기가 있습니다. 많은 참여 부탁드립니다.",
    createAt: "2024-05-15T09:00:00Z",
    isUrgent: false,
  },
];

const TeamNoticePage: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();

  const [noticeList, setNoticeList] = useState<Notice[]>([]);
  const [filteredNotices, setFilteredNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGridView, setIsGridView] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchNoticeList = async () => {
      if (!teamId) {
        setError("팀 ID를 찾을 수 없습니다. 올바른 경로로 접근해주세요.");
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        // 실제 API 호출
        // const response = await apiClient.get(`/api/announcement/member/get-all`, {
        //   params: { teamId },
        // });
        // const fetchedData: Notice[] = response.data;

        // 실제 API 호출 대신 임시 데이터 사용 (개발 단계)
        const fetchedData: Notice[] = MOCK_NOTICES;

        setNoticeList(fetchedData);
        setFilteredNotices(fetchedData);
        setError(null);
      } catch (err) {
        console.error("데이터를 가져오는 중 에러가 발생했습니다.", err);
        setError("데이터를 불러오는 데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchNoticeList();
  }, [teamId]);

  const handleSearch = () => {
    const filtered = noticeList.filter((notice) =>
      notice.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredNotices(filtered);
  };

  const handleListView = () => {
    setIsGridView(false);
  };

  const handleGridView = () => {
    setIsGridView(true);
  };

  const handleCreateNotice = () => {
    navigate(`/team/${teamId}/notice/create`);
  };

  return (
    <>
      <Header2 text="공지사항" />
      <Container>
        <TopControls>
          <SearchInputWrapper>
            <SearchInput
              type="text"
              placeholder="공지사항 제목으로 검색"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <SearchButton onClick={handleSearch}>
              <FaSearch size={16} />
            </SearchButton>
          </SearchInputWrapper>
          <ViewButtons>
            <ListButton onClick={handleListView} isActive={!isGridView}>
              <MdViewList
                size={24}
                color={!isGridView ? "white" : "var(--color-main)"}
              />
            </ListButton>
            <GridButton onClick={handleGridView} isActive={isGridView}>
              <MdGridView
                size={24}
                color={isGridView ? "white" : "var(--color-main)"}
              />
            </GridButton>
          </ViewButtons>
        </TopControls>

        {isLoading ? (
          <InfoMessage>공지사항을 불러오는 중입니다...</InfoMessage>
        ) : error ? (
          <ErrorMessage>{error}</ErrorMessage>
        ) : filteredNotices.length > 0 ? (
          isGridView ? (
            <NoticeGrid>
              {filteredNotices.map((notice) => (
                <GridItem
                  key={notice.id}
                  className="shadow-df"
                  onClick={() =>
                    navigate(`/team/${teamId}/notice/${notice.id}`)
                  }
                >
                  {/* isUrgent props을 GridTitle에 전달 */}
                  <NoticeTitle isUrgent={notice.isUrgent}>
                    {notice.isUrgent && (
                      <FaMapPin
                        color="var(--color-error)"
                        style={{ marginRight: "8px" }}
                      />
                    )}
                    {notice.title}
                  </NoticeTitle>
                  <GridContent>
                    {notice.content.length > 80
                      ? `${notice.content.substring(0, 80)}...`
                      : notice.content}
                  </GridContent>
                  <GridDate>
                    {new Date(notice.createAt).toLocaleDateString("ko-KR")}
                  </GridDate>
                </GridItem>
              ))}
            </NoticeGrid>
          ) : (
            <NoticeList>
              {filteredNotices.map((notice) => (
                <NoticeItem
                  className="shadow-df border-df"
                  key={notice.id}
                  isUrgent={notice.isUrgent}
                  onClick={() =>
                    navigate(`/team/${teamId}/notice/${notice.id}`)
                  }
                >
                  <NoticeTitle isUrgent={notice.isUrgent}>
                    {notice.isUrgent && <UrgentPinIcon />}
                    {notice.title}
                  </NoticeTitle>
                  <NoticeDate>
                    {new Date(notice.createAt).toLocaleDateString("ko-KR")}
                  </NoticeDate>
                </NoticeItem>
              ))}
            </NoticeList>
          )
        ) : (
          <EmptyStateContainer>
            <p>
              아직 첫 게시글이 없네요. <br />첫 게시글을 작성해 보세요!
            </p>
            <MainButton onClick={handleCreateNotice}>
              첫 게시글 작성하기
            </MainButton>
          </EmptyStateContainer>
        )}
      </Container>
      <FloatingButton className="shadow-df" onClick={handleCreateNotice}>
        <FaPen size={24} />
      </FloatingButton>
    </>
  );
};

export default TeamNoticePage;

// --- Styled Components ---

const Container = styled.div`
  padding: 20px;
`;

const TopControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 10px;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex-grow: 1;
  min-width: 0;
`;

const SearchInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0 45px 0 15px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  box-sizing: border-box;
`;

const SearchButton = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  width: 40px;
  height: 40px;
  background-color: var(--color-main);
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: var(--color-main-darker);
  }
`;

const ViewButtons = styled.div`
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
`;

const ViewButton = styled.button<{ isActive: boolean }>`
  background-color: ${(props) =>
    props.isActive ? "var(--color-main)" : "white"};
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease;
`;

const ListButton = styled(ViewButton)`
  border-right: 1px solid var(--color-border);
`;

const GridButton = styled(ViewButton)``;

const InfoMessage = styled.p`
  text-align: center;
  margin-top: 20px;
  color: var(--color-dark1);
`;

const ErrorMessage = styled(InfoMessage)`
  color: var(--color-error);
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--color-main);
  color: white;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: var(--color-main-darker);
  }
`;

// 리스트 뷰 스타일
const NoticeList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NoticeItem = styled.li<{ isUrgent: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 10px;
  border: ${(props) =>
    props.isUrgent
      ? "1px solid var(--color-main)"
      : "1px solid var(--color-border)"};
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
`;

const NoticeTitle = styled.div<{ isUrgent: boolean }>`
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.isUrgent ? "var(--color-main)" : "black")};
  display: flex;
  align-items: center;
`;

const NoticeDate = styled.div`
  font-size: 14px;
  color: #888;
`;

const UrgentPinIcon = styled(FaMapPin)`
  margin-right: 8px;
  color: var(--color-error);
  font-size: 18px;
`;

// 데이터 없음 상태 스타일
const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  height: 300px;
  p {
    font-size: 18px;
    color: var(--color-dark1);
    margin-bottom: 20px;
  }
`;

// 그리드 뷰 스타일
const NoticeGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 15px;
  list-style: none;
  padding: 0;
`;

const GridItem = styled.li`
  display: flex;
  flex-direction: column;
  padding: 15px;
  border: 1px solid var(--color-main);
  border-radius: 8px;
  background-color: white;
  box-shadow: 0 2px 4px var(--color-shabow);
  cursor: pointer;
`;

const GridTitle = styled.div<{ isUrgent: boolean }>`
  font-size: 15px;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
  color: ${(props) => (props.isUrgent ? "var(--color-main)" : "black")};
  display: flex;
  align-items: center;
`;

const GridContent = styled.p`
  font-size: 12px;
  color: var(--color-dark1);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
`;

const GridDate = styled.div`
  font-size: 10px;
  color: #888;
  margin-top: auto;
  text-align: right;
`;
