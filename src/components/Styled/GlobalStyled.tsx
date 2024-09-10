import { createGlobalStyle } from "styled-components";

// 전역 스타일 정의
const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }

  /* 바디에 대한 기본 스타일 설정 */
  body {
    color: #333; /* 기본 텍스트 색상 */
  }

  /* 애플리케이션의 레이아웃 스타일 설정 */
  .App {
    max-width: 600px; /* 최대 너비 */
    margin: 0 auto; /* 가운데 정렬 */
  }
`;

export default GlobalStyles;
