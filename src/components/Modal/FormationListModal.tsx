import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import apiClient from "../../api/apiClient";
import { useParams } from "react-router-dom";
import { IoClose, IoSearch, IoStar, IoStarOutline, IoTrashOutline } from "react-icons/io5";

interface CirclePosition {
  id: number;
  x: number;
  y: number;
  color: string;
  detail_position: string;
  name: string;
}

interface FormationModal2Props {
  onClose: () => void;
  onSave: (circles: CirclePosition[], formationName?: string) => void;
}

interface FormationItem {
  id: number;
  name: string;
  favorites: boolean;
}

const FormationListModal: React.FC<FormationModal2Props> = ({
  onClose,
  onSave,
}) => {
  const { teamId } = useParams<{ teamId: string }>();
  const [items, setItems] = useState<FormationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchFormationList = async () => {
      if (!teamId) return;
      try {
        const response = await apiClient.get<FormationItem[]>(
          `/api/team/formation-list`, 
          {
            params: { teamId: Number(teamId) },
          }
        );
        
        const data = response.data || [];

        const sortedData = data.sort((a, b) => {
          if (Number(b.favorites) !== Number(a.favorites)) {
            return Number(b.favorites) - Number(a.favorites);
          }
          return a.id - b.id;
        });

        setItems(sortedData);
      } catch (error) {
        console.error("Failed to fetch formation list:", error);
      }
    };

    fetchFormationList();
  }, [teamId]);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleStar = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setItems((prevItems) => {
      const newItems = prevItems.map((item) =>
        item.id === id ? { ...item, favorites: !item.favorites } : item
      );
      return newItems.sort((a, b) => {
        if (Number(b.favorites) !== Number(a.favorites)) {
          return Number(b.favorites) - Number(a.favorites);
        }
        return a.id - b.id;
      });
    });
  };

  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if(window.confirm("정말 이 포메이션을 삭제하시겠습니까?")) {
        setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleSelect = async (item: FormationItem) => {
     try {
        console.log("Selected Formation:", item.name);
        // const response = await apiClient.get(...)
        // onSave(response.data.circles, item.name);
        alert(`'${item.name}' 포메이션을 불러옵니다.`);
        onClose();
     } catch (error) {
         console.error("Failed to load details", error);
     }
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <Header>
          <HeaderTitle>
            <h3>포메이션 불러오기</h3>
            <p>저장된 전술을 터치하여 불러오세요.</p>
          </HeaderTitle>
          <CloseButton onClick={onClose}>
            <IoClose size={24} />
          </CloseButton>
        </Header>

        <SearchSection>
          <SearchWrapper>
            <IoSearch color="#9ca3af" size={18} />
            <SearchInput
              placeholder="전술 이름 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchWrapper>
        </SearchSection>

        {/* Body 영역이 남은 공간을 모두 차지하며 스크롤됨 */}
        <Body>
          {filteredItems.length > 0 ? (
            <List>
              {filteredItems.map((item) => (
                <ListItem key={item.id} onClick={() => handleSelect(item)}>
                  <ItemLeft>
                    <StarButton
                      onClick={(e) => toggleStar(e, item.id)}
                      active={item.favorites}
                    >
                      {item.favorites ? <IoStar /> : <IoStarOutline />}
                    </StarButton>
                    <ItemContent>
                      <ItemName>{item.name}</ItemName>
                      <ItemId>ID: {item.id}</ItemId>
                    </ItemContent>
                  </ItemLeft>
                  
                  <DeleteButton onClick={(e) => handleDelete(e, item.id)}>
                    <IoTrashOutline />
                  </DeleteButton>
                </ListItem>
              ))}
            </List>
          ) : (
            <EmptyState>
              <p>검색 결과가 없습니다.</p>
              <span>새로운 포메이션을 만들어보세요!</span>
            </EmptyState>
          )}
        </Body>

        <Footer>
          <CancelButton onClick={onClose}>닫기</CancelButton>
        </Footer>
      </ModalContainer>
    </Overlay>
  );
};

export default FormationListModal;

/* ===================== Styled Components ===================== */

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const popIn = keyframes`
  0% { transform: scale(0.95); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(5px);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  animation: ${fadeIn} 0.2s ease-out;
  overflow: hidden; 
`;

const ModalContainer = styled.div`
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 28px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  
  /* ⭐️ [핵심] Flex Layout으로 내부 영역 제어 */
  display: flex;
  flex-direction: column;
  
  animation: ${popIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  
  /* ⭐️ [핵심] 최대 높이를 화면의 80%로 제한 (모바일 주소창 고려 dvh 사용) */
  max-height: 40vh; 
  max-height: 40dvh; 
  
  margin: auto;
  position: relative;
`;

const Header = styled.div`
  padding: 24px 24px 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-shrink: 0; /* 스크롤 시 줄어들지 않음 */
`;

const HeaderTitle = styled.div`
  h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 4px;
  }
  p {
    margin: 0;
    font-size: 13px;
    color: #6b7280;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 4px;
  border-radius: 50%;
  transition: background 0.2s;
  display: flex;

  &:hover {
    background: #f3f4f6;
    color: #4b5563;
  }
`;

const SearchSection = styled.div`
  padding: 0 24px 16px;
  flex-shrink: 0; /* 스크롤 시 줄어들지 않음 */
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  background: #f3f4f6;
  border-radius: 14px;
  padding: 0 12px;
  height: 44px;
  border: 1px solid transparent;
  transition: all 0.2s;

  &:focus-within {
    background: #fff;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  margin-left: 8px;
  font-size: 14px;
  color: #1f2937;
  height: 100%;

  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #9ca3af;
  }
`;

/* ⭐️ [핵심] Body: 남은 공간을 차지하고 스크롤 발생 */
const Body = styled.div`
  flex: 1; /* 남은 공간 모두 차지 */
  min-height: 0; /* Flex 자식 스크롤 버그 방지 */
  overflow-y: auto; /* 내용 넘치면 스크롤 */
  padding: 0 24px 24px;
  
  /* iOS 스크롤 부드럽게 */
  -webkit-overflow-scrolling: touch;
  
  /* 스크롤바 숨김 */
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const List = styled.div`
  padding-top:2px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 12px 16px;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0; /* 리스트 아이템이 찌그러지지 않도록 */

  &:hover {
    border-color: #3b82f6;
    background: #f0f9ff;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.08);
  }
`;

const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

const StarButton = styled.div<{ active: boolean }>`
  font-size: 20px;
  color: ${(props) => (props.active ? "#fbbf24" : "#d1d5db")};
  display: flex;
  align-items: center;
  padding: 4px;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.15);
  }
`;

const ItemContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
`;

const ItemId = styled.span`
  font-size: 11px;
  color: #9ca3af;
  margin-top: 2px;
`;

const DeleteButton = styled.div`
  color: #9ca3af;
  padding: 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #fee2e2;
    color: #ef4444;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  text-align: center;
  color: #9ca3af;

  p {
    margin: 0 0 6px;
    font-weight: 600;
    color: #6b7280;
  }
  span {
    font-size: 13px;
  }
`;

const Footer = styled.div`
  padding: 16px 24px 24px;
  border-top: 1px solid #f0f2f5;
  background: #fff;
  flex-shrink: 0; /* 스크롤 시 줄어들지 않음 */
  border-radius: 28px;
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #4b5563;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;