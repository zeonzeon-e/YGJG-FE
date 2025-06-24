import React, { useEffect, useState } from "react";
import styled from "styled-components";
import GlobalStyles from "../../components/Styled/GlobalStyled";
import Header2 from "../../components/Header/Header2/Header2";
import axios from "axios";
import apiClient from "../../api/apiClient";

interface ApprovalItemType {
  status: string;
  teamImageUrl: any;
  position?: string;
  teamName: string;
}

const JoinApprovalStatus: React.FC = () => {
  // const approvalList = [
  //   {
  //     teamName: "코리아 팀",
  //     position: "공격수",
  //     status: "승인대기",
  //     teamImageUrl: "https://example.com/profile-image.jpg",
  //   },
  //   {
  //     teamName: "코리아 팀",
  //     position: "공격수",
  //     status: "거절",
  //     teamImageUrl: "https://example.com/profile-image.jpg",
  //   },
  // ];
  const [approval, setApproval] = useState<number>(0);
  const [wait, setWait] = useState<number>(0);
  const [out, setOut] = useState<number>(0);
  const [approvalList, setApprovalList] = useState<ApprovalItemType[]>([]); // 상태 관리

  useEffect(() => {
    let approvalCount = 0;
    let waitCount = 0;
    let outCount = 0;

    approvalList.forEach((team) => {
      if (team.status === "ACCEPT") {
        approvalCount += 1;
      } else if (team.status === "PENDING") {
        waitCount += 1;
      } else if (team.status === "REJECT") {
        outCount += 1;
      }
    });

    setApproval(approvalCount);
    setWait(waitCount);
    setOut(outCount);
  }, [approvalList]);

  // API 호출
  useEffect(() => {
    const fetchApprovalList = async () => {
      try {
        const response = await apiClient.get("/api/myPage/requests"); // 백엔드 API 엔드포인트
        setApprovalList(response.data); // 응답 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching approval list", error);
      }
    };

    fetchApprovalList();
  }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행

  return (
    <>
      <GlobalStyles />
      <Header2 text="가입 승인 현황" nav={"/my"} />
      <Container>
        <Title>최근 2주 동안의 가입 승인 현황이에요</Title>
        <CountContainer>
          <CountA>
            <CountTitle style={{ color: "green" }}>승인</CountTitle>
            <CountContent>{approval}</CountContent>
          </CountA>
          <CountB>
            <CountTitle style={{ color: "orange" }}>승인 대기</CountTitle>
            <CountContent>{wait}</CountContent>
          </CountB>
          <CountC>
            <CountTitle style={{ color: "red" }}>거절</CountTitle>
            <CountContent>{out}</CountContent>
          </CountC>
        </CountContainer>
        {approvalList.map((item, index) => (
          <ApprovalItem key={index}>
            <ProfileImage src={item.teamImageUrl} alt="팀 이미지" />
            <TeamInfo>
              <TeamName>{item.teamName}</TeamName>
              <Position>{item.position}</Position>
              <Status status={item.status}>{item.status}</Status>
            </TeamInfo>
          </ApprovalItem>
        ))}
        <Footer>전체 {approvalList.length}건</Footer>
      </Container>
    </>
  );
};

export default JoinApprovalStatus;

// 스타일 컴포넌트 정의

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.div`
  margin-top: 20px;
  font-size: 18px;
`;
const CountContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
  gap: 10px;
`;
const CountA = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;
  border: 1px green solid;
  border-radius: 8px;
  align-items: center;
  align-content: center;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const CountB = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;
  border: 1px orange solid;
  border-radius: 8px;
  align-items: center;
  align-content: center;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const CountC = styled.div`
  flex: 1;
  display: flex;
  gap: 20px;
  border: 1px red solid;
  border-radius: 8px;
  align-items: center;
  align-content: center;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const CountTitle = styled.div`
  margin-top: 10px;
`;
const CountContent = styled.div`
  margin-bottom: 10px;
`;
const ApprovalItem = styled.div`
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-light2);
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 15px;
`;

const TeamInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const TeamName = styled.div`
  font-size: 16px;
  font-family: "Pretendard-Bold";
  color: var(--color-dark2);
  margin-bottom: 5px;
  margin-right: 20px;
`;

const Position = styled.div`
  font-size: 14px;
  font-family: "Pretendard-Regular";
  color: var(--color-sk); /* 예시로 공격수 색상 */
`;

const Status = styled.div<{ status: string }>`
  font-size: 14px;
  font-family: "Pretendard-Regular";
  color: ${({ status }) =>
    status === "승인대기" ? "var(--color-error)" : "var(--color-dark2)"};
  margin-left: auto;
`;

const Footer = styled.div`
  font-size: 14px;
  font-family: "Pretendard-Regular";
  color: var(--color-dark2);
  text-align: center;
  margin-top: 20px;
`;
