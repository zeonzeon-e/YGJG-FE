import React, { useState, useEffect } from "react";
import styled from "styled-components";
import apiClient from "../../api/apiClient";

interface FormationModal2Props {
  onClose: () => void;
  onSave: (circles: CirclePosition[]) => void;
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
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Header>
          <Title>포메이션 설정</Title>
          <CloseButton onClick={onClose}>X</CloseButton>
        </Header>
        <SearchContainer>
          <SearchInput placeholder="포메이션 검색" />
          <SearchButton>검색</SearchButton>
        </SearchContainer>
        <ItemList>
          {items.map((item) => (
            <Item key={item.id}>
              <Icon
                onClick={() => toggleStar(item.id)}
                color={item.isStarred ? "gold" : "gray"}
              >
                {item.isStarred ? "★" : "☆"}
              </Icon>
              <Text>{item.name}</Text>
              <RemoveButton onClick={() => console.log("remove")}>
                ×
              </RemoveButton>
            </Item>
          ))}
        </ItemList>
      </ModalContent>
    </ModalOverlay>
  );
};

export default FormationListModal;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h3`
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  display: flex;
  margin-top: 10px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 5px;
`;

const SearchButton = styled.button`
  padding: 8px 12px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
`;

const ItemList = styled.div`
  margin-top: 10px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 0;
`;

const Icon = styled.span`
  color: ${(props) => props.color || "black"};
  margin-right: 10px;
`;

const Text = styled.span`
  flex: 1;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
`;
