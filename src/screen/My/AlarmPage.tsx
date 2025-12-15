import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  HiBell,
  HiMegaphone,
  HiTrophy,
  HiClock,
  HiUserGroup,
  HiTrash,
  HiExclamationCircle,
} from "react-icons/hi2";
import Header2 from "../../components/Header/Header2/Header2";

// --- Types ---
type NotificationType =
  | "MATCH_RESULT"
  | "MATCH_UPCOMING"
  | "NOTICE"
  | "JOIN_REQUEST"
  | "SYSTEM";

interface NotificationItem {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string; // e.g., "2시간 전"
  isRead: boolean;
  dateGroup: "오늘" | "어제" | "이번 주";
  link?: string;
  teamName?: string;
}

// --- Mock Data Generator ---
const generateMockNotifications = (): NotificationItem[] => [
  {
    id: 1,
    type: "MATCH_UPCOMING",
    title: "경기 시작 2시간 전입니다! ⚽",
    message:
      "오늘 19:00 vs FC 개발자들 경기가 있습니다. 늦지 않게 도착해주세요!",
    time: "2시간 전",
    isRead: false,
    dateGroup: "오늘",
    teamName: "FC 개발자들",
  },
  {
    id: 2,
    type: "NOTICE",
    title: "[공지] 이번 주 훈련 일정 변경 안내",
    message:
      "우천으로 인해 이번 주 훈련 장소가 실내 풋살장으로 변경되었습니다. 확인 부탁드립니다.",
    time: "5시간 전",
    isRead: false,
    dateGroup: "오늘",
    teamName: "FC 개발자들",
  },
  {
    id: 3,
    type: "MATCH_RESULT",
    title: "경기 결과가 등록되었습니다 🏆",
    message: "어제 vs 디자이너 유나이티드 경기 결과를 확인해보세요. (3:1 승리)",
    time: "1일 전",
    isRead: true,
    dateGroup: "어제",
    teamName: "FC 개발자들",
  },
  {
    id: 4,
    type: "JOIN_REQUEST",
    title: "새로운 가입 신청이 있습니다",
    message: "'김철수'님이 'MF' 포지션으로 가입을 희망합니다. 검토해보세요.",
    time: "1일 전",
    isRead: true,
    dateGroup: "어제",
    teamName: "FC 개발자들",
  },
  {
    id: 5,
    type: "SYSTEM",
    title: "서비스 점검 안내",
    message:
      "더 나은 서비스를 위해 내일 새벽 02:00 ~ 04:00 점검이 예정되어 있습니다.",
    time: "3일 전",
    isRead: true,
    dateGroup: "이번 주",
  },
];

const AlarmPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"ALL" | "UNREAD">("ALL");

  useEffect(() => {
    // Simulate API Call
    const loadData = async () => {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 800)); // Fake delay
      setNotifications(generateMockNotifications());
      setLoading(false);
    };
    loadData();
  }, []);

  const handleMarkAsRead = (id: number) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleDelete = (id: number) => {
    if (window.confirm("알림을 삭제하시겠습니까?")) {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }
  };

  const handleReadAll = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    alert("모든 알림을 읽음 처리했습니다.");
  };

  // Filter & Group Logic
  const filteredList =
    filter === "ALL" ? notifications : notifications.filter((n) => !n.isRead);

  // Group by Date
  const groupedNotifications: { [key: string]: NotificationItem[] } = {
    오늘: [],
    어제: [],
    "이번 주": [],
  };

  filteredList.forEach((item) => {
    if (groupedNotifications[item.dateGroup]) {
      groupedNotifications[item.dateGroup].push(item);
    }
  });

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case "MATCH_UPCOMING":
        return <HiClock color="#f59f00" />;
      case "MATCH_RESULT":
        return <HiTrophy color="#fab005" />;
      case "NOTICE":
        return <HiMegaphone color="#339af0" />;
      case "JOIN_REQUEST":
        return <HiUserGroup color="#51cf66" />;
      case "SYSTEM":
        return <HiExclamationCircle color="#868e96" />;
      default:
        return <HiBell color="#adb5bd" />;
    }
  };

  return (
    <PageWrapper>
      <Header2 text="알림 센터" />

      <TopControl>
        <FilterTabs>
          <Tab active={filter === "ALL"} onClick={() => setFilter("ALL")}>
            전체
          </Tab>
          <Tab active={filter === "UNREAD"} onClick={() => setFilter("UNREAD")}>
            안 읽음
          </Tab>
        </FilterTabs>
        <ReadAllButton onClick={handleReadAll}>모두 읽음</ReadAllButton>
      </TopControl>

      <ContentArea>
        {loading ? (
          <EmptyState>알림을 불러오는 중...</EmptyState>
        ) : filteredList.length === 0 ? (
          <EmptyState>
            <HiBell size={40} color="#eee" />
            <p>새로운 알림이 없습니다.</p>
          </EmptyState>
        ) : (
          Object.entries(groupedNotifications).map(
            ([group, items]) =>
              items.length > 0 && (
                <GroupSection key={group}>
                  <GroupTitle>{group}</GroupTitle>
                  {items.map((item) => (
                    <NotificationCard
                      key={item.id}
                      isRead={item.isRead}
                      onClick={() => handleMarkAsRead(item.id)}
                    >
                      <IconWrapper type={item.type}>
                        {getIcon(item.type)}
                      </IconWrapper>
                      <CardContent>
                        <CardHeader>
                          <Title isRead={item.isRead}>{item.title}</Title>
                          <Time>{item.time}</Time>
                        </CardHeader>
                        <Message>{item.message}</Message>
                        {item.teamName && (
                          <TeamLabel>{item.teamName}</TeamLabel>
                        )}
                      </CardContent>
                      {!item.isRead && <UnreadDot />}
                      <DeleteButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                      >
                        <HiTrash />
                      </DeleteButton>
                    </NotificationCard>
                  ))}
                </GroupSection>
              )
          )
        )}
      </ContentArea>
    </PageWrapper>
  );
};

export default AlarmPage;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: #f8fafb;
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
`;

const TopControl = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border-bottom: 1px solid #f1f3f5;
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 16px;
`;

const Tab = styled.span<{ active: boolean }>`
  font-size: 15px;
  font-weight: ${(props) => (props.active ? "700" : "500")};
  color: ${(props) => (props.active ? "#333" : "#aaa")};
  cursor: pointer;
  position: relative;

  &::after {
    content: "";
    position: absolute;
    bottom: -18px; // Header height adjustment
    left: 0;
    width: 100%;
    height: 2px;
    background: #333;
    display: ${(props) => (props.active ? "block" : "none")};
  }
`;

const ReadAllButton = styled.button`
  background: none;
  border: none;
  font-size: 12px;
  color: #888;
  cursor: pointer;
  text-decoration: underline;
`;

const ContentArea = styled.div`
  padding: 0 20px 40px 20px;
  flex: 1;
`;

const GroupSection = styled.div`
  margin-top: 24px;
`;

const GroupTitle = styled.h3`
  font-size: 14px;
  color: #888;
  margin-bottom: 12px;
  font-weight: 500;
`;

const NotificationCard = styled.div<{ isRead: boolean }>`
  background: white;
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  gap: 14px;
  position: relative;
  transition: transform 0.2s, background-color 0.2s;
  cursor: pointer;

  /* Read style: Dimmed background or slightly different look */
  opacity: ${(props) => (props.isRead ? 0.7 : 1)};
  background: ${(props) => (props.isRead ? "#fbfcff" : "white")};
  box-shadow: ${(props) =>
    props.isRead ? "none" : "0 4px 12px rgba(0,0,0,0.05)"};
  border: 1px solid ${(props) => (props.isRead ? "#f1f3f5" : "transparent")};

  &:hover {
    transform: translateY(-2px);
  }
`;

const IconWrapper = styled.div<{ type: string }>`
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;

  background-color: ${(props) => {
    switch (props.type) {
      case "MATCH_UPCOMING":
        return "#fff9db";
      case "MATCH_RESULT":
        return "#fff3bf";
      case "NOTICE":
        return "#e7f5ff";
      case "JOIN_REQUEST":
        return "#d3f9d8";
      case "SYSTEM":
        return "#f8f9fa";
      default:
        return "#f1f3f5";
    }
  }};
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const Title = styled.h4<{ isRead: boolean }>`
  font-size: 15px;
  font-family: ${(props) =>
    props.isRead ? "Pretendard-Medium" : "Pretendard-Bold"};
  color: #333;
  margin: 0;
  line-height: 1.4;
`;

const Time = styled.span`
  font-size: 12px;
  color: #bbb;
  white-space: nowrap;
  margin-left: 8px;
`;

const Message = styled.p`
  font-size: 13px;
  color: #666;
  margin: 0;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const TeamLabel = styled.span`
  font-size: 11px;
  color: #888;
  background: #f1f3f5;
  padding: 2px 6px;
  border-radius: 4px;
  align-self: flex-start;
  margin-top: 4px;
`;

const UnreadDot = styled.div`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 6px;
  height: 6px;
  background: #fa5252;
  border-radius: 50%;
`;

const DeleteButton = styled.button`
  position: absolute;
  bottom: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #dee2e6;
  cursor: pointer;
  padding: 4px;

  &:hover {
    color: #fa5252;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
  gap: 16px;
  color: #aaa;
`;
