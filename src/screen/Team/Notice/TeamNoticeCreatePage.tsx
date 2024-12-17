import React, { useState } from "react";
import styled from "styled-components";
import Header2 from "../../../components/Header/Header2/Header2";
import MainButton from "../../../components/Button/MainButton";
import { FaBoxOpen } from "react-icons/fa6";
import axios from "axios";
import apiClient from "../../../api/apiClient";

const TeamNoticeCreatePage: React.FC = () => {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [teamId] = useState<number>(1); // 팀 ID (고정값 또는 동적으로 받을 수 있음)

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("teamId", teamId.toString());
    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await apiClient.post("api/announcement/manager/create", formData);

      if (response.status === 200) {
        alert("공지사항이 성공적으로 등록되었습니다.");
        // 폼 초기화
        setTitle("");
        setContent("");
        setImage(null);
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
          <FileInputWrapper>
            <FileLabel>
              <FileInput type="file" onChange={handleImageChange} />
              <FaBoxOpen /> 사진 첨부하기
            </FileLabel>
          </FileInputWrapper>
          <Label>내용</Label>
          <Textarea
            className="border-df shadow-df"
            value={content}
            onChange={handleContentChange}
            placeholder="내용을 입력해주세요"
          ></Textarea>
          <MainButton onClick={handleSubmit}>등록하기</MainButton>
        </Form>
      </Container>
    </>
  );
};

export default TeamNoticeCreatePage;

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

const FileInputWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const FileLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px;
  font-size: 14px;
  border: 1px solid var(--color-sub);
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  background-color: white;

  :hover {
    background-color: #f0f8ff;
  }
`;

const FileInput = styled.input`
  display: none;
`;

const Textarea = styled.textarea`
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 14px;
  height: 200px;
  resize: none;
`;

const SubmitButton = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  color: white;
  background-color: var(--color-main);
  border: none;
  border-radius: 8px;
  cursor: pointer;

  :hover {
    background-color: #0056b3;
  }
`;
