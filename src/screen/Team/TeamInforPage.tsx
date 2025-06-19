import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header2 from "../../components/Header/Header2/Header2";
import apiClient from "../../api/apiClient";
import { FaLocationDot, FaPeopleGroup, FaHeart } from "react-icons/fa6";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import HorizontalLine from "../../components/Styled/HorizontalLine";
import MainButton from "../../components/Button/MainButton";

interface TeamListItem {
  position: string;
  teamColor: string;
  teamId: number;
  teamImageUrl: string;
  teamName: string;
}

interface TeamData {
  activitySchedule: string[];
  //activityTime: number[];
  ageRange: string;
  dues: string;
  invitedCode: string;
  matchLocation: string;
  positionRequired: string[];
  region: string;
  teamGender: string;
  teamImageUrl: string;
  teamLevel: string;
  teamName: string;
  team_introduce: string;
  town: string;
  memberCount: string;
}

interface NoticeItem {
  id: number;
  title: string;
  createAt: Date;
}

const TeamInfoPage: React.FC = () => {
  const [teamList, setTeamList] = useState<TeamListItem[]>([]);
  const [teamData, setTeamData] = useState<TeamData>();
  const [teamId, setTeamId] = useState<string>("13");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await apiClient.get(`api/team/${teamId}`);
        setTeamData(response.data);
      } catch (err) {
        console.error("Error fetching team data:", err);
      }
    };

    fetchTeamData();
  }, []);

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

  return (
    <>
      <Header2 text={teamData?.teamName} />

      <Container>
        {teamData && (
          <>
            <ProfileWrapper>
              <TeamProfile>
                <TeamProfileImg src={teamData.teamImageUrl} />
                <TeamProfileInfor>
                  <TeamProfileText>
                    <FaLocationDot /> 지역 {teamData.region} {teamData.town}
                  </TeamProfileText>
                  <TeamProfileText>
                    <FaPeopleGroup /> 연령대 {teamData.ageRange}
                  </TeamProfileText>
                  <TeamProfileText>
                    <FaPeopleGroup /> 성별 {teamData.teamGender}
                  </TeamProfileText>
                  <TeamProfileText>
                    <FaPeopleGroup /> 레벨 {teamData.teamLevel}
                  </TeamProfileText>
                </TeamProfileInfor>
              </TeamProfile>
              {/* <TeamProfileSetting
                onClick={() => handleEditClick(Number(teamId))}
              >
                <IoSettingsSharp />
              </TeamProfileSetting> */}
            </ProfileWrapper>
            <CardWrapper>
              <Card>선수 수 : {teamData.memberCount}명</Card>
              <Card>회비/월 : {teamData.dues}원</Card>
            </CardWrapper>
            <TeamDetails>
              <TeamTitle>팀 소개</TeamTitle>
              <p style={{ fontSize: "14px" }}>{teamData.team_introduce}</p>
            </TeamDetails>
            <TeamDetails>
              {/* <p>팀 이름: {teamData.teamName}</p> */}

              <>
                <TeamTitle>주요 활동 일정</TeamTitle>
                <ItemWrapper>
                  {teamData.activitySchedule.map((item, idx) => {
                    const isActive = teamData.activitySchedule.includes(item); // 해당 요일이 활성화 상태인지 확인

                    var times = "";
                    if (Array.isArray(item)) {
                      // item이 배열일 때
                      times = item.join(", "); // '아침,점심'으로 결합
                    } else {
                      // item이 문자열일 때
                      times = item.split(",").join(", ");
                    }
                    console.log(item);
                    var dayName = "";
                    switch (idx) {
                      case 0:
                        dayName = "월";
                        break;
                      case 1:
                        dayName = "화";
                        break;
                      case 2:
                        dayName = "수";
                        break;
                      case 3:
                        dayName = "목";
                        break;
                      case 4:
                        dayName = "금";
                        break;
                      case 5:
                        dayName = "토";
                        break;
                      case 6:
                        dayName = "일";
                        break;
                    }

                    return (
                      item.length !== 0 && (
                        <ActivityDaysItem
                          key={item}
                          isActive={isActive}
                          className="border-df shadow-df"
                        >
                          <div>{dayName}</div> <div>{times}</div>
                        </ActivityDaysItem>
                      )
                    );
                  })}
                </ItemWrapper>
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
              <TeamTitle>이런 사람을 찾고 있어요</TeamTitle>
            </TeamDetails>
          </>
        )}
        <MainButton onClick={() => navigate(`/team/list/${teamId}/join`)}>
          팀 가입하기
        </MainButton>
      </Container>
    </>
  );
};

export default TeamInfoPage;

// Styled Components
const Container = styled.div`
  margin-top: 20px;
  padding-right: 20px;
  padding-left: 20px;
`;

const TeamDetails = styled.div`
  margin-top: 10px;
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
  width: 70px;
  height: 70px;
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
const CardWrapper = styled.div`
  margin-top: 20px;
  display: flex;
  gap: 10px;
`;
const Card = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  width: 50%;
  border-radius: 8px;
`;
const ItemWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const ActivityDaysItem = styled.div<{ isActive: boolean }>`
  display: flex;
  justify-content: space-evenly;
  margin: 0 auto;
  width: 90%;
  height: 15px;
  border-radius: 8px;
  padding: 10px;
  font-size: 14px;
  text-align: center;
  background-color: ${({ isActive }) =>
    isActive
      ? "var(--color-light2)"
      : "#ffffff"}; /* 활성화: 초록색, 비활성화: 회색 */
  color: ${({ isActive }) =>
    isActive
      ? "var(--color-main)"
      : "#9e9e9e"}; /* 활성화: 흰색, 비활성화: 연한 회색 */
`;
