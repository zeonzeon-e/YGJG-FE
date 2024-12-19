import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FaFilter, FaSearch, FaPaperPlane } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/apiClient";
import Modal1 from "../../components/Modal/Modal1";
import { getAccessToken } from "../../utils/authUtils";
import CheckButton from "../../components/Button/CheckButton";
import MainButton from "../../components/Button/MainButton";
import { BsFillPlusCircleFill } from "react-icons/bs";

const Container = styled.div`
  padding: 30px 20px 20px 20px;
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
  margin-top: 10px;
  margin-bottom: 5px;
  border: 2px solid var(--color-sub);
  cursor: pointer;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 25px;
  padding: 8px 12px;
  background-color: var(--color-light2);
  margin-top: 10px;
`;

const SearchIcon = styled.div`
  color: #666;
  margin-right: 8px;
`;

const Input = styled.input`
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

const SendIcon = styled.div`
  color: #333;
  cursor: pointer;
  margin: 0 8px;
`;

const FilterIcon = styled.div`
  color: #333;
  cursor: pointer;
`;

const SelectedFiltersContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

const SelectedFilter = styled.div`
  background-color: var(--color-main);
  color: white;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 14px;
  display: flex;
  align-items: center;
`;

const RemoveButton = styled.span`
  margin-left: 8px;
  cursor: pointer;
  font-weight: bold;
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
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);
  const [selectedFilters, setSelectedFilters] = useState<
    { label: string; value: string; index: number }[]
  >([]);
  const navigate = useNavigate();

  const [selectedRegion, setSelectedRegion] = useState([false, false, false]);
  const [selectedGender, setSelectedGender] = useState([false, false, false]);
  const [selectedAge, setSelectedAge] = useState(Array(6).fill(false));
  const [selectedDays, setSelectedDays] = useState(Array(7).fill(false));
  const [selectedLevel, setSelectedLevel] = useState(Array(5).fill(false));

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await apiClient.get("api/search/join-team");
      setTeams(response.data);
      setFilteredTeams(response.data);
    } catch (error) {
      console.error("팀 목록 가져오기 오류:", error);
      setLoginModalOpen(true);
    }
  };

  const handleSearch = () => {
    const keyword = searchKeyword.toLowerCase();
    const filtered = teams.filter(
      (team) =>
        team.name.toLowerCase().includes(keyword) ||
        team.ageGroup.includes(keyword) ||
        team.activityDays.join(",").includes(keyword) ||
        team.matchLocation.includes(keyword)
    );
    setFilteredTeams(filtered);
  };

  const addFilter = (label: string, value: string, index: number) => {
    setSelectedFilters((prev) => [...prev, { label, value, index }]);
    applyFilters([...selectedFilters, { label, value, index }]);
  };

  const removeFilter = (label: string, value: string, index: number) => {
    const updatedFilters = selectedFilters.filter(
      (filter) => !(filter.label === label && filter.value === value)
    );
    setSelectedFilters(updatedFilters);
    applyFilters(updatedFilters);
    updateFilterState(label, index, false);
  };

  const applyFilters = (
    filters: { label: string; value: string; index: number }[]
  ) => {
    let filtered = teams;

    filters.forEach((filter) => {
      filtered = filtered.filter((team) => {
        switch (filter.label) {
          case "지역":
            return team.matchLocation === filter.value;
          case "성별":
            return team.gender === filter.value;
          case "연령별":
            return team.ageGroup === filter.value;
          case "요일":
            return team.activityDays.includes(filter.value);
          case "시간대":
            return team.activityTime.includes(filter.value);
          case "실력":
            return team.skillLevel === filter.value;
          default:
            return true;
        }
      });
    });

    setFilteredTeams(filtered);
  };

  const updateFilterState = (
    label: string,
    index: number,
    isSelected: boolean
  ) => {
    switch (label) {
      case "지역":
        setSelectedRegion((prev) =>
          prev.map((selected, i) => (i === index ? isSelected : selected))
        );
        break;
      case "성별":
        setSelectedGender((prev) =>
          prev.map((selected, i) => (i === index ? isSelected : selected))
        );
        break;
      case "연령별":
        setSelectedAge((prev) =>
          prev.map((selected, i) => (i === index ? isSelected : selected))
        );
        break;
      case "요일":
        setSelectedDays((prev) =>
          prev.map((selected, i) => (i === index ? isSelected : selected))
        );
        break;
      case "실력":
        setSelectedLevel((prev) =>
          prev.map((selected, i) => (i === index ? isSelected : selected))
        );
        break;
      default:
        break;
    }
  };

  const toggleSelection = (
    setter: React.Dispatch<React.SetStateAction<boolean[]>>,
    index: number,
    label: string,
    value: string
  ) => {
    setter((prev) => {
      const newState = prev.map((selected, i) =>
        i === index ? !selected : selected
      );
      if (newState[index]) {
        addFilter(label, value, index);
      } else {
        removeFilter(label, value, index);
      }
      return newState;
    });
  };

  const handleJoinByInviteCode = () => {
    if (!getAccessToken()) {
      setLoginModalOpen(true);
    } else {
      navigate("/invite");
    }
  };

  return (
    <Container>
      <Header>
        <Title>가입할 팀 찾기</Title>
        <AddTeamButton onClick={() => navigate("/team/intro")}>
          팀 생성하기 <BsFillPlusCircleFill />
        </AddTeamButton>
      </Header>

      <InviteButton onClick={handleJoinByInviteCode}>
        초대코드로 팀 가입하기
      </InviteButton>

      <InputContainer>
        <SearchIcon>
          <FaSearch />
        </SearchIcon>
        <Input
          type="text"
          placeholder="Enter your keyword"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <SendIcon onClick={handleSearch}>
          <FaPaperPlane />
        </SendIcon>
        <FilterIcon onClick={() => setFilterOpen(true)}>
          <FaFilter />
        </FilterIcon>
      </InputContainer>

      <SelectedFiltersContainer>
        {selectedFilters.map((filter, index) => (
          <SelectedFilter key={index}>
            {filter.label}: {filter.value}
            <RemoveButton
              onClick={() =>
                removeFilter(filter.label, filter.value, filter.index)
              }
            >
              x
            </RemoveButton>
          </SelectedFilter>
        ))}
      </SelectedFiltersContainer>

      {filteredTeams.map((team, index) => (
        <TeamCard key={index}>
          <img
            src={team.teamImageUrl}
            alt="team logo"
            style={{ width: "50px" }}
          />
          <TeamInfo>
            <p style={{ fontWeight: "bold" }}>{team.name}</p>
            <p>{team.ageGroup}</p>
            <p>{team.activityDays.join(", ")}</p>
            <p>{team.matchLocation}</p>
          </TeamInfo>
        </TeamCard>
      ))}

      {isLoginModalOpen && (
        <Modal1
          isOpen={isLoginModalOpen}
          onClose={() => setLoginModalOpen(false)}
          title="로그인이 필요해요!"
          confirmText="로그인 하러가기"
          onConfirm={() => navigate("/login")}
        >
          <p>
            로그인하면 요기조기의 기능을
            <br /> 모두 이용할 수 있어요.
          </p>
        </Modal1>
      )}

      {filterOpen && (
        <FilterOverlay>
          <FilterContainer>
            <Section>
              <h3>지역</h3>
              <CheckButton
                items={["내 위치 중심", "내 활동 지역 중심", "찾기"]}
                selectedStates={selectedRegion}
                onItemClick={(index) =>
                  toggleSelection(
                    setSelectedRegion,
                    index,
                    "지역",
                    ["내 위치 중심", "내 활동 지역 중심", "찾기"][index]
                  )
                }
              />
            </Section>
            <Section>
              <h3>성별</h3>
              <CheckButton
                items={["여성", "남성", "혼성"]}
                selectedStates={selectedGender}
                onItemClick={(index) =>
                  toggleSelection(
                    setSelectedGender,
                    index,
                    "성별",
                    ["여성", "남성", "혼성"][index]
                  )
                }
              />
            </Section>
            <Section>
              <h3>연령별</h3>
              <CheckButton
                items={["10대", "20대", "30대", "40대", "50대", "60대"]}
                selectedStates={selectedAge}
                onItemClick={(index) =>
                  toggleSelection(
                    setSelectedAge,
                    index,
                    "연령별",
                    ["10대", "20대", "30대", "40대", "50대", "60대"][index]
                  )
                }
              />
            </Section>
            <Section>
              <h3>요일</h3>
              <CheckButton
                items={["월", "화", "수", "목", "금", "토", "일"]}
                selectedStates={selectedDays}
                onItemClick={(index) =>
                  toggleSelection(
                    setSelectedDays,
                    index,
                    "요일",
                    ["월", "화", "수", "목", "금", "토", "일"][index]
                  )
                }
              />
            </Section>
            <Section>
              <h3>실력</h3>
              <CheckButton
                items={["하", "중하", "중", "중상", "상"]}
                selectedStates={selectedLevel}
                onItemClick={(index) =>
                  toggleSelection(
                    setSelectedLevel,
                    index,
                    "실력",
                    ["하", "중하", "중", "중상", "상"][index]
                  )
                }
              />
            </Section>
            <MainButton onClick={() => setFilterOpen(false)} height={50}>
              적용하기
            </MainButton>
          </FilterContainer>
        </FilterOverlay>
      )}
    </Container>
  );
};

export default TeamSelectListPage;

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
