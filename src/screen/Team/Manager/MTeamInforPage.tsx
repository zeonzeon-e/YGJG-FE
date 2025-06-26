import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header3 from "../../../components/Header/Header3";
import apiClient from "../../../api/apiClient";
import { FaLocationDot, FaPeopleGroup, FaHeart } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import HorizontalLine from "../../../components/Styled/HorizontalLine";
import MiniButton from "../../../components/Button/MiniButton";
import Modal from "../../../components/Modal/Modal1";

interface TeamListItem {
  position: string;
  teamColor: string;
  teamId: number;
  teamImageUrl: string;
  teamName: string;
  role: string;
}

interface TeamData {
  activitySchedule: string[];
  ageRange: string;
  dues: string;
  inviteCode: string;
  matchLocation: string;
  memberCount: number;
  positionRequired: string[];
  region: string;
  teamGender: string;
  teamImageUrl: string;
  teamLevel: string;
  teamName: string;
  team_introduce: string;
  town: string;
}

interface NoticeItem {
  id: number;
  title: string;
  createAt: Date;
}

const TeamInfoPage: React.FC = () => {
  const [selectedTeam, setselectedTeam] = useState<{
    teamId: number;
    teamName: string;
  }>({
    teamId: 0,
    teamName: "",
  });
  const [teamList, setTeamList] = useState<TeamListItem[]>([]);
  const [teamData, setTeamData] = useState<TeamData>();
  const [favoriteTeams, setFavoriteTeams] = useState<number[]>([]);
  const [noticeList, setNoticeList] = useState<NoticeItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 관리
  const navigate = useNavigate();

  /* ─────────────────────────── 데이터 초기화 ─────────────────────────── */
  useEffect(() => {
    const fetchTeamList = async () => {
      try {
        const response = await apiClient.get("api/myPage/teams");
        setTeamList(response.data);
        if (response.data.length > 0) setselectedTeam(response.data[0]);
      } catch (err) {
        console.error("Error fetching team list:", err);
      }
    };
    fetchTeamList();
  }, []);

  useEffect(() => {
    if (selectedTeam.teamId === 0) return;

    const teamId = selectedTeam.teamId;
    const fetchTeamData = async () => {
      try {
        const response = await apiClient.get(`api/team/${teamId}`);
        setTeamData(response.data);
      } catch (err) {
        console.error("Error fetching team data:", err);
      }
    };

    const fetchNoticeList = async () => {
      try {
        const response = await apiClient.get(
          "/api/announcement/member/get-all",
          {
            params: { teamId },
          }
        );
        setNoticeList(response.data);
      } catch (err) {
        console.error("데이터를 가져오는 중 에러가 발생했습니다.", err);
      }
    };

    fetchTeamData();
    fetchNoticeList();
  }, [selectedTeam]);
  const handleCopyLink = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsModalOpen(true); // 모달 열기
  };
  const handleTeamChange = (teamId: number, teamName: string) => {
    setselectedTeam({ teamId, teamName });
  };

  const handleEditClick = (teamId: number) => {
    const teamEdit = teamList.find((item) => item.teamId === teamId);
    navigate(`/team-edit/${teamId}`, {
      state: {
        teamId: teamEdit?.teamId,
        teamColor: teamEdit?.teamColor,
        position: teamEdit?.position,
      },
    });
  };

  const handleNoticeClick = (teamId: number) => {
    navigate("notice", { state: { teamId } });
  };

  const handleToggleFavorite = (teamId: number) => {
    setFavoriteTeams((prevFavorites = []) => {
      if (prevFavorites.includes(teamId)) {
        return prevFavorites.filter((favTeam) => favTeam !== teamId);
      } else {
        return [...prevFavorites, teamId];
      }
    });
  };

  return (
    <>
      <Header3
        selectedTeam={selectedTeam}
        teams={teamList}
        onTeamChange={handleTeamChange}
        favoriteTeams={favoriteTeams}
        onToggleFavorite={handleToggleFavorite}
      />
      <HorizontalLine />
      <Container>
        {teamData && (
          <>
            <ManagerCard>
              {" "}
              내가 <span style={{ color: "var(--color-sub)" }}></span>로
              활동하고 있어요
            </ManagerCard>
            <ProfileWrapper>
              <TeamProfile>
                <TeamProfileImg src={teamData.teamImageUrl} />
                <TeamProfileInfor>
                  <TeamProfileText>
                    <FaLocationDot /> 지역 {teamData.region}
                  </TeamProfileText>
                  <TeamProfileText>
                    <FaPeopleGroup /> 연령대 {teamData.ageRange}
                  </TeamProfileText>
                  <TeamProfileText>
                    <FaHeart /> 포지션
                  </TeamProfileText>
                </TeamProfileInfor>
              </TeamProfile>
              <TeamProfileSetting
                onClick={() => handleEditClick(selectedTeam.teamId)}
              >
                <IoSettingsSharp />
              </TeamProfileSetting>
            </ProfileWrapper>
            <ManagerSetting>
              <div style={{ marginLeft: "auto" }}>
                <MiniButton>팀 프로필 수정</MiniButton>
              </div>
              <div style={{ marginRight: "auto" }}>
                <MiniButton>팀 가입공고 수정</MiniButton>
              </div>
            </ManagerSetting>
            <ManagerInfor>
              <Card>우리 팀에서 나는 를 맡고 있어요</Card>
              <Card>
                <div>초대코드</div>
                <div style={{ color: "var(--color-dark1)" }}>
                  {teamData.inviteCode}
                </div>
                <div onClick={() => handleCopyLink(teamData.inviteCode)}>
                  복사
                </div>
              </Card>
              <GreenCard2 onClick={() => navigate(`memberList`)}>
                <div>선수 목록 보기</div>
                <div>{teamData.memberCount}명</div>
              </GreenCard2>
              <CardContainer>
                <GreenCard2 onClick={() => navigate(`joinReview`)}>
                  <div>가입 승인 대기</div>
                  <div style={{ fontSize: "14px" }}>1건</div>
                </GreenCard2>
                <GreenCard2>
                  <div>탈퇴 확인</div>
                  <div style={{ fontSize: "14px" }}>1건</div>
                </GreenCard2>
              </CardContainer>
            </ManagerInfor>
            <TeamDetails>
              {/* <p>팀 이름: {teamData.teamName}</p> */}
              {/* <p>소개: {teamData.team_introduce}</p> */}
              <>
                <TeamTitle>활동 요일</TeamTitle>
                {/* <ItemWrapper>
                  {activityDays.map((item) => {
                    // const isActive = teamData.activityDays.includes(item); // 해당 요일이 활성화 상태인지 확인
                    return (
                      <ActivityDaysItem
                        key={item}
                        isActive={isActive}
                        className="border-df shadow-df"
                      >
                        {item.slice(0, 1)}
                      </ActivityDaysItem>
                    );
                  })}
                </ItemWrapper> */}
              </>
              {/* <>
          <TeamTitle>활동 시간</TeamTitle>
          <TimeWrapper>
        {timeBlock.map((hour, idx) => {
          const isActive = teamData.activityTime.includes(hour); // 활성 상태 확인
          return (
            <TimeItemWrpper>
            <TimeTitle>{hour === 0 ? "오전\n12시" : hour === 12 ? "오후\n12시" : hour === 6||hour === 9||hour === 15||hour === 18||hour === 21||hour === 3 ? `${hour}시` : ""}</TimeTitle>
            <TimeItem key={hour} isActive={isActive}>

            </TimeItem>
            </TimeItemWrpper>

          );
        })}
      </TimeWrapper>
          </> */}
            </TeamDetails>
            <TeamDetails>
              <TeamTitle>
                <div>공지사항</div>
                <div
                  style={{ color: "var(--color-info)" }}
                  className="h5"
                  onClick={() => handleNoticeClick(selectedTeam.teamId)}
                >
                  더보기
                </div>
              </TeamTitle>
              {noticeList.length > 0 ? (
                <NoticeList>
                  {noticeList.slice(0, 2).map((notice) => (
                    <NoticeItem
                      className="shadow-df border-df"
                      key={notice.id}
                      onClick={() =>
                        navigate(`notice/${notice.id}`, {
                          state: {
                            id: notice.id,
                            teamId: selectedTeam.teamId,
                          },
                        })
                      }
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
            </TeamDetails>
            <TeamDetails>
              <TeamTitle>
                <div>경기일정</div>
                <div
                  style={{ color: "var(--color-info)" }}
                  className="h5"
                  onClick={() => console.log("달력으로 이동")}
                >
                  달력보기
                </div>
              </TeamTitle>
            </TeamDetails>
          </>
        )}
        {/* 모달 컴포넌트 */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} // 모달 닫기
          title="초대코드를 복사했습니다"
          onConfirm={() => setIsModalOpen(false)} // 확인 버튼 클릭 시 삭제 수행
        ></Modal>
      </Container>
    </>
  );
};

export default TeamInfoPage;

// Styled Components
const Container = styled.div`
  margin-top: 10px;
  padding-right: 20px;
  padding-left: 20px;
`;

const TeamDetails = styled.div`
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const ProfileWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const TeamProfile = styled.div`
  display: flex;

  justify-content: space-around;
`;
const TeamTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;
const TeamProfileImg = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
`;
const TeamProfileInfor = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;
const TeamProfileText = styled.div`
  font-size: 14px;
`;
const TeamProfileSetting = styled.div`
  right: 0;
`;

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;
const ActivityDaysItem = styled.div<{ isActive: boolean }>`
  width: 15px;
  height: 15px;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  text-align: center;
  background-color: ${({ isActive }) =>
    isActive
      ? "var(--color-main)"
      : "#ffffff"}; /* 활성화: 초록색, 비활성화: 회색 */
  color: ${({ isActive }) =>
    isActive ? "#ffffff" : "#9e9e9e"}; /* 활성화: 흰색, 비활성화: 연한 회색 */
`;
const TimeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const TimeItem = styled.div<{ isActive: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 12px;
  height: 50px;
  margin: 0 1px;
  border-radius: 20px;
  background-color: ${({ isActive }) =>
    isActive ? "#4caf50" : "#e0e0e0"}; /* 활성화: 초록색, 비활성화: 회색 */
  color: ${({ isActive }) =>
    isActive ? "#ffffff" : "#9e9e9e"}; /* 활성화: 흰색, 비활성화: 연한 회색 */
`;

const TimeItemWrpper = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 11px;
  text-align: center;
  white-space: pre-line;
  align-self: flex-end;
  align-items: center;
`;
const TimeTitle = styled.div`
  word-break: keep-all;
`;

const NoticeList = styled.ul`
  list-style: none;
  padding: 0;
`;

const NoticeItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
`;

const NoticeTitle = styled.div`
  font-size: 14px;
`;

const NoticeDate = styled.div`
  font-size: 12px;
  color: #888;
  white-space: nowrap;
`;
const ManagerCard = styled.div`
  padding: 10px;
  text-align: center;
  background-color: black;
  color: white;
  border-radius: 10px;
  margin: 10px 0;
`;

const ManagerSetting = styled.div`
  display: flex;
  margin: 10px auto;
  gap: 10px;
`;

const ManagerInfor = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Card = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 10px;
  border-radius: 10px;
  background: var(--color-light1);
  box-shadow: 0 1.5px 1.5px 0 var(--color-shabow);
  border: 1px solid var(--color-border);
`;

const GreenCard = styled.div`
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  background: var(--color-main);
  color: var(--color-light1);
  box-shadow: 0 1.5px 1.5px 0 var(--color-shabow);
  border: 1px solid var(--color-border);
`;
const GreenCard2 = styled.div`
  text-align: center;
  padding: 10px 0;
  border-radius: 10px;
  background: var(--color-main);
  color: var(--color-light1);
  box-shadow: 0 1.5px 1.5px 0 var(--color-shabow);
  border: 1px solid var(--color-border);
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  justify-items: center;
`;
const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;
