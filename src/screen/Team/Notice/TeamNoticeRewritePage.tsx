import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header2 from "../../../components/Header/Header2/Header2";
import MainButton from "../../../components/Button/MainButton";
import { FaBoxOpen } from "react-icons/fa6";
import apiClient from "../../../api/apiClient";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import { useUserStore } from "../../../stores/userStore";
import { getAccessToken } from "../../../utils/authUtils";

const TeamNoticeRewritePage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [essential, setEssential] = useState<boolean>(false);
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const getRoleByTeamId = useUserStore((state) => state.getRoleByTeamId);

  const { teamId, id } = location.state || {
    id: 1,
    teamId: 1,
  };

  // 권한 체크
  useEffect(() => {
    if (teamId) {
      const userRole = getRoleByTeamId(Number(teamId));
      const isManager =
        userRole &&
        ["ROLE_MANAGER", "ROLE_SUBMANAGER", "MANAGER", "SUB_MANAGER"].includes(
          userRole.role
        );
      const isDevMode = getAccessToken()?.startsWith("dev-");

      if (!isManager && !isDevMode) {
        alert("매니저 권한이 없습니다.");
        navigate(-1);
      }
    }
  }, [teamId, getRoleByTeamId, navigate]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file)); // 이미지 미리보기 URL 생성
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setPreview(null);
  };

  useEffect(() => {
    if (id !== "" && teamId !== "") {
      const fetchedDetail = async () => {
        try {
          const response = await apiClient.get(
            `api/announcement/manager/detail`,
            {
              params: {
                announcementId: Number(id),
                teamId: Number(teamId),
              },
            }
          );
          setTitle(response.data.title);
          setPreview(response.data.imageUrl);
          setContent(response.data.content);
          setEssential(response.data.essential || false);
          return response.data;
        } catch (err) {
          console.error("데이터를 가져오는 중 에러가 발생했습니다.", err);
        }
      };
      fetchedDetail();
    }
  }, [id, teamId]);

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목, 내용을 모두 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image || "");

    try {
      const response = await apiClient.put(
        "api/announcement/manager/update",
        formData, // formData를 두 번째 인자로 전달
        {
          params: {
            announcementId: id,
            content,
            teamId,
            title, // 쿼리 파라미터로 전달
            essential: essential,
          },
        }
      );

      if (response.status === 200) {
        alert("공지사항이 성공적으로 수정되었습니다.");
        // 폼 초기화
        setTitle("");
        setContent("");
        setImage(null);
        setPreview(null);
        navigate(-1);
      }
    } catch (error) {
      console.error("공지사항 등록 중 오류 발생:", error);
      alert("공지사항 등록에 실패했습니다.");
    }
  };

  return (
    <>
      <Header2 text="공지 작성하기" line={true} />
      <Container>
        <Form>
          <Label>제목</Label>
          <Input
            className="border-df shadow-df"
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="제목을 입력해주세요"
          />
          
          <ToolGroup>
            <FileLabel>
              <FileInput type="file" onChange={handleImageChange} />
              <FaBoxOpen /> 사진 첨부
            </FileLabel>

            <EssentialToggle onClick={() => setEssential(!essential)} active={essential}>
               <StyledCheckBox checked={essential}>
                 <FaCheck />
               </StyledCheckBox>
               <span>필독 공지</span>
            </EssentialToggle>
          </ToolGroup>

          {preview && (
            <PreviewWrapper>
              <PreviewImage src={preview} alt="미리보기 이미지" />
              <RemoveButton onClick={handleImageRemove}>삭제</RemoveButton>
            </PreviewWrapper>
          )}

          <Label>내용</Label>
          <Textarea
            className="border-df shadow-df"
            value={content}
            onChange={handleContentChange}
            placeholder="내용을 입력해주세요"
          ></Textarea>
          <MainButton onClick={handleSubmit}>수정하기</MainButton>
        </Form>
      </Container>
    </>
  );
};

export default TeamNoticeRewritePage;

// Styled Components
const Container = styled.div`
  padding: 10px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Label = styled.label`
  font-size: 14px;
  font-weight: bold;
`;

const Input = styled.input`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
`;

const ToolGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 5px;
`;

const EssentialToggle = styled.div<{ active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid ${({ active }) => (active ? "var(--color-main)" : "#eee")};
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ active }) => (active ? "#eef6f3" : "white")};
  color: ${({ active }) => (active ? "var(--color-main)" : "#555")};
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: ${({ active }) => (active ? "#e8f2ee" : "#f9f9f9")};
  }
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

const StyledCheckBox = styled.div<{ checked: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  background-color: ${({ checked }) => (checked ? "var(--color-main)" : "#fff")};
  border: 1px solid ${({ checked }) => (checked ? "var(--color-main)" : "#ccc")};
  border-radius: 4px;
  transition: all 0.2s;

  svg {
    visibility: ${({ checked }) => (checked ? "visible" : "hidden")};
    color: white;
    width: 10px;
    height: 10px;
  }
`;

const FileLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid #eee;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  background-color: white;
  color: #555;

  &:hover {
    background-color: #f9f9f9;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const PreviewWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PreviewImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const RemoveButton = styled.button`
  padding: 5px 10px;
  font-size: 12px;
  color: white;
  background-color: red;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  :hover {
    background-color: darkred;
  }
`;

const Textarea = styled.textarea`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  height: 200px;
  resize: none;
`;
