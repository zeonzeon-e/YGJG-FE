import React, { useState, useEffect } from "react";
import GlobalStyles from "../../components/Styled/GlobalStyled";
import Header1 from "../../components/Header/Header1/Header1";
import styled from "styled-components";
import { useNavigate } from "react-router-dom"; // React Router 사용
import apiClient from "../../api/apiClient"; // apiClient 임포트
import MainButton from "../../components/Button/MainButton";
import Modal2 from "../../components/Modal/Modal2";

const TeamJoinPage: React.FC = () => {
  type Profile = {
    address: string;
    gender: string;
    hasExperience: boolean;
    joinReason: string;
    level: string;
    name: string;
    position: string;
    //age: number;
  };

  const [profile, setProfile] = useState<Profile>({
    address: "",
    gender: "",
    hasExperience: false,
    joinReason: "",
    level: "",
    name: "",
    position: "",
    // age: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [position, setPosition] = useState<string>("");
  const [teamId, setTeamId] = useState<string>("1");
  const [completeOpen, setCompleteOpen] = useState(false);
  const [complete, setComplete] = useState(false);
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setProfile((prev) => ({
      ...prev,
      joinReason: e.target.value,
    }));
  };
  const navigate = useNavigate();

  const doApprove = async () => {
    setCompleteOpen(false);
    const requestDto = {
      address: profile.address,
      gender: profile.gender,
      hasExperience: profile.hasExperience,
      joinReason: profile.joinReason,
      level: profile.level,
      name: profile.name,
      position: profile.position,
      // age: 0,
    };
    try {
      const response = await apiClient.post(
        `api/joinTeam/${teamId}`,
        requestDto,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.status === 200) {
        setComplete(true);
        //alert("팀 가입 신청이 성공적으로 등록되었습니다.");
      }
    } catch (error) {
      console.error("공지사항 등록 중 오류 발생:", error);
      alert("팀 가입 신청에 실패했습니다.");
    }
  };

  function calculateAge(birthNumber: number): number {
    const birthStr = birthNumber.toString(); // "20010713"
    const birthYear = parseInt(birthStr.slice(0, 4));
    const birthMonth = parseInt(birthStr.slice(4, 6));
    const birthDay = parseInt(birthStr.slice(6, 8));

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 0부터 시작하므로 +1
    const currentDay = today.getDate();

    let age = currentYear - birthYear;

    // 아직 생일이 안 지났다면 한 살 빼기
    if (
      currentMonth < birthMonth ||
      (currentMonth === birthMonth && currentDay < birthDay)
    ) {
      age--;
    }

    return age;
  }

  useEffect(() => {
    const profileData = async () => {
      try {
        const response = await apiClient.get("api/member/getUser");
        console.log(response.data);
        setProfile({
          address: response.data.address,
          gender: response.data.gender,
          hasExperience: response.data.hasExperience,
          joinReason: response.data.joinReason,
          level: response.data.level,
          name: response.data.name,
          position: response.data.position,
          //  age: calculateAge(response.data.birthDate),
        });
        setPosition(response.data.position);
      } catch (err) {
        console.error(err);
        setError("데이터를 가져오는 중 에러가 발생했습니다.");
      }
    };

    profileData();
    console.log(profile);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPosition(e.target.value);
    setProfile((prev) => ({
      ...prev,
      position: e.target.value,
    }));
  };
  const handleSubmit = async () => {
    if (!content || !position) {
      alert("포지션을 선택해주세요");
      return;
    }

    setCompleteOpen(true);
  };
  return (
    <>
      {complete === false && (
        <>
          <GlobalStyles />
          <Header1 text="팀 가입신청서" />
          <Container>
            <NoticeDiv>
              <NoticeTitle>팀에게 회원님의 정보를 제공해요</NoticeTitle>
              <NoticeDesc>
                해당 정보는 가입할 때 작성해주신 정보에요.
              </NoticeDesc>
              <NoticeDesc>
                변경을 원하신다면, 마이페이지 &gt; 개인 정보 수정에서 변경할 수
                있어요
              </NoticeDesc>
            </NoticeDiv>

            <InforContainer className="border-df">
              <SectionTitle>인적 정보</SectionTitle>
              <SectionDiv>이름 : {profile?.name}</SectionDiv>
              <SectionDiv>성별 : {profile?.gender}</SectionDiv>
              {/* <SectionDiv>나이 : 만 {profile?.age}세</SectionDiv> */}
              <SectionDiv>주소 : {profile?.address}</SectionDiv>
            </InforContainer>
            {profile?.hasExperience !== undefined && (
              <>
                <InforContainer className="border-df">
                  <SectionTitle>추가 정보</SectionTitle>
                  <SectionDiv>
                    선수 경험 :{" "}
                    {profile?.hasExperience === true ? "있음" : "없음"}
                  </SectionDiv>
                  <SectionDiv>수준 : {profile?.level}</SectionDiv>
                </InforContainer>
              </>
            )}
            <InforContainer className="border-df">
              <SectionTitle>팀 내 희망 포지션</SectionTitle>
              <SectionDiv>
                <SyledSelect value={position} onChange={handleChange}>
                  <option value="">포지션</option>
                  <option value="ST">공격수</option>
                  <option value="WD">수비수</option>
                  <option value="MF">미드필더</option>
                  <option value="GK">골키퍼</option>
                </SyledSelect>
              </SectionDiv>
            </InforContainer>
            <Textarea
              className="border-df shadow-df"
              value={content}
              onChange={handleContentChange}
              placeholder="내용을 입력해주세요"
            ></Textarea>
            <MainButton onClick={handleSubmit}>팀 가입하기</MainButton>
            {/* 승인 확인 모달 */}
            <Modal2
              isOpen={completeOpen}
              onClose={() => setCompleteOpen(false)}
              title="팀에 가입신청서를 보내시겠습니까?"
              children="가입신청서를 보내면 회수할 수 없어요"
              confirmText="보낼래요"
              cancelText="안보낼래요"
              onConfirm={doApprove}
            />
          </Container>
        </>
      )}
      {complete === true && (
        <>
          <GlobalStyles />
          <Container>
            <NoticeDiv>
              <ComTitle>팀에 가입신청서를 보냈어요!</ComTitle>
              <ComDesc>마이페이지 &gt; 가입 대기 현황</ComDesc>
              <ComDesc>에서 상태를 확인할 수 있어요</ComDesc>
            </NoticeDiv>
            <MainButton onClick={() => navigate("/my/joinstatus")}>
              마이페이지에서 확인하기
            </MainButton>
            <MainButton onClick={() => navigate("/team/list")}>
              다른 팀 둘러보기
            </MainButton>
          </Container>
        </>
      )}
    </>
  );
};

export default TeamJoinPage;

// 스타일 컴포넌트 정의

const Container = styled.div`
  padding: 20px;
`;

const NoticeDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  border-radius: 8px;
  margin: 20px 0px;
`;
const NoticeTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
`;
const NoticeDesc = styled.div`
  font-size: 14px;
  color: grey;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-family: "Pretendard-Bold";
  margin-bottom: 20px;
`;

const SectionDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const InforContainer = styled.div`
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const SyledSelect = styled.select`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;

  width: 200px;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
  color: #333;
  font-size: 16px;

  background-image: url("data:image/svg+xml;utf8,<svg fill='%23333' height='20' viewBox='0 0 24 24' width='20' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;

  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--color-main);
  }

  option {
    padding: 10px;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 14px;
  }
`;

const Textarea = styled.textarea`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  height: 200px;
  resize: none;
  width: 97%;
`;

const ComTitle = styled.div`
  font-size: 24px;
  font-weight: bold;
  margin: 40px auto;
`;

const ComDesc = styled.div`
  font-size: 20px;
  margin: 0 auto;
`;
