import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import apiClient from "../../api/apiClient";

interface FormationModal2Props {
  onClose: () => void;
  onSave: (circles: CirclePosition[], formationName?: string) => void;
}

// 포메이션 위치한 원
interface CirclePosition {
  id: number;
  x: number;
  y: number;
  color: string;
  detail_position: string;
  name: string;
}

interface ListItem {
  id: number; //고유코드
  name: string; //저장된 포메이션의 이름
  isStarred: boolean; //즐겨찾기 여부
}

const FormationListModal: React.FC<FormationModal2Props> = ({
  onClose,
  onSave,
}) => {
  const initialItems = [
    { id: 1, name: "연습", isStarred: false },
    { id: 2, name: "확인중", isStarred: false },
    { id: 3, name: "10번", isStarred: false },
  ];

  useEffect(() => {
    // const fetchGameName = async () => {
    //   if (!numericTeamId) return;
    //   try {
    //     const response = await apiClient.get<Player[]>(
    //       `/api/team-strategy/get-position/name`,
    //       {
    //         params: { positionName: "", teamId: numericTeamId },
    //       }
    //     );
    //     setAvailablePlayers(response.data ?? []);
    //     setInitialPlayers(response.data ?? []);
    //   } catch (error) {
    //     console.error("Failed to fetch players:", error);
    //   }
    // };
    // fetchGameName();

    const fetchForamtionList = async () => {
      try {
        const response = await apiClient.get(
          `/api/team-strategy/get/formation`,
          {
            params: { formationId: 3, teamId: 13 },
          }
        );
        console.log(response);
      } catch (error) {
        console.error("Failed to fetch players:", error);
      }
    };
    fetchForamtionList();
  }, []);
  const [items, setItems] = useState<ListItem[]>(initialItems);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStar = (id: number) => {
    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === id ? { ...item, isStarred: !item.isStarred } : item
      );
      return newItems.sort(
        (a, b) => (b.isStarred ? 1 : 0) - (a.isStarred ? 1 : 0)
      );
    });
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <Header>
          <div>
            <Title>포메이션 불러오기</Title>
            <Subtitle>즐겨찾기한 전술을 빠르게 선택하세요</Subtitle>
          </div>
          <CloseButton onClick={onClose}>×</CloseButton>
        </Header>

        <SearchBar>
          <SearchInput
            placeholder="포메이션 이름 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchHint>⌘K</SearchHint>
        </SearchBar>

        <ItemList>
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <Item key={item.id}>
                <ItemInfo>
                  <StarButton
                    type="button"
                    onClick={() => toggleStar(item.id)}
                    aria-label="즐겨찾기"
                    isActive={item.isStarred}
                  >
                    {item.isStarred ? "★" : "☆"}
                  </StarButton>
                  <ItemName>{item.name}</ItemName>
                </ItemInfo>
                <ItemActions>
                  <GhostButton onClick={() => console.log("remove")}>
                    삭제
                  </GhostButton>
                </ItemActions>
              </Item>
            ))
          ) : (
            <EmptyState>
              <p>결과가 없습니다</p>
              <span>검색어를 다시 확인해주세요.</span>
            </EmptyState>
          )}
        </ItemList>

        <Footer>
          <Hint>길게 눌러 상세 전술을 미리 볼 수 있어요</Hint>
          <CloseAction onClick={onClose}>닫기</CloseAction>
        </Footer>
      </ModalCard>
    </ModalOverlay>
  );
};

export default FormationListModal;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(5, 10, 20, 0.65);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.25s ease;
`;

const ModalCard = styled.div`
  width: min(360px, calc(100% - 40px));
  background: linear-gradient(180deg, #ffffff 0%, #f8fafd 100%);
  border-radius: 24px;
  padding: 28px 24px 20px;
  box-shadow: 0 30px 60px rgba(15, 30, 60, 0.2);
  display: flex;
  flex-direction: column;
  gap: 16px;
  animation: ${fadeIn} 0.3s ease forwards;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 20px;
  color: var(--color-dark2);
`;

const Subtitle = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: var(--color-dark1);
`;

const CloseButton = styled.button`
  border: none;
  background: rgba(0, 0, 0, 0.05);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const SearchBar = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border-radius: 16px;
  border: 1px solid #e2e6ef;
  padding: 0 12px;
  background: #f8f9fd;
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  background: transparent;
  padding: 12px 0;
  font-size: 14px;
  color: var(--color-dark2);

  &:focus {
    outline: none;
  }
`;

const SearchHint = styled.span`
  font-size: 12px;
  color: #a0a8b8;
`;

const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 320px;
  overflow-y: auto;
  padding-right: 4px;
`;

const Item = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 16px;
  border-radius: 16px;
  background: white;
  border: 1px solid transparent;
  transition: all 0.2s ease;

  &:hover {
    border-color: #dfe3ec;
    box-shadow: 0 8px 18px rgba(8, 24, 68, 0.06);
    transform: translateY(-1px);
  }
`;

const ItemInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StarButton = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: ${(props) => (props.isActive ? "#f0c419" : "#c5c9d7")};
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

const ItemName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: var(--color-dark2);
`;

const ItemActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GhostButton = styled.button`
  border: none;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 12px;
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  color: #7d8597;

  &:hover {
    background: rgba(0, 0, 0, 0.08);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #9ca3b5;

  p {
    margin: 0 0 6px;
    font-weight: 600;
  }

  span {
    font-size: 13px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  border-top: 1px solid #eef1f7;
`;

const Hint = styled.span`
  font-size: 12px;
  color: #9aa2b5;
`;

const CloseAction = styled.button`
  border: none;
  background: linear-gradient(135deg, var(--color-main) 0%, #0c5135 100%);
  color: white;
  border-radius: 14px;
  padding: 10px 18px;
  font-size: 13px;
  cursor: pointer;
  box-shadow: 0 10px 18px rgba(13, 80, 54, 0.3);

  &:hover {
    transform: translateY(-1px);
  }
`;
