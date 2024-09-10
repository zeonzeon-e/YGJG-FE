import React from "react";
import styled from "styled-components";
import { LuMapPin } from "react-icons/lu";

/**
 * ProfileCardProps 인터페이스 - ProfileCard 컴포넌트에 전달되는 props 정의
 * @interface ProfileCardProps
 */
interface ProfileCardProps {
  isManager?: boolean; // 사용자가 매니저인지 여부 (선택적, 기본값: false)
  isSubManager?: boolean; // 사용자가 부매니저인지 여부 (선택적, 기본값: false)
  profileImageUrl: string; // 팀의 프로필 이미지 URL
  teamName: string; // 팀 이름
  location: string; // 경기 장소
  teamSize: string; // 팀원 수 (예: '20명')
  teamAgeRange: string; // 팀 연령대 (예: '20대, 30대')
  teamDays: string; // 팀 경기 요일 (예: '월 화 수 목 금')
  teamTime: string; // 팀 경기 시간대 (예: '오전(9시~12시)')
  teamCost: string; // 팀 월 비용 (예: '30,000원')
  teamLevel: string; // 팀 레벨 (예: '레벨 중')
}

/**
 * ProfileCard 컴포넌트 - 팀 프로필 정보를 카드 형식으로 표시
 * @param {ProfileCardProps} props - ProfileCard 컴포넌트에 전달되는 props
 * @param {boolean} [props.isManager=false] - 사용자가 매니저인지 여부 (선택적, 기본값: false)
 * @param {boolean} [props.isSubManager=false] - 사용자가 부매니저인지 여부 (선택적, 기본값: false)
 * @param {string} props.profileImageUrl - 팀의 프로필 이미지 URL
 * @param {string} props.teamName - 팀 이름
 * @param {string} props.location - 경기 장소
 * @param {string} props.teamSize - 팀원 수 (예: '20명')
 * @param {string} props.teamAgeRange - // 팀 연령대 (예: '20대, 30대')
 * @param {string} props.teamDays - 팀 경기 요일 (예: '월 화 수 목 금')
 * @param {string} props.teamTime - 팀 경기 시간대 (예: '오전(9시~12시)')
 * @param {string} props.teamCost - 팀 월 비용 (예: '30,000원')
 * @param {string} props.teamLevel - 팀 레벨 (예: '레벨 중')
 * @returns {JSX.Element} ProfileCard 컴포넌트
 */
const ProfileCard: React.FC<ProfileCardProps> = ({
  isManager = false, // 기본값 설정
  isSubManager = false, // 기본값 설정
  profileImageUrl,
  teamName,
  location,
  teamSize,
  teamAgeRange,
  teamDays,
  teamTime,
  teamCost,
  teamLevel,
}) => {
  // 매니저 상태에 따라 표시될 텍스트를 결정
  const managerStatus = isManager ? "매니저" : isSubManager ? "부매니저" : null;

  return (
    <Container>
      {managerStatus && (
        <StatusBar>
          내가 <Highlight>{managerStatus}</Highlight>로 활동하고 있어요
        </StatusBar>
      )}
      <ProfileInfo>
        <ProfileImage src={profileImageUrl} alt="Profile" />
        <ProfileName>{teamName}</ProfileName>
        <ProfileLocation>
          <LuMapPin size={14} color="#333" />
          &nbsp;{location}
        </ProfileLocation>
      </ProfileInfo>
      <ProfileActions>
        <ActionButton>팀 프로필 수정</ActionButton>
        <ActionButton>팀 가입 공고 수정</ActionButton>
      </ProfileActions>
      <ProfileTags>
        <Tag>{teamSize}</Tag>
        <Tag>{teamAgeRange}</Tag>
        <Tag>{teamDays}</Tag>
        <Tag>{teamTime}</Tag>
        <Tag>{teamCost}원 / 월</Tag>
        <Tag>{teamLevel}</Tag>
      </ProfileTags>
    </Container>
  );
};

export default ProfileCard;

// 스타일 컴포넌트들은 이전과 동일합니다.

/**
 * Container 스타일 컴포넌트 - 프로필 카드 전체를 감싸는 컨테이너
 */
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

/**
 * StatusBar 스타일 컴포넌트 - 매니저 또는 부매니저 상태를 표시하는 바
 */
const StatusBar = styled.div`
  width: 100%;
  padding: 12px 0;
  background-color: #000;
  color: #fff;
  text-align: center;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 20px;
`;

/**
 * Highlight 스타일 컴포넌트 - 매니저 또는 부매니저 텍스트 강조 표시
 */
const Highlight = styled.span`
  color: #00c853;
`;

/**
 * ProfileInfo 스타일 컴포넌트 - 프로필 이미지, 이름, 위치를 감싸는 섹션
 */
const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;

/**
 * ProfileImage 스타일 컴포넌트 - 프로필 이미지 스타일링
 */
const ProfileImage = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin-top: 40px;
  margin-bottom: 10px;
`;

/**
 * ProfileName 스타일 컴포넌트 - 팀 이름 스타일링
 */
const ProfileName = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 5px;
`;

/**
 * ProfileLocation 스타일 컴포넌트 - 경기 장소 텍스트 스타일링
 */
const ProfileLocation = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #777;
`;

/**
 * ProfileActions 스타일 컴포넌트 - 팀 프로필 및 공고 수정 버튼 섹션
 */
const ProfileActions = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;

  button:first-child {
    margin-right: 10px;
  }
`;

/**
 * ActionButton 스타일 컴포넌트 - 팀 프로필 및 공고 수정 버튼 스타일링
 */
const ActionButton = styled.button`
  padding: 3px 6px;
  font-size: 10px;
  color: #3a3a3c;
  background-color: #fff;
  border: 1px solid #1ceda4;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #e8f5e9;
  }
`;

/**
 * ProfileTags 스타일 컴포넌트 - 팀 정보 태그들을 감싸는 섹션
 */
const ProfileTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 5px 8px;
`;

/**
 * Tag 스타일 컴포넌트 - 각 팀 정보 태그 스타일링
 */
const Tag = styled.div`
  background-color: #005e30;
  color: #fff;
  padding: 8px 8px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 400;
`;
