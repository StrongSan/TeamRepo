import apiClient from "./apiClient";
import { BASE_URL } from "./config"; // 혹시 BASE_URL이 필요할 경우 대비

// ✅ 카카오 로그인 요청
export const loginWithKakao = async (kakaoAccessToken: string) => {
  try {
    const response = await apiClient.post("/auth/kakao", {
      token: kakaoAccessToken,
    });

    console.log("응답:", response.data); // { nickname, token }
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
