import React, { useEffect } from "react";
import styled from "styled-components";
import GlobalStyles from "../../components/Styled/GlobalStyled";
import Header2 from "../../components/Header/Header2/Header2";
import axios from "axios";

const JoinApprovalStatus: React.FC = () => {
  const approvalList = [
    {
      teamName: "코리아 팀",
      position: "공격수",
      status: "승인대기",
      teamImageUrl: "https://example.com/profile-image.jpg",
    },
    {
      teamName: "코리아 팀",
      position: "공격수",
      status: "거절",
      teamImageUrl: "https://example.com/profile-image.jpg",
    },
  ];

  // const [approvalList, setApprovalList] = useState<ApprovalItemType[]>([]); // 상태 관리

  // // API 호출
  // useEffect(() => {
  //   const fetchApprovalList = async () => {
  //     try {
  //       const response = await axios.get("/api/requests"); // 백엔드 API 엔드포인트
  //       setApprovalList(response.data); // 응답 데이터를 상태에 저장
  //     } catch (error) {
  //       console.error("Error fetching approval list", error);
  //     }
  //   };

  //   fetchApprovalList();
  // }, []); // 컴포넌트가 처음 렌더링될 때 한 번만 실행

  return (
    <>
      <GlobalStyles />
      <Container>
        <Header2 text="가입 승인 현황" />
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
