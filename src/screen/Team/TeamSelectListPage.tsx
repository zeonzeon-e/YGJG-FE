import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import {
  FaFilter,
  FaSearch,
  FaMapMarkerAlt,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";
import { BsFillPlusCircleFill } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

import apiClient from "../../api/apiClient";
import { getAccessToken, removeTokens } from "../../utils/authUtils";
import CheckButton from "../../components/Button/CheckButton";
import MainButton from "../../components/Button/MainButton";
import Modal1 from "../../components/Modal/Modal1";

interface Team {
  teamId?: number;
  teamName: string;
  ageGroup?: string;
  activityDays?: string[];
  matchLocation: string;
  teamGender: string;
  activityTime?: string[];
  skillLevel?: string;
  teamImageUrl: string;
  memberCount?: number;
}

const TeamSelectListPage: React.FC = () => {
  const navigate = useNavigate();

  // 모달: 로그인 필요 안내
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  // 필터 열림/닫힘
  const [filterOpen, setFilterOpen] = useState(false);

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 서버에서 받아온 전체(혹은 필터 적용 후) 팀 목록
  const [teams, setTeams] = useState<Team[]>([]);
  // 화면에 표시할 팀 목록(추가 검색 적용)
  const [displayedTeams, setDisplayedTeams] = useState<Team[]>([]);

  // 텍스트 검색 키워드
  const [searchKeyword, setSearchKeyword] = useState("");

  // 빠른 필터 칩 상태
  const [quickFilters, setQuickFilters] = useState({
    gender: "",
    level: "",
  });

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
    setIsLoading(true);
    try {
      const response = await apiClient.get("/api/search/join-team");
      setTeams(response.data);
      setDisplayedTeams(response.data);
    } catch (error) {
      console.error("팀 목록 가져오기 오류:", error);
      setLoginModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * "적용하기" 버튼 클릭 시, 서버로 필터값을 전달하여 필터링된 팀 목록 요청
   */
  const handleApplyFilter = async () => {
    if (!getAccessToken()) {
      setLoginModalOpen(true);
      return;
    }

    setIsLoading(true);
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

      const response = await apiClient.get("/api/search/join-team", {
        params: {
          teamRegion: regionValues,
          teamGender: genderValues,
          ageRange: ageValues,
          activityDays: daysValues,
          teamLevel: levelValues,
        },
      });

      setTeams(response.data);
      setDisplayedTeams(response.data);
      setSearchKeyword("");
      setFilterOpen(false);
    } catch (error) {
      console.error("필터 적용 중 오류:", error);
      setLoginModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로컬(프론트) 검색
   */
  const handleSearch = () => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) {
      setDisplayedTeams(teams);
      return;
    }

    const filtered = teams.filter((team) => {
      if (team.teamName.toLowerCase().includes(keyword)) return true;
      if (
        team.matchLocation &&
        team.matchLocation.toLowerCase().includes(keyword)
      )
        return true;
      if (team.activityDays?.some((day) => day.toLowerCase().includes(keyword)))
        return true;
      if (team.ageGroup && team.ageGroup.toLowerCase().includes(keyword))
        return true;
      return false;
    });

    setDisplayedTeams(filtered);
  };

  /**
   * 빠른 필터 적용
   */
  const handleQuickFilter = (type: "gender" | "level", value: string) => {
    const newFilters = { ...quickFilters };
    newFilters[type] = newFilters[type] === value ? "" : value;
    setQuickFilters(newFilters);

    // 로컬 필터 적용
    let filtered = [...teams];
    if (newFilters.gender) {
      filtered = filtered.filter((t) => t.teamGender === newFilters.gender);
    }
    if (newFilters.level) {
      filtered = filtered.filter((t) => t.skillLevel === newFilters.level);
    }
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

  /**
   * 모달(필터) Overlay 바깥 클릭 시 닫기
   */
  const handleOverlayClick = () => {
    setFilterOpen(false);
  };

  /**
   * 팀 상세 페이지로 이동
   */
  const handleTeamClick = (teamId?: number) => {
    if (teamId) {
      navigate(`/team/list/${teamId}`);
    }
  };

  return (
    <PageWrapper>
      {/* 히어로 섹션 */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>
            <HiSparkles style={{ marginRight: "8px" }} />
            가입할 팀 찾기
          </HeroTitle>
          <HeroSubtitle>당신에게 딱 맞는 팀을 찾아보세요</HeroSubtitle>
          <TeamCountBadge>
            현재 <strong>{teams.length}</strong>개의 팀이 등록되어 있어요
          </TeamCountBadge>
        </HeroContent>
        <CreateTeamButton onClick={() => navigate("/team/intro")}>
          <BsFillPlusCircleFill size={18} />팀 생성하기
        </CreateTeamButton>
      </HeroSection>

      <ContentContainer>
        {/* 초대코드로 가입하기 */}
        <InviteCodeCard onClick={handleJoinByInviteCode}>
          <InviteCodeIcon>🎟️</InviteCodeIcon>
          <InviteCodeText>
            <InviteCodeTitle>초대코드가 있다면?</InviteCodeTitle>
            <InviteCodeDesc>초대코드로 바로 팀에 가입하기</InviteCodeDesc>
          </InviteCodeText>
          <InviteArrow>→</InviteArrow>
        </InviteCodeCard>

        {/* 검색 섹션 */}
        <SearchSection>
          <SearchInputWrapper>
            <SearchIconWrapper>
              <FaSearch />
            </SearchIconWrapper>
            <SearchInput
              type="text"
              placeholder="팀 이름, 지역으로 검색해보세요"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            {searchKeyword && (
              <ClearButton
                onClick={() => {
                  setSearchKeyword("");
                  setDisplayedTeams(teams);
                }}
              >
                ✕
              </ClearButton>
            )}
          </SearchInputWrapper>
          <SearchButton onClick={handleSearch}>검색</SearchButton>
        </SearchSection>

        {/* 빠른 필터 칩 */}
        <QuickFilterSection>
          <FilterChipsWrapper>
            <FilterChip
              isActive={filterOpen}
              onClick={() => setFilterOpen(true)}
            >
              <FaFilter size={12} />
              필터
            </FilterChip>
            <FilterDivider />
            {["남성", "여성", "혼성"].map((gender) => (
              <FilterChip
                key={gender}
                isActive={quickFilters.gender === gender}
                onClick={() => handleQuickFilter("gender", gender)}
              >
                {gender}
              </FilterChip>
            ))}
            <FilterDivider />
            {["초급", "중급", "고급"].map((level) => (
              <FilterChip
                key={level}
                isActive={quickFilters.level === level}
                onClick={() => handleQuickFilter("level", level)}
              >
                {level}
              </FilterChip>
            ))}
          </FilterChipsWrapper>
        </QuickFilterSection>

        {/* 결과 카운트 */}
        <ResultsHeader>
          <ResultsCount>
            {displayedTeams.length > 0
              ? `${displayedTeams.length}개의 팀`
              : "검색 결과가 없습니다"}
          </ResultsCount>
        </ResultsHeader>

        {/* 팀 카드 목록 */}
        <TeamCardList>
          {isLoading ? (
            // 로딩 스켈레톤
            <>
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i}>
                  <SkeletonImage />
                  <SkeletonContent>
                    <SkeletonTitle />
                    <SkeletonText />
                    <SkeletonText short />
                  </SkeletonContent>
                </SkeletonCard>
              ))}
            </>
          ) : displayedTeams.length === 0 ? (
            // 빈 상태
            <EmptyState>
              <EmptyIcon>⚽</EmptyIcon>
              <EmptyTitle>검색 결과가 없어요</EmptyTitle>
              <EmptyDesc>다른 조건으로 검색해 보시겠어요?</EmptyDesc>
            </EmptyState>
          ) : (
            // 팀 카드
            displayedTeams.map((team, index) => (
              <TeamCard
                key={team.teamId || index}
                onClick={() => handleTeamClick(team.teamId)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TeamCardInner>
                  <TeamLogo
                    src={team.teamImageUrl || "/default-team.png"}
                    alt={team.teamName}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (!target.dataset.fallback) {
                        target.dataset.fallback = "true";
                        target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect fill='%23e8e8e8' width='80' height='80' rx='16'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='11' font-family='sans-serif'%3ETEAM%3C/text%3E%3C/svg%3E";
                      }
                    }}
                  />

                  <TeamInfoSection>
                    <TeamName>{team.teamName}</TeamName>
                    <TeamMeta>
                      <MetaItem>
                        <FaMapMarkerAlt size={12} />
                        {team.matchLocation || "위치 미정"}
                      </MetaItem>
                      <MetaItem>
                        <FaUsers size={12} />
                        {team.teamGender}
                        {team.ageGroup && ` · ${team.ageGroup}`}
                      </MetaItem>
                      {team.activityDays && team.activityDays.length > 0 && (
                        <MetaItem>
                          <FaCalendarAlt size={12} />
                          {Array.isArray(team.activityDays)
                            ? team.activityDays.join(", ")
                            : team.activityDays}
                        </MetaItem>
                      )}
                    </TeamMeta>
                  </TeamInfoSection>
                </TeamCardInner>
                <TeamBadges>
                  {team.skillLevel && (
                    <Badge variant="level">{team.skillLevel}</Badge>
                  )}
                  {team.memberCount !== undefined && (
                    <Badge variant="members">{team.memberCount}명</Badge>
                  )}
                </TeamBadges>
                <ViewDetailButton>상세보기 →</ViewDetailButton>
              </TeamCard>
            ))
          )}
        </TeamCardList>
      </ContentContainer>

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
        <FilterOverlay onClick={handleOverlayClick}>
          <FilterPanel onClick={(e) => e.stopPropagation()}>
            <FilterHeader>
              <FilterTitle>상세 필터</FilterTitle>
              <CloseButton onClick={() => setFilterOpen(false)}>×</CloseButton>
            </FilterHeader>

            <FilterContent>
              <FilterSection>
                <SectionTitle>지역</SectionTitle>
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
              </FilterSection>

              <FilterSection>
                <SectionTitle>성별</SectionTitle>
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
              </FilterSection>

              <FilterSection>
                <SectionTitle>연령별</SectionTitle>
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
              </FilterSection>

              <FilterSection>
                <SectionTitle>요일</SectionTitle>
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
              </FilterSection>

              <FilterSection>
                <SectionTitle>실력</SectionTitle>
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
              </FilterSection>
            </FilterContent>

            <FilterFooter>
              <MainButton onClick={handleApplyFilter} height={50}>
                적용하기
              </MainButton>
            </FilterFooter>
          </FilterPanel>
        </FilterOverlay>
      )}
    </PageWrapper>
  );
};

export default TeamSelectListPage;

/* ========== Animations ========== */
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const slideUp = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

/* ========== Styled Components ========== */

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f5f7fa;
  padding-bottom: 100px;
`;

const HeroSection = styled.div`
  background: linear-gradient(
    135deg,
    var(--color-main) 0%,
    var(--color-main-darker) 100%
  );
  padding: 32px 20px 40px;
  border-radius: 0 0 28px 28px;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 50%;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
`;

const HeroTitle = styled.h1`
  color: white;
  font-size: 26px;
  font-family: "Pretendard-Bold";
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const HeroSubtitle = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  margin-bottom: 16px;
`;

const TeamCountBadge = styled.div`
  display: inline-block;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-size: 13px;

  strong {
    color: var(--color-sub);
    font-family: "Pretendard-Bold";
  }
`;

const CreateTeamButton = styled.button`
  position: absolute;
  top: 32px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: white;
  color: var(--color-main);
  border: none;
  border-radius: 12px;
  padding: 10px 16px;
  font-size: 13px;
  font-family: "Pretendard-SemiBold";
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ContentContainer = styled.div`
  padding: 0 20px;
  margin-top: -20px;
  position: relative;
  z-index: 2;
`;

const InviteCodeCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 16px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  }
`;

const InviteCodeIcon = styled.div`
  font-size: 28px;
`;

const InviteCodeText = styled.div`
  flex: 1;
`;

const InviteCodeTitle = styled.div`
  font-size: 15px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2);
  margin-bottom: 2px;
`;

const InviteCodeDesc = styled.div`
  font-size: 12px;
  color: var(--color-dark1);
`;

const InviteArrow = styled.div`
  font-size: 18px;
  color: var(--color-main);
`;

const SearchSection = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
`;

const SearchInputWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  background: white;
  border-radius: 14px;
  padding: 0 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
  transition: all 0.2s ease;

  &:focus-within {
    border-color: var(--color-main);
    box-shadow: 0 2px 12px rgba(14, 98, 68, 0.15);
  }
`;

const SearchIconWrapper = styled.div`
  color: var(--color-dark1);
  display: flex;
  align-items: center;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  padding: 14px 12px;
  font-size: 15px;
  background: transparent;

  &::placeholder {
    color: #bbb;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  font-size: 14px;
`;

const SearchButton = styled.button`
  background: var(--color-main);
  color: white;
  border: none;
  border-radius: 14px;
  padding: 0 20px;
  font-size: 14px;
  font-family: "Pretendard-SemiBold";
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--color-main-darker);
  }
`;

const QuickFilterSection = styled.div`
  margin-bottom: 16px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const FilterChipsWrapper = styled.div`
  display: flex;
  gap: 8px;
  padding: 4px 0;
`;

const FilterChip = styled.button<{ isActive?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${(props) => (props.isActive ? "var(--color-main)" : "white")};
  color: ${(props) => (props.isActive ? "white" : "var(--color-dark2)")};
  border: 1px solid
    ${(props) => (props.isActive ? "var(--color-main)" : "#eee")};
  border-radius: 20px;
  padding: 8px 14px;
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-main);
  }
`;

const FilterDivider = styled.div`
  width: 1px;
  height: 24px;
  background: #eee;
  margin: 0 4px;
  align-self: center;
`;

const ResultsHeader = styled.div`
  margin-bottom: 12px;
`;

const ResultsCount = styled.span`
  font-size: 14px;
  color: var(--color-dark1);
`;

const TeamCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TeamCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.4s ease forwards;
  opacity: 0;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
  }
`;

const TeamCardInner = styled.div`
  display: flex;
  gap: 16px;
`;

const TeamLogo = styled.img`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  object-fit: cover;
  background: #f0f0f0;
  flex-shrink: 0;
`;

const TeamInfoSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const TeamName = styled.h3`
  font-size: 17px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TeamMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-dark1);

  svg {
    color: var(--color-main);
    flex-shrink: 0;
  }
`;

const TeamBadges = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

const Badge = styled.span<{ variant?: string }>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-family: "Pretendard-Medium";

  ${(props) =>
    props.variant === "level" &&
    `
    background: var(--color-subtle);
    color: var(--color-main);
  `}

  ${(props) =>
    props.variant === "members" &&
    `
    background: #f0f0f0;
    color: var(--color-dark2);
  `}
`;

const ViewDetailButton = styled.div`
  margin-top: 12px;
  text-align: right;
  font-size: 13px;
  color: var(--color-main);
  font-family: "Pretendard-SemiBold";
`;

/* ========== Loading Skeleton ========== */
const SkeletonCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 18px;
  display: flex;
  gap: 16px;
`;

const SkeletonImage = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const SkeletonContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SkeletonTitle = styled.div`
  width: 60%;
  height: 20px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

const SkeletonText = styled.div<{ short?: boolean }>`
  width: ${(props) => (props.short ? "40%" : "80%")};
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

/* ========== Empty State ========== */
const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 16px;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2);
  margin-bottom: 8px;
`;

const EmptyDesc = styled.p`
  font-size: 14px;
  color: var(--color-dark1);
`;

/* ========== Filter Panel ========== */
const FilterOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 1000;
`;

const FilterPanel = styled.div`
  background: white;
  border-radius: 24px 24px 0 0;
  width: 100%;
  max-height: 85vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s ease;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
`;

const FilterTitle = styled.h2`
  font-size: 18px;
  font-family: "Pretendard-Bold";
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 28px;
  color: var(--color-dark1);
  cursor: pointer;
  padding: 0;
  line-height: 1;
`;

const FilterContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
`;

const FilterSection = styled.div`
  margin-bottom: 24px;
`;

const SectionTitle = styled.h3`
  font-size: 15px;
  font-family: "Pretendard-SemiBold";
  color: var(--color-dark2);
  margin-bottom: 12px;
`;

const FilterFooter = styled.div`
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
  padding-bottom: calc(16px + env(safe-area-inset-bottom));
`;
