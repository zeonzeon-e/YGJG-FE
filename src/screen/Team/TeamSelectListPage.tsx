import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FaFilter, FaSearch } from "react-icons/fa";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

import apiClient from "../../api/apiClient";
import { getAccessToken, removeTokens } from "../../utils/authUtils";
import CheckButton from "../../components/Button/CheckButton";
import MainButton from "../../components/Button/MainButton";
import Modal1 from "../../components/Modal/Modal1";

interface Team {
  name: string;
  ageGroup: string;
  activityDays: string[];
  matchLocation: string;
  gender: string;
  activityTime: string[];
  skillLevel: string;
  teamImageUrl: string;
}

const TeamSelectListPage: React.FC = () => {
  const navigate = useNavigate();

  // 모달: 로그인 필요 안내
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  // 필터 열림/닫힘
  const [filterOpen, setFilterOpen] = useState(false);

  // 서버에서 받아온 전체(혹은 필터 적용 후) 팀 목록
  const [teams, setTeams] = useState<Team[]>([]);
  // 화면에 표시할 팀 목록(추가 검색 적용)
  const [displayedTeams, setDisplayedTeams] = useState<Team[]>([]);

  // 텍스트 검색 키워드
  const [searchKeyword, setSearchKeyword] = useState("");

  // 필터 관련
  const [selectedRegion, setSelectedRegion] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [selectedGender, setSelectedGender] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [selectedAge, setSelectedAge] = useState<boolean[]>(
    Array(6).fill(false)
  ); // 10대~60대
  const [selectedDays, setSelectedDays] = useState<boolean[]>(
    Array(7).fill(false)
  ); // 월~일
  const [selectedLevel, setSelectedLevel] = useState<boolean[]>(
    Array(5).fill(false)
  ); // 하, 중하, 중, 중상, 상

  // 페이지 진입 시(필터 없이) 팀 목록 요청
  useEffect(() => {
    fetchTeamsWithoutFilter();
  }, []);

  // 서버에서 팀 목록(필터 없이) 가져오기
  const fetchTeamsWithoutFilter = async () => {
    try {
      const response = await apiClient.get("/api/search/join-team");
      setTeams(response.data);
      setDisplayedTeams(response.data); // 기본값으로 전체 팀 표시
    } catch (error) {
      console.error("팀 목록 가져오기 오류:", error);
      setLoginModalOpen(true);
    }
  };

  /**
   * "적용하기" 버튼 클릭 시, 서버로 필터값을 전달하여 필터링된 팀 목록 요청
   */
  const handleApplyFilter = async () => {
    if (!getAccessToken()) {
      // 토큰이 없으면 로그인 모달
      setLoginModalOpen(true);
      return;
    }

    try {
      const regionValues = selectedRegion
        .map((selected, idx) =>
          selected ? ["내 위치 중심", "내 활동 지역 중심", "찾기"][idx] : null
        )
        .filter(Boolean) as string[];

      const genderValues = selectedGender
        .map((selected, idx) =>
          selected ? ["여성", "남성", "혼성"][idx] : null
        )
        .filter(Boolean) as string[];

      const ageValues = selectedAge
        .map((selected, idx) =>
          selected
            ? ["10대", "20대", "30대", "40대", "50대", "60대"][idx]
            : null
        )
        .filter(Boolean) as string[];

      const daysValues = selectedDays
        .map((selected, idx) =>
          selected ? ["월", "화", "수", "목", "금", "토", "일"][idx] : null
        )
        .filter(Boolean) as string[];

      const levelValues = selectedLevel
        .map((selected, idx) =>
          selected ? ["하", "중하", "중", "중상", "상"][idx] : null
        )
        .filter(Boolean) as string[];

      // 서버에 GET 요청 (백엔드 스펙 맞춰 params 사용)
      const response = await apiClient.get("/api/search/join-team", {
        params: {
          teamRegion: regionValues,
          teamGender: genderValues,
          ageRange: ageValues,
          activityDays: daysValues,
          teamLevel: levelValues,
          // 필요한 경우 activityTime 등 추가
        },
      });

      // 서버에서 필터링된 팀 목록을 받아온 후
      setTeams(response.data);
      setDisplayedTeams(response.data); // 검색어 초기화 + 표시 목록도 업데이트
      setSearchKeyword("");
      setFilterOpen(false);
    } catch (error) {
      console.error("필터 적용 중 오류:", error);
      setLoginModalOpen(true);
    }
  };

  /**
   * 로컬(프론트) 검색
   * - `searchKeyword`로 `teams` 중에서 이름, 연령대, 지역 등 특정 텍스트가 포함된 팀만 표시
   */
  const handleSearch = () => {
    const keyword = searchKeyword.trim().toLowerCase();

    // 아무 키워드 없으면 전체 표시
    if (!keyword) {
      setDisplayedTeams(teams);
      return;
    }

    // 팀 목록에서 keyword가 포함된 것만 필터
    const filtered = teams.filter((team) => {
      // 예: 팀명, 지역, 요일 등에 keyword가 포함되는지 확인
      if (team.name.toLowerCase().includes(keyword)) return true;
      if (
        team.matchLocation &&
        team.matchLocation.toLowerCase().includes(keyword)
      )
        return true;
      if (team.activityDays.some((day) => day.toLowerCase().includes(keyword)))
        return true;
      if (team.ageGroup && team.ageGroup.toLowerCase().includes(keyword))
        return true;
      // 필요 시 추가 조건

      return false;
    });

    setDisplayedTeams(filtered);
  };

  /**
   * 초대코드로 팀 가입하기
   */
  const handleJoinByInviteCode = () => {
    if (!getAccessToken()) {
      setLoginModalOpen(true);
    } else {
      navigate("/invite");
    }
  };

  return (
    <Container>
      {/* 상단 헤더 */}
      <Header>
        <Title>가입할 팀 찾기</Title>
        <AddTeamButton onClick={() => navigate("/team/intro")}>
          팀 생성하기 <BsFillPlusCircleFill />
        </AddTeamButton>
      </Header>

      {/* 초대코드로 가입하기 버튼 */}
      <InviteButton onClick={handleJoinByInviteCode}>
        초대코드로 팀 가입하기
      </InviteButton>

      {/* 텍스트 검색 섹션 */}
      <SearchContainer>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <SearchInput
          type="text"
          placeholder="팀 이름, 지역, 요일 등 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <SearchButton onClick={handleSearch}>검색</SearchButton>
      </SearchContainer>

      {/* 필터 버튼 */}
      <FilterButton onClick={() => setFilterOpen(true)}>
        <FaFilter /> 필터
      </FilterButton>

      {/* (로컬 검색 결과) 팀 카드 목록 */}
      {displayedTeams.map((team, index) => (
        <TeamCard key={index}>
          <img
            src={team.teamImageUrl}
            alt="team logo"
            style={{ width: "50px", borderRadius: "50%" }}
          />
          <TeamInfo>
            <p style={{ fontWeight: "bold" }}>{team.name}</p>
            <p>{team.ageGroup}</p>
            <p>{team.activityDays.join(", ")}</p>
            <p>{team.matchLocation}</p>
          </TeamInfo>
        </TeamCard>
      ))}

      {/* 로그인 모달 */}
      {isLoginModalOpen && (
        <Modal1
          isOpen={isLoginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          title="로그인이 필요해요!"
          confirmText="로그인 하러가기"
          onConfirm={() => {
            removeTokens();
            navigate("/login");
          }}
        >
          <p>
            로그인하면 요기조기의 기능을
            <br />
            모두 이용할 수 있어요.
          </p>
        </Modal1>
      )}

      {/* 필터 오버레이 */}
      {filterOpen && (
        <FilterOverlay>
          <FilterContainer>
            <Section>
              <h3>지역</h3>
              <CheckButton
                items={["내 위치 중심", "내 활동 지역 중심", "찾기"]}
                selectedStates={selectedRegion}
                onItemClick={(idx) =>
                  setSelectedRegion((prev) =>
                    prev.map((selected, i) =>
                      i === idx ? !selected : selected
                    )
                  )
                }
              />
            </Section>
            <Section>
              <h3>성별</h3>
              <CheckButton
                items={["여성", "남성", "혼성"]}
                selectedStates={selectedGender}
                onItemClick={(idx) =>
                  setSelectedGender((prev) =>
                    prev.map((selected, i) =>
                      i === idx ? !selected : selected
                    )
                  )
                }
              />
            </Section>
            <Section>
              <h3>연령별</h3>
              <CheckButton
                items={["10대", "20대", "30대", "40대", "50대", "60대"]}
                selectedStates={selectedAge}
                onItemClick={(idx) =>
                  setSelectedAge((prev) =>
                    prev.map((selected, i) =>
                      i === idx ? !selected : selected
                    )
                  )
                }
              />
            </Section>
            <Section>
              <h3>요일</h3>
              <CheckButton
                items={["월", "화", "수", "목", "금", "토", "일"]}
                selectedStates={selectedDays}
                onItemClick={(idx) =>
                  setSelectedDays((prev) =>
                    prev.map((selected, i) =>
                      i === idx ? !selected : selected
                    )
                  )
                }
              />
            </Section>
            <Section>
              <h3>실력</h3>
              <CheckButton
                items={["하", "중하", "중", "중상", "상"]}
                selectedStates={selectedLevel}
                onItemClick={(idx) =>
                  setSelectedLevel((prev) =>
                    prev.map((selected, i) =>
                      i === idx ? !selected : selected
                    )
                  )
                }
              />
            </Section>

            {/* 필터 적용 */}
            <MainButton onClick={handleApplyFilter} height={50}>
              적용하기
            </MainButton>
          </FilterContainer>
        </FilterOverlay>
      )}
    </Container>
  );
};

export default TeamSelectListPage;

/* styled-components */

const Container = styled.div`
  padding: 30px 20px 20px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: bold;
`;

const AddTeamButton = styled.button`
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  font-size: 15px;
  cursor: pointer;
`;

const InviteButton = styled.div`
  width: 100%;
  padding: 10px 0;
  border-radius: 12px;
  margin-top: 10px;
  font-size: 16px;
  text-align: center;
  margin-bottom: 5px;
  border: 2px solid var(--color-sub);
  cursor: pointer;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  border: 1px solid #ddd;
  border-radius: 25px;
  padding: 8px 12px;
  background-color: var(--color-light2);
`;

const SearchIcon = styled.div`
  color: #666;
  margin-right: 8px;
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  font-size: 16px;
  background-color: transparent;
  color: #333;

  ::placeholder {
    color: #bbb;
  }
`;

const SearchButton = styled.button`
  background-color: var(--color-main);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 6px 12px;
  cursor: pointer;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  margin-top: 10px;
  gap: 5px;
  background: none;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
`;

const TeamCard = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  margin-top: 10px;
`;

const TeamInfo = styled.div`
  margin-left: 10px;
`;

const FilterOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const FilterContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 80%;
  max-height: 80vh;
  overflow-y: auto;
`;

const Section = styled.div`
  margin-bottom: 20px;
  font-size: 14px;
`;
