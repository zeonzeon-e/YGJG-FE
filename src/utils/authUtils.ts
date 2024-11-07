/**
 * 액세스 토큰을 로컬 스토리지에서 가져오는 함수
 * @returns {string | null} 액세스 토큰 또는 null
 */
export function getAccessToken(): string | null {
  return localStorage.getItem("accessToken");
}

/**
 * 리프레시 토큰을 로컬 스토리지에서 가져오는 함수
 * @returns {string | null} 리프레시 토큰 또는 null
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem("refreshToken");
}

/**
 * 액세스 토큰을 로컬 스토리지에 저장하는 함수
 * @param {string} token - 저장할 액세스 토큰
 * @returns {void}
 */
export function setAccessToken(token: string): void {
  localStorage.setItem("accessToken", token);
}

/**
 * 리프레시 토큰을 로컬 스토리지에 저장하는 함수
 * @param {string} token - 저장할 리프레시 토큰
 * @returns {void}
 */
export function setRefreshToken(token: string): void {
  localStorage.setItem("refreshToken", token);
}

/**
 * 로컬 스토리지에서 액세스 토큰과 리프레시 토큰을 삭제하는 함수
 * @returns {void}
 */
export function removeTokens(): void {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

/**
 * JWT 토큰을 파싱하여 페이로드를 반환하는 함수
 * @param {string} token - JWT 토큰
 * @returns {any | null} 파싱된 페이로드 또는 null
 */
export function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

/**
 * 토큰의 만료 여부를 확인하는 함수
 * @param {string} token - 확인할 토큰
 * @returns {boolean} 토큰이 만료되었으면 true, 아니면 false
 */
export function isTokenExpired(token: string): boolean {
  const decoded = parseJwt(token);
  if (!decoded) {
    return true;
  }
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}
