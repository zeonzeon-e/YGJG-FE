import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
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
      const data = Array.isArray(response.data) ? response.data : [];
      setTeams(data);
      setDisplayedTeams(data);
    } catch (error) {
      console.error("팀 목록 가져오기 오류:", error);

      // 🔧 개발 모드 체크 - dev 토큰인 경우 모달 표시 안함
      const token = getAccessToken();
      if (token?.startsWith("dev-")) {
        console.warn("[DEV MODE] API 호출 실패 - 더미 데이터 사용");
        setTeams([]);
        setDisplayedTeams([]);
      } else {
        setLoginModalOpen(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Level Mapping
  const levelMapping: { [key: string]: string[] } = {
    초급: ["하", "중하"],
    중급: ["중", "중상"],
    고급: ["상"],
  };
  const levelItems = ["하", "중하", "중", "중상", "상"];

  /**
   * "적용하기" 버튼 클릭 혹은 퀵필터 변경 시 호출
   * (server로 필터값 전달하여 리스트 갱신)
   */
  const executeFilter = async (
    sGender: boolean[],
    sLevel: boolean[],
    sRegion: boolean[],
    sAge: boolean[],
    sDays: boolean[]
  ) => {
    // 1. 상세 필터 상태 업데이트 (퀵필터에서 호출했을 때를 위해)
    setSelectedGender(sGender);
    setSelectedLevel(sLevel);
    setSelectedRegion(sRegion);
    setSelectedAge(sAge);
    setSelectedDays(sDays);

    // 2. 퀵필터 UI 상태 동기화 (역방향)
    const newQuick = { gender: "", level: "" };

    // 성별
    const trueGenderCount = sGender.filter((b) => b).length;
    if (trueGenderCount === 1) {
      if (sGender[0]) newQuick.gender = "여성";
      else if (sGender[1]) newQuick.gender = "남성";
      else if (sGender[2]) newQuick.gender = "혼성";
    }

    // 레벨
    // 초급(하,중하), 중급(중,중상), 고급(상) 판별
    const selectedLevelNames = levelItems.filter((_, i) => sLevel[i]);
    const isBeginner =
      selectedLevelNames.length === 2 &&
      selectedLevelNames.includes("하") &&
      selectedLevelNames.includes("중하");
    const isIntermediate =
      selectedLevelNames.length === 2 &&
      selectedLevelNames.includes("중") &&
      selectedLevelNames.includes("중상");
    const isAdvanced =
      selectedLevelNames.length === 1 && selectedLevelNames.includes("상");

    if (isBeginner) newQuick.level = "초급";
    else if (isIntermediate) newQuick.level = "중급";
    else if (isAdvanced) newQuick.level = "고급";

    setQuickFilters(newQuick);

    // 3. API 호출
    setIsLoading(true);
    try {
      const regionValues = sRegion
        .map((selected, idx) =>
          selected ? ["내 위치 중심", "내 활동 지역 중심", "찾기"][idx] : null
        )
        .filter(Boolean) as string[];

      const genderValues = sGender
        .map((selected, idx) =>
          selected ? ["여성", "남성", "혼성"][idx] : null
        )
        .filter(Boolean) as string[];

      const ageValues = sAge
        .map((selected, idx) =>
          selected
            ? ["10대", "20대", "30대", "40대", "50대", "60대"][idx]
            : null
        )
        .filter(Boolean) as string[];

      const daysValues = sDays
        .map((selected, idx) =>
          selected ? ["월", "화", "수", "목", "금", "토", "일"][idx] : null
        )
        .filter(Boolean) as string[];

      const levelValues = sLevel
        .map((selected, idx) => (selected ? levelItems[idx] : null))
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

      const data = Array.isArray(response.data) ? response.data : [];
      setTeams(data);
      setDisplayedTeams(data);
      setSearchKeyword("");
    } catch (error) {
      console.error("필터 적용 중 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyFilter = () => {
    // 현재 상세필터 상태로 실행 및 모달 닫기
    if (!getAccessToken()) {
      setLoginModalOpen(true);
      return;
    }
    executeFilter(
      selectedGender,
      selectedLevel,
      selectedRegion,
      selectedAge,
      selectedDays
    );
    setFilterOpen(false);
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
   * 빠른 필터 적용 (클릭 시 바로 API 호출)
   */
  const handleQuickFilter = (type: "gender" | "level", value: string) => {
    if (!getAccessToken()) {
      setLoginModalOpen(true);
      return;
    }

    const isSame = quickFilters[type] === value;
    const nextValue = isSame ? "" : value;

    // 상세필터 상태 계산
    let nextGender = [...selectedGender];
    let nextLevel = [...selectedLevel];

    if (type === "gender") {
      // value: "남성" | "여성" | "혼성"
      // idx: 여성(0), 남성(1), 혼성(2)
      if (isSame) {
        // 해제 -> 모두 false? or current state?
        // 퀵필터 해제 시 해당 상세필터도 초기화
        nextGender = [false, false, false];
      } else {
        nextGender = [false, false, false]; // Reset others
        if (value === "여성") nextGender[0] = true;
        else if (value === "남성") nextGender[1] = true;
        else if (value === "혼성") nextGender[2] = true;
      }
    } else if (type === "level") {
      // value: "초급" | "중급" | "고급"
      if (isSame) {
        nextLevel = Array(5).fill(false);
      } else {
        nextLevel = Array(5).fill(false);
        const targets = levelMapping[value] || [];
        // items: ["하", "중하", "중", "중상", "상"]
        targets.forEach((t) => {
          const idx = levelItems.indexOf(t);
          if (idx !== -1) nextLevel[idx] = true;
        });
      }
    }

    executeFilter(
      nextGender,
      nextLevel,
      selectedRegion,
      selectedAge,
      selectedDays
    );
  };

  /**
   * 활성화된 필터 목록 생성
   */
  const getActiveFilters = () => {
    const filters: { type: string; label: string; index: number }[] = [];

    selectedRegion.forEach((isOn, idx) => {
      if (isOn)
        filters.push({
          type: "region",
          label: ["내 위치", "활동 지역", "찾기"][idx],
          index: idx,
        });
    });
    selectedGender.forEach((isOn, idx) => {
      if (isOn)
        filters.push({
          type: "gender",
          label: ["여성", "남성", "혼성"][idx],
          index: idx,
        });
    });
    selectedAge.forEach((isOn, idx) => {
      if (isOn)
        filters.push({
          type: "age",
          label: ["10대", "20대", "30대", "40대", "50대", "60대"][idx],
          index: idx,
        });
    });
    selectedDays.forEach((isOn, idx) => {
      if (isOn)
        filters.push({
          type: "days",
          label: ["월", "화", "수", "목", "금", "토", "일"][idx],
          index: idx,
        });
    });
    selectedLevel.forEach((isOn, idx) => {
      if (isOn)
        filters.push({ type: "level", label: levelItems[idx], index: idx });
    });

    return filters;
  };

  const removeFilter = (filter: { type: string; index: number }) => {
    let nextLevels = {
      gender: [...selectedGender],
      level: [...selectedLevel],
      region: [...selectedRegion],
      age: [...selectedAge],
      days: [...selectedDays],
    };

    if (filter.type === "gender") nextLevels.gender[filter.index] = false;
    else if (filter.type === "level") nextLevels.level[filter.index] = false;
    else if (filter.type === "region") nextLevels.region[filter.index] = false;
    else if (filter.type === "age") nextLevels.age[filter.index] = false;
    else if (filter.type === "days") nextLevels.days[filter.index] = false;

    executeFilter(
      nextLevels.gender,
      nextLevels.level,
      nextLevels.region,
      nextLevels.age,
      nextLevels.days
    );
  };

  const activeFilters = getActiveFilters();

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

        {/* Active Filter Cloud Section */}
        <QuickFilterSection>
          <FilterChipsWrapper>
            {/* Filter Toggle Button */}
            <FilterChip
              isActive={filterOpen || activeFilters.length > 0}
              onClick={() => setFilterOpen(true)}
              style={{ paddingRight: 14 }} // Adjust padding since no 'x'
            >
              <FaFilter size={12} />
              필터
              {activeFilters.length > 0 && (
                <FilterCount>{activeFilters.length}</FilterCount>
              )}
            </FilterChip>

            {activeFilters.length > 0 && <FilterDivider />}

            {/* Render Active Filters */}
            {activeFilters.map((filter, i) => (
              <ActiveFilterChip
                key={`${filter.type}-${filter.index}`}
                onClick={() => removeFilter(filter)}
              >
                {filter.label} ✕
              </ActiveFilterChip>
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
                <SectionHeader>
                  <SectionTitle>지역</SectionTitle>
                  <SectionDesc>어디서 활동하는 팀을 찾으시나요?</SectionDesc>
                </SectionHeader>
                <ChipGroup>
                  {["내 위치 중심", "내 활동 지역 중심", "찾기"].map(
                    (label, idx) => (
                      <Chip
                        key={label}
                        selected={selectedRegion[idx]}
                        onClick={() =>
                          setSelectedRegion((prev) =>
                            prev.map((v, i) => (i === idx ? !v : v))
                          )
                        }
                      >
                        {label}
                      </Chip>
                    )
                  )}
                </ChipGroup>
              </FilterSection>

              <FilterSection>
                <SectionHeader>
                  <SectionTitle>성별</SectionTitle>
                  <SectionDesc>원하는 성별 구성을 선택해주세요</SectionDesc>
                </SectionHeader>
                <ChipGroup>
                  {["여성", "남성", "혼성"].map((label, idx) => (
                    <Chip
                      key={label}
                      selected={selectedGender[idx]}
                      onClick={() =>
                        setSelectedGender((prev) =>
                          prev.map((v, i) => (i === idx ? !v : v))
                        )
                      }
                    >
                      {label}
                    </Chip>
                  ))}
                </ChipGroup>
              </FilterSection>

              <FilterSection>
                <SectionHeader>
                  <SectionTitle>연령대</SectionTitle>
                  <SectionDesc>주로 활동하는 나이대를 선택해주세요</SectionDesc>
                </SectionHeader>
                <ChipGroup>
                  {["10대", "20대", "30대", "40대", "50대", "60대"].map(
                    (label, idx) => (
                      <Chip
                        key={label}
                        selected={selectedAge[idx]}
                        onClick={() =>
                          setSelectedAge((prev) =>
                            prev.map((v, i) => (i === idx ? !v : v))
                          )
                        }
                      >
                        {label}
                      </Chip>
                    )
                  )}
                </ChipGroup>
              </FilterSection>

              <FilterSection>
                <SectionHeader>
                  <SectionTitle>요일</SectionTitle>
                  <SectionDesc>활동 가능한 요일을 선택해주세요</SectionDesc>
                </SectionHeader>
                <ChipGroup>
                  {["월", "화", "수", "목", "금", "토", "일"].map(
                    (label, idx) => (
                      <Chip
                        key={label}
                        selected={selectedDays[idx]}
                        onClick={() =>
                          setSelectedDays((prev) =>
                            prev.map((v, i) => (i === idx ? !v : v))
                          )
                        }
                        circle
                      >
                        {label}
                      </Chip>
                    )
                  )}
                </ChipGroup>
              </FilterSection>

              <FilterSection>
                <SectionHeader>
                  <SectionTitle>실력</SectionTitle>
                  <SectionDesc>팀의 실력 수준을 선택해주세요</SectionDesc>
                </SectionHeader>
                <ChipGroup>
                  {["하", "중하", "중", "중상", "상"].map((label, idx) => (
                    <Chip
                      key={label}
                      selected={selectedLevel[idx]}
                      onClick={() =>
                        setSelectedLevel((prev) =>
                          prev.map((v, i) => (i === idx ? !v : v))
                        )
                      }
                    >
                      {label}
                    </Chip>
                  ))}
                </ChipGroup>
              </FilterSection>
            </FilterContent>

            <FilterFooter>
              <MainButton onClick={handleApplyFilter} height={56} fontSize={16}>
                필터 적용하기
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
  z-index: 10; /* ContentContainer(z-index: 2)보다 높게 */
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
  min-width: 0; /* 플렉스 오버플로우 방지 */
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
  flex-shrink: 0;
  white-space: nowrap;

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

const FilterCount = styled.span`
  background: var(--color-main);
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 4px;
`;

const ActiveFilterChip = styled.button`
  height: 32px;
  padding: 0 12px;
  border-radius: 20px;
  border: 1px solid var(--color-main);
  background: rgba(14, 98, 68, 0.08); /* Light green tint */
  color: var(--color-main);
  font-size: 13px;
  font-family: "Pretendard-Medium";
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: rgba(14, 98, 68, 0.15);
  }
`;

const FilterChipsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 4px;
`;

const FilterChip = styled.button<{ isActive?: boolean }>`
  height: 32px;
  padding: 0 14px;
  border-radius: 20px;
  border: 1px solid ${(p) => (p.isActive ? "var(--color-main)" : "#e0e0e0")};
  background: ${(p) => (p.isActive ? "rgba(14, 98, 68, 0.08)" : "white")};
  color: ${(p) => (p.isActive ? "var(--color-main)" : "#666")};
  font-size: 13px;
  font-family: "Pretendard-Medium";
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  transition: all 0.2s;

  &:hover {
    background: ${(p) => (p.isActive ? "rgba(14, 98, 68, 0.12)" : "#f5f5f5")};
  }
`;

const FilterDivider = styled.div`
  width: 1px;
  height: 16px;
  background: #eee;
  margin: 0 4px;
`;

const ResultsHeader = styled.div`
  margin-bottom: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResultsCount = styled.div`
  font-size: 14px;
  color: var(--color-dark1);
`;

const TeamCardList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TeamCard = styled.div`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  cursor: pointer;
  animation: ${fadeInUp} 0.5s ease backwards;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
`;

const TeamCardInner = styled.div`
  padding: 20px;
  display: flex;
  gap: 16px;
`;

const TeamLogo = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: #f0f0f0;
  object-fit: cover;
  flex-shrink: 0;
  border: 1px solid #f0f0f0;
`;

const TeamInfoSection = styled.div`
  flex: 1;
  min-width: 0;
`;

const TeamName = styled.h3`
  font-size: 17px;
  font-family: "Pretendard-Bold";
  color: #333;
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
  color: #666;

  svg {
    color: #999;
  }
`;

const TeamBadges = styled.div`
  padding: 0 20px 20px;
  display: flex;
  gap: 8px;
`;

const Badge = styled.span<{ variant: "level" | "members" }>`
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11px;
  font-family: "Pretendard-SemiBold";

  ${(p) =>
    p.variant === "level" &&
    css`
      background: rgba(14, 98, 68, 0.08);
      color: var(--color-main);
    `}

  ${(p) =>
    p.variant === "members" &&
    css`
      background: #f5f5f5;
      color: #666;
    `}
`;

const ViewDetailButton = styled.div`
  border-top: 1px solid #f5f5f5;
  padding: 12px;
  text-align: center;
  font-size: 13px;
  color: var(--color-main);
  font-family: "Pretendard-SemiBold";
  background: #fafafa;
  transition: all 0.2s;

  ${TeamCard}:hover & {
    background: var(--color-main);
    color: white;
  }
`;

/* ========== Loading Skeleton ========== */
const SkeletonCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  gap: 16px;
  height: 120px;
`;

const SkeletonImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: #f0f0f0;
  animation: ${shimmer} 1.5s infinite linear;
  background: linear-gradient(to right, #f0f0f0 4%, #f7f7f7 25%, #f0f0f0 36%);
  background-size: 1000px 100%;
`;

const SkeletonContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SkeletonTitle = styled.div`
  width: 60%;
  height: 20px;
  background: #f0f0f0;
  border-radius: 6px;
  animation: ${shimmer} 1.5s infinite linear;
  background: linear-gradient(to right, #f0f0f0 4%, #f7f7f7 25%, #f0f0f0 36%);
  background-size: 1000px 100%;
`;

const SkeletonText = styled.div<{ short?: boolean }>`
  width: ${(p) => (p.short ? "40%" : "80%")};
  height: 14px;
  background: #f0f0f0;
  border-radius: 4px;
  animation: ${shimmer} 1.5s infinite linear;
  background: linear-gradient(to right, #f0f0f0 4%, #f7f7f7 25%, #f0f0f0 36%);
  background-size: 1000px 100%;
`;

/* ========== Empty State ========== */
const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  margin-bottom: 20px;
  opacity: 0.5;
`;

const EmptyTitle = styled.h3`
  font-size: 18px;
  font-family: "Pretendard-Bold";
  color: #333;
  margin-bottom: 8px;
`;

const EmptyDesc = styled.p`
  font-size: 14px;
  color: #888;
`;

/* ========== Filter Panel ========== */
const FilterOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-end; /* Mobile bottom sheet */
  @media (min-width: 600px) {
    align-items: center;
    justify-content: center;
  }
`;

const FilterPanel = styled.div`
  width: 100%;
  max-width: 600px;
  max-height: 85vh;
  background: white;
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 0.3s ease-out;
  overflow: hidden;

  @media (min-width: 600px) {
    width: 480px;
    border-radius: 24px;
    max-height: 80vh;
    animation: ${fadeInUp} 0.3s ease-out;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 4px;
  line-height: 1;
`;

const FilterContent = styled.div`
  padding: 24px;
  overflow-y: auto;
  flex: 1;
`;

const FilterFooter = styled.div`
  padding: 20px 24px;
  border-top: 1px solid #f0f0f0;
  background: white;
  padding-bottom: max(20px, env(safe-area-inset-bottom));
`;

const FilterSection = styled.div`
  margin-bottom: 32px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionHeader = styled.div`
  margin-bottom: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-family: "Pretendard-Bold";
  color: #333;
  margin-bottom: 4px;
`;

const SectionDesc = styled.p`
  font-size: 13px;
  color: #888;
`;

const ChipGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const Chip = styled.button<{ selected: boolean; circle?: boolean }>`
  padding: ${(p) => (p.circle ? "0" : "8px 16px")};
  width: ${(p) => (p.circle ? "40px" : "auto")};
  height: ${(p) => (p.circle ? "40px" : "36px")};
  border-radius: ${(p) => (p.circle ? "50%" : "20px")};
  border: 1px solid ${(p) => (p.selected ? "var(--color-main)" : "#e0e0e0")};
  background: ${(p) => (p.selected ? "var(--color-main)" : "white")};
  color: ${(p) => (p.selected ? "white" : "#555")};
  font-size: 14px;
  font-family: ${(p) =>
    p.selected ? "Pretendard-SemiBold" : "Pretendard-Regular"};
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.2, 0, 0, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${(p) => (p.selected ? "0 4px 10px rgba(14,98,68,0.2)" : "none")};

  &:hover {
    border-color: var(--color-main);
    background: ${(p) => (p.selected ? "var(--color-main-darker)" : "#f8f9fa")};
  }

  &:active {
    transform: scale(0.95);
  }
`;
