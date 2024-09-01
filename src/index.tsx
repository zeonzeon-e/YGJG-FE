import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FindPassWardPage from "./screen/Auth/FindPassWardPage";
import FindPassWardPhonePage from "./screen/Auth/FindPassWardPhonePage";
import { createGlobalStyle } from "styled-components";
import LoginPage from "./screen/Auth/LoginPage";

const GlobalStyle = createGlobalStyle`
  body, #root, .app-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 0;
    box-sizing: border-box;
  }
`;

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <App /> */}
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login/find-pw" element={<FindPassWardPage />} />
        <Route
          path="/login/find-pw/phone"
          element={<FindPassWardPhonePage />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
