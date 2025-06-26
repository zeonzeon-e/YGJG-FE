// src/pages/AdminJoinReviewPage.tsx

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import Header2 from "../../../components/Header/Header2/Header2";
import MiniButton from "../../../components/Button/MiniButton";
import MainButton from "../../../components/Button/MainButton";
import Modal2 from "../../../components/Modal/Modal2";
import Modal1 from "../../../components/Modal/Modal1";
import apiClient from "../../../api/apiClient";
import CoupleButton from "../../../components/Button/CoupleButton";

interface JoinRequest {
  id: number;
  name: string;
  gender: string;
  age: number;
  address: string;
  hasExperience: boolean;
  level: string;
  position: string;
  joinReason: string;
  prefileUrl?: string;
  memberId: number;
}

const MTMemberAdmissionDetail: React.FC = () => {
  const navigate = useNavigate();
  const { teamId, requestId } = useParams<{
    teamId: string;
    requestId: string;
  }>();

  const [request, setRequest] = useState<JoinRequest | null>(null);

  // modal states
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [rejectCompleteOpen, setRejectCompleteOpen] = useState(false);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [approveCompleteOpen, setApproveCompleteOpen] = useState(false);
  const [approveFailOpen, setApproveFailOpen] = useState(false);
  const [rejectFailOpen, setRejectFailOpen] = useState(false);

  useEffect(() => {
    // API 호출로 가입 요청 상세 가져오기
    async function fetchRequest() {
      try {
        const res = await apiClient.get<JoinRequest>(
          `/api/admin/joinTeam/requestDetail/${requestId}`
        );
        setRequest(res.data);
      } catch (err) {
        console.error("신청서 로드 실패", err);
      }
    }
    fetchRequest();
  }, [requestId, navigate]);

  // 팀 가입 거절 API
  const doReject = async () => {
    setRejectConfirmOpen(false);
    const data = {
      memberId: Number(request?.memberId),
      teamId: Number(teamId),
    };
    try {
      await apiClient.post(
        `/api/admin/joinTeam/${teamId}/deny/${request?.memberId}`,
        data
      );
      setRejectCompleteOpen(true);
    } catch (err) {
      setRejectFailOpen(true);
      console.error("거절 실패", err);
    }
  };

  // 팀 가입 승인 API
  const doApprove = async () => {
    setApproveConfirmOpen(false);
    const data = {
      memberId: Number(request?.memberId),
      teamId: Number(teamId),
    };
    try {
      await apiClient.post(
        `/api/admin/joinTeam/${teamId}/accept/${request?.memberId}`,
        data
      );
      setApproveCompleteOpen(true);
    } catch (err) {
      setApproveFailOpen(true);
      console.error("승인 실패", err);
    }
  };

  const closeAll = () => navigate(-1);

  if (!request) return null;

  return (
    <Container>
      <Header2 text="가입 신청서 열람" />

      <Content>
        <Card>
          <Avatar>
            {request.prefileUrl ? (
              <img src={request.prefileUrl} alt="avatar" />
            ) : (
              <FaUserCircle />
            )}
          </Avatar>
          <Info>
            <Row>
              <Label>이름</Label>
              <Value>{request.name}</Value>
            </Row>
            <Row>
              <Label>성별</Label>
              <Value>{request.gender}</Value>
            </Row>
            <Row>
              <Label>나이</Label>
              <Value>{request.age}세</Value>
            </Row>
            <Row>
              <Label>주소</Label>
              <Value>{request.address}</Value>
            </Row>
          </Info>
        </Card>

        <Card>
          <Info>
            <Row>
              <Label>선수 경험</Label>
              <Value>{request.hasExperience == true ? "있음" : "없음"}</Value>
            </Row>
            <Row>
              <Label>수준</Label>
              <Value>{request.level}</Value>
            </Row>
            <Row>
              <Label>희망 포지션</Label>
              <Value>{request.position}</Value>
            </Row>
          </Info>
        </Card>

        <MessageSection>
          <MessageLabel>가입 희망자가 전하고 싶은 말이에요</MessageLabel>
          <MessageBox readOnly value={request.joinReason} />
        </MessageSection>

        <ButtonRow>
          <CoupleButton
            height={50}
            textN="거절"
            textP="승인"
            onClickN={() => setRejectConfirmOpen(true)}
            onClickP={() => setApproveConfirmOpen(true)}
          ></CoupleButton>
        </ButtonRow>
      </Content>

      {/* 거절 확인 모달 */}
      <Modal2
        isOpen={rejectConfirmOpen}
        onClose={() => setRejectConfirmOpen(false)}
        title="가입을 거절하시겠습니까?"
        confirmText="거절할래요"
        cancelText="거절 안할래요"
        onConfirm={doReject}
      />

      {/* 거절 완료 모달 */}
      <Modal1
        isOpen={rejectCompleteOpen}
        onClose={closeAll}
        title="가입을 거절하였습니다."
        confirmText="확인"
        onConfirm={closeAll}
      />
      {/* 승인 실패 모달 */}
      <Modal1
        isOpen={rejectFailOpen}
        onClose={() => setRejectFailOpen(false)}
        title="가입 거절에 실패하였습니다."
        confirmText="확인"
        onConfirm={() => setRejectFailOpen(false)}
      />
      {/* 승인 확인 모달 */}
      <Modal2
        isOpen={approveConfirmOpen}
        onClose={() => setApproveConfirmOpen(false)}
        title="가입을 승인하시겠습니까?"
        confirmText="승인할래요"
        cancelText="승인 안할래요"
        onConfirm={doApprove}
      />

      {/* 승인 완료 모달 */}
      <Modal1
        isOpen={approveCompleteOpen}
        onClose={closeAll}
        title="가입을 승인하였습니다."
        confirmText="확인"
        onConfirm={closeAll}
      />

      {/* 승인 실패 모달 */}
      <Modal1
        isOpen={approveFailOpen}
        onClose={() => setApproveFailOpen(false)}
        title="가입 승인에 실패하였습니다."
        confirmText="확인"
        onConfirm={() => setApproveFailOpen(false)}
      />
    </Container>
  );
};

export default MTMemberAdmissionDetail;

/* styled-components */

const Container = styled.div`
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 20px;
`;

const Card = styled.div`
  background: var(--color-light2);
  box-shadow: 0 1.5px 1.5px 0 var(--color-shabow);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
`;

const Avatar = styled.div`
  font-size: 60px;
  color: var(--color-dark2);
  margin: 0 auto;

  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
`;

const Row = styled.div`
  display: flex;

  margin-bottom: 8px;
`;

const Label = styled.div`
  width: 100px;
  font-weight: 500;
  color: var(--color-dark2);
  flex: 1 1;
`;

const Value = styled.div`
  color: var(--color-dark2);
`;

const MessageSection = styled.div`
  margin-bottom: 24px;
`;

const MessageLabel = styled.div`
  margin-bottom: 8px;
  color: var(--color-dark2);
  font-size: 16px;
`;

const MessageBox = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 12px;
  box-sizing: border-box;
  border-radius: 8px;
  resize: none;
  font-size: 14px;
  color: var(--color-dark2);
  background: var(--color-light2);
  box-shadow: 0 1.5px 1.5px 0 var(--color-shabow);
  border: 1px solid var(--color-border);
`;

const ButtonRow = styled.div``;
