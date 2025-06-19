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

interface JoinRequest {
  id: number;
  name: string;
  gender: string;
  age: number;
  address: string;
  experience: string;
  level: string;
  desiredPosition: string;
  message: string;
  avatarUrl?: string;
}

const AdminJoinReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { requestId } = useParams<{ requestId: string }>();

  const [request, setRequest] = useState<JoinRequest | null>(null);

  // modal states
  const [rejectConfirmOpen, setRejectConfirmOpen] = useState(false);
  const [rejectCompleteOpen, setRejectCompleteOpen] = useState(false);
  const [approveConfirmOpen, setApproveConfirmOpen] = useState(false);
  const [approveCompleteOpen, setApproveCompleteOpen] = useState(false);

  useEffect(() => {
    // API 호출로 가입 요청 상세 가져오기
    async function fetchRequest() {
      try {
        const res = await apiClient.get<JoinRequest>(
          `/api/admin/join-requests/${requestId}`
        );
        setRequest(res.data);
      } catch (err) {
        console.error("신청서 로드 실패", err);
        navigate(-1);
      }
    }
    fetchRequest();
  }, [requestId, navigate]);

  const handleReject = () => setRejectConfirmOpen(true);
  const handleApprove = () => setApproveConfirmOpen(true);

  const doReject = async () => {
    setRejectConfirmOpen(false);
    try {
      await apiClient.post(`/api/admin/join-requests/${requestId}/reject`);
      setRejectCompleteOpen(true);
    } catch (err) {
      console.error("거절 실패", err);
    }
  };

  const doApprove = async () => {
    setApproveConfirmOpen(false);
    try {
      await apiClient.post(`/api/admin/join-requests/${requestId}/approve`);
      setApproveCompleteOpen(true);
    } catch (err) {
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
            {request.avatarUrl ? (
              <img src={request.avatarUrl} alt="avatar" />
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
          <Row>
            <Label>선수 경험</Label>
            <Value>{request.experience}</Value>
          </Row>
          <Row>
            <Label>수준</Label>
            <Value>{request.level}</Value>
          </Row>
          <Row>
            <Label>희망 포지션</Label>
            <Value>{request.desiredPosition}</Value>
          </Row>
        </Card>

        <MessageSection>
          <MessageLabel>가입 희망자가 전하고 싶은 말이에요</MessageLabel>
          <MessageBox readOnly value={request.message} />
        </MessageSection>

        <ButtonRow>
          <MiniButton onClick={handleReject}>거절</MiniButton>
          <MainButton onClick={handleApprove} height={50}>
            승인
          </MainButton>
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
    </Container>
  );
};

export default AdminJoinReviewPage;

/* styled-components */

const Container = styled.div`
  background-color: #f7f7f7;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 20px;
`;

const Card = styled.div`
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: flex-start;
`;

const Avatar = styled.div`
  font-size: 60px;
  color: var(--color-dark2);
  margin-right: 16px;

  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
`;

const Info = styled.div`
  flex: 1;
`;

const Row = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const Label = styled.div`
  width: 80px;
  font-weight: 500;
  color: var(--color-dark2);
`;

const Value = styled.div`
  flex: 1;
  color: var(--color-dark1);
`;

const MessageSection = styled.div`
  margin-bottom: 24px;
`;

const MessageLabel = styled.div`
  margin-bottom: 8px;
  color: var(--color-dark2);
  font-size: 14px;
`;

const MessageBox = styled.textarea`
  width: 100%;
  height: 120px;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background-color: var(--color-light1);
  resize: none;
  font-size: 14px;
  color: var(--color-dark1);
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;
