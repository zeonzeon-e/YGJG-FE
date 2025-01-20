import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  removeTokens,
} from "../utils/authUtils";

/**
 * Axios 인스턴스 생성
 * @type {AxiosInstance}
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: "http://43.203.36.23:8080", // API 기본 URL
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
  withCredentials: true,
});

/**
 * 토큰 갱신 중인지 여부를 나타내는 변수
 * @type {boolean}
 */
let isRefreshing = false;

/**
 * 토큰 갱신을 기다리는 요청들의 콜백 배열
 * @type {Array<Function>}
 */
let refreshSubscribers: ((token: string) => void)[] = [];

/**
 * 토큰 갱신 완료 시 구독자들에게 새로운 토큰을 전달하는 함수
 * @param {string} token - 새로운 액세스 토큰
 * @returns {void}
 */
function onRefreshed(token: string): void {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

/**
 * 토큰 갱신을 구독하는 함수
 * @param {Function} cb - 토큰 갱신 시 호출될 콜백 함수
 * @returns {void}
 */
function subscribeTokenRefresh(cb: (token: string) => void): void {
  refreshSubscribers.push(cb);
}

/**
 * 요청 전에 액세스 토큰을 헤더에 추가하는 인터셉터
 */
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      // 헤더가 정의되어 있지 않을 경우 초기화
      config.headers = config.headers || {};
      config.headers["X-AUTH-TOKEN"] = `${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 응답에서 401 오류가 발생했을 때 토큰을 갱신하는 인터셉터
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers["X-AUTH-TOKEN"] = token;
            resolve(apiClient(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        alert("refreshToken 없음")
        removeTokens();
        window.location.href = "/login"; // 로그인 페이지로 리다이렉트
        alert("refreshToken 없음")
        return Promise.reject(error);
      }

      try {
        const response = await axios.post("/auth/refresh", {
          refreshToken: refreshToken,
        });

        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;

        setAccessToken(newAccessToken);
        setRefreshToken(newRefreshToken);

        apiClient.defaults.headers.common["X-AUTH-TOKEN"] = newAccessToken;
        originalRequest.headers["X-AUTH-TOKEN"] = newAccessToken;

        isRefreshing = false;
        onRefreshed(newAccessToken);

        return apiClient(originalRequest);
      } catch (err) {
        alert("refreshToken이 있지만 에러 발생")
        isRefreshing = false;
        removeTokens();
        window.location.href = "/login"; // 로그인 페이지로 리다이렉트
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
