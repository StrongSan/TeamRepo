import apiClient from "./apiClient";
import { BASE_URL } from "./config"; // 혹시 BASE_URL이 필요할 경우 대비
import { TokenManager } from "../utils/tokenManager";

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

// ✅ OTP 전송
export const sendOtp = async (phone: string) => {
  try {
    const response = await apiClient.post("/otp/send", { phone });
    return response.data;
  } catch (error) {
    console.error("[OTP 전송 실패]", error);
    throw error;
  }
};

// ✅ OTP 인증
export const verifyOtp = async (userId: string, phone: string, code: string) => {
  try {
    const response = await apiClient.post("/otp/verify", {
      userId: parseInt(userId),
      phone,
      code
    });
    return response.data;
  } catch (error) {
    console.error("[OTP 인증 실패]", error);
    throw error;
  }
};

// ✅ JWT 토큰 갱신
export const refreshToken = async (): Promise<{ accessToken: string; refreshToken: string }> => {
  try {
    const refreshToken = await TokenManager.getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('리프레시 토큰이 없습니다. 다시 로그인해주세요.');
    }

    console.log('🔄 토큰 갱신 요청 중...');
    
    const response = await apiClient.post("/auth/refresh", {
      refreshToken: refreshToken
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data;
    
    // 새 토큰들을 저장
    await TokenManager.saveTokens(accessToken, newRefreshToken);
    
    console.log('✅ 토큰 갱신 완료');
    return { accessToken, refreshToken: newRefreshToken };
  } catch (error) {
    console.error('❌ 토큰 갱신 실패:', error);
    
    // 토큰 갱신 실패 시 모든 토큰 삭제
    await TokenManager.clearTokens();
    throw error;
  }
};

// ✅ 로그아웃
export const logout = async (): Promise<void> => {
  try {
    const accessToken = await TokenManager.getAccessToken();
    
    if (accessToken) {
      // 백엔드에 로그아웃 요청
      await apiClient.post("/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
    }
  } catch (error) {
    console.error('❌ 로그아웃 요청 실패:', error);
    // 백엔드 요청이 실패해도 로컬 토큰은 삭제
  } finally {
    // 로컬 토큰 삭제
    await TokenManager.clearTokens();
    console.log('✅ 로그아웃 완료');
  }
};
