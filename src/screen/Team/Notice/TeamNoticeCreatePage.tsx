import React, { useState } from "react";
import styled from "styled-components";
import Header2 from "../../../components/Header/Header2/Header2";
import apiClient from "../../../api/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import { getAccessToken } from "../../../utils/authUtils";
import { HiPhoto, HiPaperAirplane, HiXMark } from "react-icons/hi2";

const TeamNoticeCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { teamId } = useParams<{ teamId: string }>();
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // --- Handlers ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setPreview(null);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    const token = getAccessToken();

    // Mock API Call for Dev Mode
    if (token?.startsWith("dev-")) {
      await new Promise((resolve) => setTimeout(resolve, 800));
      alert("[개발 모드] 공지사항이 등록되었습니다! (실제 저장되지 않음)");
      navigate(-1);
      return;
    }

    // Real API Call
    try {
      const formData = new FormData();
      if (image) {
        formData.append("image", image);
      }

      const targetTeamId = teamId ? Number(teamId) : 1;

      await apiClient.post("api/announcement/manager/create", formData, {
        params: {
          title,
          content,
          teamId: targetTeamId,
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("공지사항이 성공적으로 등록되었습니다.");
      navigate(-1);
    } catch (error) {
      console.error("공지사항 등록 실패:", error);
      alert("공지사항 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Header2 text="공지사항 작성" />

      <EditorContainer>
        <TitleInput
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={50}
        />

        <Divider />

        <ContentArea
          placeholder="팀원들에게 알릴 소식을 자유롭게 작성해주세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {preview && (
          <ImagePreviewContainer>
            <PreviewImage src={preview} alt="Upload preview" />
            <RemoveButton onClick={handleImageRemove}>
              <HiXMark />
            </RemoveButton>
          </ImagePreviewContainer>
        )}
      </EditorContainer>

      <BottomBar>
        <ToolButton variant="secondary" as="label">
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
          <HiPhoto />
          <span>사진 추가</span>
        </ToolButton>

        <SubmitButton
          onClick={handleSubmit}
          disabled={loading || !title.trim() || !content.trim()}
        >
          {loading ? (
            "등록 중..."
          ) : (
            <>
              <HiPaperAirplane className="rotate-90" /> 등록하기
            </>
          )}
        </SubmitButton>
      </BottomBar>
    </PageWrapper>
  );
};

export default TeamNoticeCreatePage;

// --- Styled Components ---

const PageWrapper = styled.div`
  min-height: 100vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  position: relative;
  padding-bottom: 80px;
`;

const EditorContainer = styled.div`
  flex: 1;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
`;

const TitleInput = styled.input`
  width: 100%;
  border: none;
  font-size: 24px;
  font-family: "Pretendard-Bold";
  color: #333;
  padding: 12px 0;
  background: transparent;

  &::placeholder {
    color: #ccc;
  }
  &:focus {
    outline: none;
  }
`;

const Divider = styled.div`
  height: 1px;
  background-color: #f0f0f0;
  margin: 12px 0 24px 0;
`;

const ContentArea = styled.textarea`
  width: 100%;
  flex: 1;
  border: none;
  resize: none;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  background: transparent;
  min-height: 200px;

  &::placeholder {
    color: #ccc;
  }
  &:focus {
    outline: none;
  }
`;

const ImagePreviewContainer = styled.div`
  margin-top: 20px;
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  max-height: 300px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const PreviewImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
`;

const RemoveButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const BottomBar = styled.div`
  position: fixed;
  bottom: 70px;
  left: 0;
  right: 0;
  background: white;
  padding: 12px 20px;
  padding-bottom: 24px;
  border-top: 1px solid #f5f5f5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 100;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.05);
`;

const ToolButton = styled.button<{ variant?: string }>`
  background: #f8fafb;
  color: #555;
  border: none;
  border-radius: 20px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #eef2f5;
  }

  svg {
    font-size: 18px;
  }
`;

const SubmitButton = styled.button`
  background: var(--color-main);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 10px 24px;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:active {
    opacity: 0.9;
  }

  .rotate-90 {
    transform: rotate(0deg);
  }
`;
