import apiClient from "./apiClient";

// ✅ 요청 타입 정의
export interface SubmitProfileRequest {
  nickname: string;
  location: string;
  userType: "seller" | "customer";
  selectedCakes: number[];
}

// ✅ 응답 타입 정의 (백엔드의 응답 구조에 맞게)
export interface SubmitProfileResponse {
  token: string;
  user: {
    userId: number;
    nickname: string;
    userType: "seller" | "customer";
  };
}

// ✅ API 함수 정의
export const submitProfile = async (
  profileData: SubmitProfileRequest
): Promise<SubmitProfileResponse> => {
  const response = await apiClient.post("/api/users/register", profileData);
  return response.data;
};
