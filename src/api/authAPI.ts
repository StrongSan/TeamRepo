import apiClient from "./apiClient";
import { BASE_URL } from "./config"; // 혹시 BASE_URL이 필요할 경우 대비

// ✅ 카카오 로그인 요청 (백엔드 구조에 맞게 수정)
export const loginWithKakao = async (kakaoAccessToken: string) => {
  try {
    const response = await apiClient.post("/api/users/kakao/check", {
      accessToken: kakaoAccessToken,
    });

    console.log("백엔드 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("[카카오 로그인 실패]", error);
    throw error;
  }
};

// ✅ 네이버 로그인 요청
export const loginWithNaver = async (naverToken: string) => {
  try {
    const response = await apiClient.post("/auth/naver", {
      token: naverToken,
    });
    return response.data;
  } catch (error) {
    console.error("[네이버 로그인 실패]", error);
    throw error;
  }
};
