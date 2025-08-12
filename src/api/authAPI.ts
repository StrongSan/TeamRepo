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

// ✅ 카카오 회원가입 요청 (신규 사용자)
export const registerKakaoUser = async (
  kakaoId: string,
  nickname: string,
  location: string,
  userType: string,
  selectedCakes: number[]
) => {
  try {
    console.log("📤 백엔드로 전송할 데이터:", {
      kakaoId: parseInt(kakaoId),
      nickname,
      location,
      userType,
      selectedCakes,
    });
    
    const response = await apiClient.post("/api/users/kakao/register", {
      kakaoId: parseInt(kakaoId),
      nickname: nickname,
      location: location,
      userType: userType,
      selectedCakes: selectedCakes,
    });

    console.log("📥 카카오 회원가입 응답:", response.data);
    console.log("📥 응답 상태:", response.status);
    return response.data;
  } catch (error) {
    console.error("[카카오 회원가입 실패]", error);
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
